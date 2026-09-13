import { describe, it, expect } from 'vitest';
import { buildTelemetryWindow, WINDOW_POINT_COUNT, type StationKey } from './telemetryWindow';
import type { NormalizedTelemetryPoint } from '@/adapters/telkomAdapter';

function makePoints(start: Date, spanMinutes: number, stepMinutes: number, pm25: number | null): NormalizedTelemetryPoint[] {
  const pts: NormalizedTelemetryPoint[] = [];
  let id = 1;
  for (let m = 0; m <= spanMinutes; m += stepMinutes) {
    const d = new Date(start.getTime() + m * 60_000);
    pts.push({
      id: id++,
      timestamp: d.toISOString(),
      created_at: d.toISOString(),
      pm25,
      temperature: null,
      humidity: null,
      co2: null,
      windSpeed: null,
      windDirection: null,
    });
  }
  return pts;
}

function pointAt(local: string, pm25: number | null): NormalizedTelemetryPoint {
  const [datePart, timePart] = local.split(' ');
  const [y, mo, d] = datePart.split('-').map(Number);
  const [h, mi] = timePart.split(':').map(Number);
  const dt = new Date(y, mo - 1, d, h, mi, 0);
  return {
    id: 1,
    timestamp: dt.toISOString(),
    created_at: dt.toISOString(),
    pm25,
    temperature: null,
    humidity: null,
    co2: null,
    windSpeed: null,
    windDirection: null,
  };
}

const EMPTY: Record<StationKey, NormalizedTelemetryPoint[]> = { tult: [], gku: [], deli: [] };

describe('buildTelemetryWindow', () => {
  it('menghasilkan jendela jam selesai 12.00–13.00 untuk data sampai 13.18', () => {
    const start = new Date(2026, 8, 13, 12, 0, 0);
    const series = {
      tult: makePoints(start, 78, 2, 58),
      gku: makePoints(start, 78, 2, 76),
      deli: makePoints(start, 78, 2, 99),
    };

    const w = buildTelemetryWindow(series);

    expect(w.points.length).toBe(WINDOW_POINT_COUNT);
    expect(w.points.length).toBe(31);
    expect(w.points[0].time).toBe('12.00');
    expect(w.points[30].time).toBe('13.00');
    expect(w.windowLabel).toBe('12.00–13.00');
    expect(w.dateRange).toBe(w.points[0].date);
    expect(w.points.some((p) => p.time === '13.02')).toBe(false);
    expect(w.hasAnyValue).toBe(true);
    expect(w.stationsWithData).toEqual({ tult: true, gku: true, deli: true });
    expect(w.latest).toEqual({ tult: 58, gku: 76, deli: 99 });
  });

  it('stasiun mati tidak menghasilkan garis maupun angka', () => {
    const start = new Date(2026, 8, 13, 12, 0, 0);
    const series = {
      tult: makePoints(start, 78, 2, 58),
      gku: makePoints(start, 78, 2, 76),
      deli: [],
    };

    const w = buildTelemetryWindow(series);

    expect(w.points.length).toBe(31);
    expect(w.stationsWithData.deli).toBe(false);
    expect(w.latest.deli).toBeNull();
    expect(w.points.every((p) => p.deli === null)).toBe(true);
    expect(w.stationsWithData.tult).toBe(true);
    expect(w.hasAnyValue).toBe(true);
  });

  it('semua kosong menghasilkan jendela kosong', () => {
    const w = buildTelemetryWindow({ ...EMPTY });

    expect(w.points.length).toBe(0);
    expect(w.hasAnyValue).toBe(false);
    expect(w.windowLabel).toBe('');
    expect(w.dateRange).toBe('');
    expect(w.stationsWithData).toEqual({ tult: false, gku: false, deli: false });
    expect(w.latest).toEqual({ tult: null, gku: null, deli: null });
  });

  it('celah data tidak diisi dari tetangga', () => {
    const start = new Date(2026, 8, 13, 12, 0, 0);
    const series = {
      tult: [pointAt('2026-09-13 12:00', 58), pointAt('2026-09-13 12:02', 59), pointAt('2026-09-13 12:08', 61)],
      gku: makePoints(start, 78, 2, 76),
      deli: makePoints(start, 78, 2, 99),
    };

    const w = buildTelemetryWindow(series);

    expect(w.windowLabel).toBe('12.00–13.00');
    expect(typeof w.points[0].tult).toBe('number');
    expect(typeof w.points[1].tult).toBe('number');
    expect(w.points[2].tult).toBeNull();
    expect(w.points[3].tult).toBeNull();
    expect(typeof w.points[4].tult).toBe('number');
  });

  it('data di luar jendela dibuang dan tidak memengaruhi latest', () => {
    const start = new Date(2026, 8, 13, 12, 0, 0);
    const tult = makePoints(start, 78, 2, 58);
    // Titik di luar jendela (13.18) membawa nilai berbeda — harus diabaikan.
    tult[tult.length - 1] = { ...tult[tult.length - 1], pm25: 61 };
    const series = {
      tult,
      gku: makePoints(start, 78, 2, 76),
      deli: makePoints(start, 78, 2, 99),
    };

    const w = buildTelemetryWindow(series);

    const ts1300 = new Date(2026, 8, 13, 13, 0, 0).getTime();
    expect(w.points.every((p) => p.timestamp <= ts1300)).toBe(true);
    expect(w.latest.tult).toBe(58);
  });
});
