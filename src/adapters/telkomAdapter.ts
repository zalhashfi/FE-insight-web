import type { MapStation } from '@/components/map/AirQualityMap';

// Raw DTO from /api/telkom/all
export interface TelkomOverviewRaw {
  created_at: string;
  temperature: string | null;
  humidity: string | null;
  co2: string | null;
  pm25: string | null;
  ws: string | null;
  wd: string | null;
}

export type TelkomAllResponse = Record<string, TelkomOverviewRaw>;

// Raw DTO item from /api/:location/2m (e.g. /api/TULT/2m)
export interface TelkomHistoryItemRaw {
  id: number;
  created_at: string;
  temperature: string | null;
  humidity: string | null;
  sht31_temp: string | null;
  sht31_hum: string | null;
  co2: string | null;
  pm25: string | null;
  ws: string | null;
  wd: string | null;
  pressure: string | null;
  solar: string | null;
  solar_cast: string | null;
  rainfall: string | null;
}

export type TelkomHistoryResponse = TelkomHistoryItemRaw[];

// Known coordinates for Telkom University campus locations
export const TELKOM_LOCATION_COORDS: Record<string, { lat: number; lng: number; name: string; description: string }> = {
  TULT: {
    lat: -6.968739,
    lng: 107.628128,
    name: 'TULT',
    description: 'Stasiun Pemantau Kualitas Udara Outdoor TULT',
  },
  GKU: {
    lat: -6.972739,
    lng: 107.629506,
    name: 'GKU',
    description: 'Stasiun Pemantau Kualitas Udara Outdoor GKU',
  },
  Deli: {
    lat: -6.975472,
    lng: 107.629619,
    name: 'Gedung Deli',
    description: 'Stasiun Pemantau Kualitas Udara Outdoor Gedung Deli',
  },
};

// Normalized domain types
export interface NormalizedTelkomStation extends MapStation {
  locationKey: string;
  co2?: number | null;
  windSpeed?: number | null;
  windDirection?: number | null;
  lastUpdated?: string;
}

export interface NormalizedTelemetryPoint {
  id: number;
  timestamp: string;
  created_at: string;
  pm25: number | null;
  temperature: number | null;
  humidity: number | null;
  co2: number | null;
  windSpeed: number | null;
  windDirection: number | null;
}

function parseNumeric(val: string | number | null | undefined): number | null {
  if (val == null || val === '') return null;
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? null : num;
}

/** Ambang basi: stasiun tanpa kabar > 60 menit dianggap mati. */
export const STALE_AFTER_MS = 60 * 60 * 1000;

/**
 * true bila created_at absen, tak terparse, di masa depan, atau lebih tua dari ambang.
 * Format API "YYYY-MM-DD HH:mm:ss" diasumsikan waktu lokal.
 */
export function isStationStale(createdAt: string | null | undefined, nowMs: number = Date.now()): boolean {
  if (!createdAt) return true;
  const ts = new Date(createdAt.replace(' ', 'T')).getTime();
  if (Number.isNaN(ts)) return true;
  const age = nowMs - ts;
  if (age < 0) return false;
  return age > STALE_AFTER_MS;
}

/**
 * Adapts /api/telkom/all dictionary response to an array of MapStation objects
 */
export function adaptTelkomAllToStations(raw: TelkomAllResponse): NormalizedTelkomStation[] {
  return Object.entries(raw).flatMap(([key, data]) => {
    const meta = TELKOM_LOCATION_COORDS[key];
    // Kunci stasiun tak dikenal dilewati — tanpa nama/koordinat karangan.
    if (!meta) return [];

    const temp = parseNumeric(data.temperature);
    // pony-tail: ignore negative dummy sensor temperature readings (-1.00)
    const validTemp = temp != null && temp > -40 && temp !== -1 ? temp : null;

    const pm25 = parseNumeric(data.pm25);
    const humidity = parseNumeric(data.humidity);
    const co2 = parseNumeric(data.co2);
    const ws = parseNumeric(data.ws);
    const wd = parseNumeric(data.wd);
    // Stasiun basi dianggap mati: nilai dikosongkan agar kartu tampil — + Offline,
    // bukan angka terakhir yang menyesatkan.
    const stale = isStationStale(data.created_at);

    return {
      uuid: `telkom-${key.toLowerCase()}`,
      locationKey: key,
      name: meta.name,
      projectName: 'Telkom University AQMS',
      type: 'aqms',
      macAddress: `TELKOM-NODE-${key.toUpperCase()}`,
      currentVersion: 'v2.4-telkom',
      latitude: meta.lat,
      longitude: meta.lng,
      status: stale ? 'offline' : pm25 != null ? 'online' : 'warning',
      pm25: stale ? null : pm25,
      temperature: stale ? null : validTemp,
      humidity: stale ? null : humidity,
      co2: stale ? null : co2,
      windSpeed: stale ? null : ws,
      windDirection: stale ? null : wd,
      lastUpdated: data.created_at,
    };
  });
}

/**
 * Adapts /api/:location/2m history array to unified telemetry points
 */
export function adaptTelkomHistoryToTelemetry(raw: TelkomHistoryResponse): NormalizedTelemetryPoint[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((item) => {
    const rawTemp = parseNumeric(item.temperature);
    const fallbackTemp = parseNumeric(item.sht31_temp);
    const validTemp =
      rawTemp != null && rawTemp > -40 && rawTemp !== -1
        ? rawTemp
        : fallbackTemp != null && fallbackTemp > -40 && fallbackTemp !== -1
        ? fallbackTemp
        : null;

    const rawHum = parseNumeric(item.humidity);
    const fallbackHum = parseNumeric(item.sht31_hum);
    const validHum =
      rawHum != null && rawHum >= 0
        ? rawHum
        : fallbackHum != null && fallbackHum >= 0
        ? fallbackHum
        : null;

    return {
      id: item.id,
      timestamp: item.created_at,
      created_at: item.created_at,
      pm25: parseNumeric(item.pm25),
      temperature: validTemp,
      humidity: validHum,
      co2: parseNumeric(item.co2),
      windSpeed: parseNumeric(item.ws),
      windDirection: parseNumeric(item.wd),
    };
  });
}
