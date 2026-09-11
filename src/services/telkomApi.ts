import { apiFetch } from '@/lib/api';
import {
  adaptTelkomAllToStations,
  adaptTelkomHistoryToTelemetry,
  type NormalizedTelkomStation,
  type NormalizedTelemetryPoint,
  type TelkomAllResponse,
  type TelkomHistoryResponse,
} from '@/adapters/telkomAdapter';

export interface TelkomHistoryOptions {
  location: string;
  timeLow?: string;
  timeHigh?: string;
}

/**
 * Fetch overview of all 3 Telkom University stations
 * Endpoint: /api/telkom/all
 */
export async function getTelkomStationsOverview(): Promise<NormalizedTelkomStation[]> {
  try {
    const res = await apiFetch('/api/telkom/all');
    if (!res.ok) {
      throw new Error(`Failed to fetch Telkom stations: ${res.status} ${res.statusText}`);
    }
    const data: TelkomAllResponse = await res.json();
    return adaptTelkomAllToStations(data);
  } catch (err) {
    console.warn('[telkomApi] Failed to fetch /api/telkom/all, using fallback:', err);
    throw err;
  }
}

/**
 * Fetch 2-minute interval history for a specific Telkom station
 * Endpoint: /api/:location/2m?time_low=...&time_high=...
 */
export async function getTelkomStationHistory(
  options: TelkomHistoryOptions
): Promise<NormalizedTelemetryPoint[]> {
  const { location, timeLow, timeHigh } = options;
  const params = new URLSearchParams();
  if (timeLow) params.set('time_low', timeLow);
  if (timeHigh) params.set('time_high', timeHigh);

  const query = params.toString() ? `?${params.toString()}` : '';
  const endpoint = `/api/${location}/2m${query}`;

  try {
    const res = await apiFetch(endpoint);
    if (!res.ok) {
      throw new Error(`Failed to fetch history for ${location}: ${res.status} ${res.statusText}`);
    }
    const data: TelkomHistoryResponse = await res.json();
    return adaptTelkomHistoryToTelemetry(data);
  } catch (err) {
    console.warn(`[telkomApi] Failed to fetch ${endpoint}:`, err);
    throw err;
  }
}
