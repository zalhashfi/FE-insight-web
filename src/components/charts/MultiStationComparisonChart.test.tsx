import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MultiStationComparisonChart } from './MultiStationComparisonChart';
import * as telkomApi from '@/services/telkomApi';

vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('MultiStationComparisonChart', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.restoreAllMocks();
  });

  it('renders title, station color indicators, and lines for 3 stations', async () => {
    vi.spyOn(telkomApi, 'getTelkomStationHistory').mockImplementation(async ({ location }) => {
      if (location === 'TULT') {
        return [{ id: 1, timestamp: '2026-09-11 12:00:00', created_at: '2026-09-11 12:00:00', pm25: 58, temperature: 28, humidity: 60, co2: 500, windSpeed: 2, windDirection: 180 }];
      }
      if (location === 'GKU') {
        return [{ id: 2, timestamp: '2026-09-11 12:00:00', created_at: '2026-09-11 12:00:00', pm25: 76, temperature: 32, humidity: 54, co2: 550, windSpeed: 4, windDirection: 45 }];
      }
      return [{ id: 3, timestamp: '2026-09-11 12:00:00', created_at: '2026-09-11 12:00:00', pm25: 99, temperature: 25, humidity: 80, co2: 680, windSpeed: 0.3, windDirection: 280 }];
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MultiStationComparisonChart timeRangeHours={6} />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Komparasi PM2.5 Antar Stasiun/i)).toBeInTheDocument();
    expect(screen.getAllByText('TULT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('GKU').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Gedung Deli').length).toBeGreaterThanOrEqual(1);
  });
});
