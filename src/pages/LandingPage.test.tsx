import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import LandingPage from './LandingPage';
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock Three.js canvas to avoid WebGL context requirements in test environment
vi.mock('@/components/three/NetworkBackground', () => ({
  default: () => <div data-testid="network-background-mock" />,
}));

// Mock Recharts ResponsiveContainer to render in jsdom
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('LandingPage', () => {
  it('renders all key sections correctly', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ThemeProvider>
            <LandingPage />
          </ThemeProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
    // 1. Header & Hero
    expect(screen.getAllByText(/INSIGHT Lab/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Pemantauan Kualitas/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Buka Dashboard/i).length).toBeGreaterThanOrEqual(1);

    // 2. Partner Showcase
    expect(screen.getByText(/Mitra Riset & Institusi Pendukung/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Telkom University/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/IPB University/i)).toBeInTheDocument();
    expect(screen.getByText(/Kanazawa University/i)).toBeInTheDocument();
    // 3. Project Showcase (SMP Telkom)
    expect(screen.getByText(/Implementasi di SMP Telkom/i)).toBeInTheDocument();
    expect(screen.getByText(/Titik Indoor/i)).toBeInTheDocument();
    expect(screen.getByText(/Titik Outdoor & EWS/i)).toBeInTheDocument();

    // 4. Live Telemetry
    expect(screen.getByText(/Grafik Telemetri Lapangan/i)).toBeInTheDocument();
    expect(screen.getByText(/PM 2.5 Terakhir/i)).toBeInTheDocument();
    // 5. Map Preview Section (GIS)
    expect(screen.getByText(/Pemetaan Kualitas Udara Real-Time/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Peta Spasial/i).length).toBeGreaterThanOrEqual(1);

    // 6. Footer
    expect(screen.getAllByText(/PT Ekshalasi Langit Biru/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Powered by Data. Driven by Impact./i)).toBeInTheDocument();
  });
});
