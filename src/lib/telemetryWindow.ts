import type { NormalizedTelemetryPoint } from '@/adapters/telkomAdapter';

export type StationKey = 'tult' | 'gku' | 'deli';

/** Interval data alat: 2 menit. */
export const BUCKET_MS = 120_000;
/** 1 jam / 2 menit = 30 langkah, inklusif kedua ujung → 31 titik. */
export const WINDOW_POINT_COUNT = 31;

const HOUR_MS = 3_600_000;

export interface WindowPoint {
  time: string; // "12.04"
  date: string; // "13 Sep 2026"
  fullTime: string; // "13 Sep 2026 12.04"
  timestamp: number; // awal bucket (ms)
  tult: number | null;
  gku: number | null;
  deli: number | null;
}

export interface TelemetryWindow {
  points: WindowPoint[];
  /** "12.00–13.00"; string kosong bila tidak ada data sama sekali. */
  windowLabel: string;
  /** "13 Sep 2026"; string kosong bila tidak ada data sama sekali. */
  dateRange: string;
  /** true bila ada ≥1 nilai pm25 non-null di dalam jendela. */
  hasAnyValue: boolean;
  /** Stasiun yang punya ≥1 nilai pm25 non-null di dalam jendela. */
  stationsWithData: Record<StationKey, boolean>;
  /** Nilai pm25 non-null terakhir di dalam jendela; null bila stasiun tidak punya data. */
  latest: Record<StationKey, number | null>;
}

const STATIONS: StationKey[] = ['tult', 'gku', 'deli'];

const emptyWindow: TelemetryWindow = {
  points: [],
  windowLabel: '',
  dateRange: '',
  hasAnyValue: false,
  stationsWithData: { tult: false, gku: false, deli: false },
  latest: { tult: null, gku: null, deli: null },
};

function formatHourMinute(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Bangun jendela satu jam penuh terakhir yang sudah selesai dari tiga seri telemetri.
 * Data 13.18 → jendela 12.00–13.00 (31 bucket per 2 menit, inklusif kedua ujung).
 * Entri di luar [windowStart, windowEnd] dibuang. Tidak ada pengisian,
 * penyambungan, atau pembulatan ke stasiun lain.
 */
export function buildTelemetryWindow(
  series: Record<StationKey, NormalizedTelemetryPoint[]>
): TelemetryWindow {
  const entries: Array<{ station: StationKey; ts: number; pm25: number | null }> = [];

  for (const station of STATIONS) {
    const list = series[station] ?? [];
    for (const item of list) {
      if (!item.created_at) continue;
      const ts = new Date(item.created_at).getTime();
      if (Number.isNaN(ts)) continue;
      entries.push({
        station,
        ts,
        pm25: typeof item.pm25 === 'number' ? item.pm25 : null,
      });
    }
  }

  if (entries.length === 0) {
    return { ...emptyWindow };
  }

  let maxTs = entries[0].ts;
  for (const e of entries) {
    if (e.ts > maxTs) maxTs = e.ts;
  }

  const windowEnd = Math.floor(maxTs / HOUR_MS) * HOUR_MS;
  const windowStart = windowEnd - HOUR_MS;

  const buckets: Array<{ timestamp: number; tult: number | null; gku: number | null; deli: number | null }> =
    Array.from({ length: WINDOW_POINT_COUNT }, (_, i) => ({
      timestamp: windowStart + i * BUCKET_MS,
      tult: null,
      gku: null,
      deli: null,
    }));

  for (const e of entries) {
    if (e.ts < windowStart || e.ts > windowEnd) continue;
    if (e.pm25 == null) continue;
    const bucketTs = Math.floor(e.ts / BUCKET_MS) * BUCKET_MS;
    const idx = Math.round((bucketTs - windowStart) / BUCKET_MS);
    if (idx < 0 || idx >= WINDOW_POINT_COUNT) continue;
    buckets[idx][e.station] = e.pm25;
  }

  const points: WindowPoint[] = buckets.map((b) => {
    const time = formatHourMinute(b.timestamp);
    const date = formatDate(b.timestamp);
    return {
      time,
      date,
      fullTime: `${date} ${time}`,
      timestamp: b.timestamp,
      tult: b.tult,
      gku: b.gku,
      deli: b.deli,
    };
  });

  const stationsWithData: Record<StationKey, boolean> = { tult: false, gku: false, deli: false };
  const latest: Record<StationKey, number | null> = { tult: null, gku: null, deli: null };

  for (const station of STATIONS) {
    for (let i = points.length - 1; i >= 0; i--) {
      const v = points[i][station];
      if (v != null) {
        stationsWithData[station] = true;
        latest[station] = v;
        break;
      }
    }
  }

  const hasAnyValue = STATIONS.some((s) => stationsWithData[s]);

  return {
    points,
    windowLabel: `${formatHourMinute(windowStart)}–${formatHourMinute(windowEnd)}`,
    dateRange: points[0].date,
    hasAnyValue,
    stationsWithData,
    latest,
  };
}
