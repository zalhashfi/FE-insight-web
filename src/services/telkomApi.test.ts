import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  adaptTelkomAllToStations,
  adaptTelkomHistoryToTelemetry,
  isStationStale,
  type TelkomAllResponse,
  type TelkomHistoryResponse,
} from '@/adapters/telkomAdapter';
import { getTelkomStationsOverview, getTelkomStationHistory } from '@/services/telkomApi';
import * as api from '@/lib/api';
describe('telkomAdapter', () => {
  it('menandai stasiun basi sebagai offline dan mengosongkan nilai', () => {
    const now = new Date('2026-09-13T17:05:00').getTime();
    // 3 hari basi → stale; 3 menit segar → tidak stale.
    expect(isStationStale('2026-09-10 23:00:00', now)).toBe(true);
    expect(isStationStale('2026-09-13 17:02:00', now)).toBe(false);
    expect(isStationStale(null, now)).toBe(true);
    expect(isStationStale('bukan-tanggal', now)).toBe(true);

    const stations = adaptTelkomAllToStations({
      Deli: { created_at: '2026-09-10 23:00:00', temperature: '25.07', humidity: '80', co2: '682', pm25: '99.16', ws: '0.29', wd: '287' },
    });
    expect(stations).toHaveLength(1);
    expect(stations[0].status).toBe('offline');
    expect(stations[0].pm25).toBeNull();
    expect(stations[0].temperature).toBeNull();
  });

  it('correctly adapts /api/telkom/all raw object into NormalizedTelkomStation array', () => {
    const rawMock: TelkomAllResponse = {
      TULT: {
        created_at: '2026-09-13 17:00:00',
        temperature: '-1.00',
        humidity: null,
        co2: '522',
        pm25: '58',
        ws: '2.59',
        wd: '184',
      },
      GKU: {
        created_at: '2026-09-13 17:02:00',
        temperature: '32.18',
        humidity: '54',
        co2: '556',
        pm25: '76',
        ws: '4.08',
        wd: '43',
      },
      Deli: {
        created_at: '2026-09-10 23:00:00',
        temperature: '25.07',
        humidity: '80',
        co2: '682',
        pm25: '99.16',
        ws: '0.29',
        wd: '287',
      },
    };

    const stations = adaptTelkomAllToStations(rawMock);

    expect(stations).toHaveLength(3);

    const tult = stations.find((s) => s.locationKey === 'TULT');
    expect(tult).toBeDefined();
    expect(tult?.name).toContain('TULT');
    expect(tult?.pm25).toBe(58);
    // Dummy sensor value -1.00 should be ignored (null)
    expect(tult?.temperature).toBeNull();
    expect(tult?.co2).toBe(522);
    expect(tult?.windSpeed).toBe(2.59);
    expect(tult?.latitude).toBeCloseTo(-6.968739, 4);

    const gku = stations.find((s) => s.locationKey === 'GKU');
    expect(gku).toBeDefined();
    expect(gku?.temperature).toBeCloseTo(32.18, 2);
    expect(gku?.humidity).toBe(54);
    expect(gku?.status).toBe('online');

    // Deli 2026-09-10 basi → offline, nilai dikosongkan.
    const deli = stations.find((s) => s.locationKey === 'Deli');
    expect(deli?.status).toBe('offline');
    expect(deli?.pm25).toBeNull();
  });

  it('correctly adapts /api/:location/2m raw history array into NormalizedTelemetryPoint array', () => {
    const rawHistoryMock: TelkomHistoryResponse = [
      {
        id: 591360,
        created_at: '2026-09-10 15:30:00',
        temperature: '-1.00',
        humidity: null,
        sht31_temp: '26.4',
        sht31_hum: '65',
        co2: '562',
        pm25: '64',
        ws: '2.27',
        wd: '294',
        pressure: null,
        solar: null,
        solar_cast: null,
        rainfall: null,
      },
    ];

    const telemetry = adaptTelkomHistoryToTelemetry(rawHistoryMock);

    expect(telemetry).toHaveLength(1);
    expect(telemetry[0].id).toBe(591360);
    expect(telemetry[0].pm25).toBe(64);
    // should fall back to sht31_temp when temperature is -1.00 dummy
    expect(telemetry[0].temperature).toBe(26.4);
    expect(telemetry[0].humidity).toBe(65);
    expect(telemetry[0].co2).toBe(562);
    expect(telemetry[0].windSpeed).toBe(2.27);
  });
});

describe('telkomApi service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it('getTelkomStationsOverview calls /api/telkom/all and parses stations', async () => {
    const d = new Date(Date.now() - 5 * 60 * 1000);
    const p = (n: number) => String(n).padStart(2, '0');
    const recent = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    const mockData = {
      TULT: {
        created_at: recent,
        temperature: '28.0',
        humidity: '60',
        co2: '500',
        pm25: '35',
        ws: '1.2',
        wd: '90',
      },
    };

    vi.spyOn(api, 'apiFetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await getTelkomStationsOverview();
    expect(result).toHaveLength(1);
    expect(result[0].locationKey).toBe('TULT');
    expect(result[0].pm25).toBe(35);
  });

  it('getTelkomStationHistory calls correct query URL', async () => {
    const mockHistory = [
      {
        id: 1,
        created_at: '2026-09-11 10:00:00',
        temperature: '27.5',
        humidity: '70',
        sht31_temp: null,
        sht31_hum: null,
        co2: '450',
        pm25: '25',
        ws: '1.0',
        wd: '120',
        pressure: null,
        solar: null,
        solar_cast: null,
        rainfall: null,
      },
    ];

    const fetchSpy = vi.spyOn(api, 'apiFetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockHistory,
    } as Response);

    const result = await getTelkomStationHistory({
      location: 'TULT',
      timeLow: '2026-09-01',
      timeHigh: '2026-09-02',
    });

    expect(fetchSpy).toHaveBeenCalledWith('/api/TULT/2m?time_low=2026-09-01&time_high=2026-09-02');
    expect(result).toHaveLength(1);
    expect(result[0].pm25).toBe(25);
  });
});
