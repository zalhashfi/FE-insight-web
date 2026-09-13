import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { LiveTelemetryPreview } from './LiveTelemetryPreview';
import * as telkomApi from '@/services/telkomApi';
import type * as Recharts from 'recharts';
import type { NormalizedTelemetryPoint } from '@/adapters/telkomAdapter';
vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof Recharts>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

vi.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
  ChartLegend: () => null,
  ChartLegendContent: () => null,
}));


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

describe('LiveTelemetryPreview', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.restoreAllMocks();
  });

  function renderComponent() {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LiveTelemetryPreview />
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  it('semua stasiun kosong → empty state, chart tidak dirender', async () => {
    vi.spyOn(telkomApi, 'getTelkomStationHistory').mockResolvedValue([]);

    const { container } = renderComponent();

    expect(await screen.findByText(/Belum ada data telemetri pada jam/i)).toBeInTheDocument();
    expect(container.querySelector('[data-testid="telemetry-chart"]')).toBeNull();
  });

  it('Deli kosong, TULT/GKU terisi → kartu Deli “—”, tanpa angka karangan', async () => {
    const start = new Date(2026, 8, 13, 12, 0, 0);
    vi.spyOn(telkomApi, 'getTelkomStationHistory').mockImplementation(async ({ location }) => {
      if (location === 'TULT') return makePoints(start, 78, 2, 58);
      if (location === 'GKU') return makePoints(start, 78, 2, 76);
      return [];
    });

    const { container } = renderComponent();

    expect(await screen.findByTestId('telemetry-chart')).toBeInTheDocument();
    // Kartu KPI menampilkan nilai jendela; Deli kosong → em-dash.
    expect(container.textContent).toContain('58');
    expect(container.textContent).toContain('76');
    expect(container.textContent).toContain('—');
    expect(screen.getAllByText('Gedung Deli').length).toBeGreaterThanOrEqual(1);
  });
});
