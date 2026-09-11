import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { MapPage } from './MapPage';

// Mock Leaflet in JSDOM environment to avoid canvas / DOM measurement limitations
vi.mock('leaflet', () => {
  const mockMap = {
    setView: vi.fn().mockReturnThis(),
    fitBounds: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    invalidateSize: vi.fn(),
    getZoom: vi.fn().mockReturnValue(13),
  };

  const mockLayerGroup = {
    addTo: vi.fn().mockReturnThis(),
    addLayer: vi.fn().mockReturnThis(),
    clearLayers: vi.fn().mockReturnThis(),
  };

  return {
    default: {
      map: vi.fn(() => mockMap),
      tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
      layerGroup: vi.fn(() => mockLayerGroup),
      marker: vi.fn(() => ({
        bindPopup: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
        openPopup: vi.fn().mockReturnThis(),
      })),
      divIcon: vi.fn(() => ({})),
      latLngBounds: vi.fn(() => ({})),
    },
  };
});

describe('MapPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    global.fetch = vi.fn();
  });

  it('renders page header and stat summary cards', async () => {
    const mockDevices = [
      {
        uuid: 'station-1',
        name: 'Stasiun Lab 1',
        projectName: 'Proyek INSIGHT',
        type: 'aqms',
        latitude: -6.974,
        longitude: 107.63,
        pm25: 35,
        temperature: 26,
        humidity: 60,
      },
      {
        uuid: 'station-2',
        name: 'Stasiun SOC 1',
        projectName: 'Proyek INSIGHT',
        type: 'soc',
        latitude: -6.975,
        longitude: 107.631,
        pm25: 75,
        temperature: 28,
        humidity: 55,
      },
    ];

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ devices: mockDevices }),
    } as Response);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MapPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Verify Title
    expect(screen.getByText('Peta Spasial Kualitas Udara')).toBeInTheDocument();

    // Wait for stations to be loaded
    await waitFor(() => {
      expect(screen.getByText('Stasiun Lab 1')).toBeInTheDocument();
      expect(screen.getByText('Stasiun SOC 1')).toBeInTheDocument();
    });

    // Verify Summary Cards
    expect(screen.getByText('Total Alat Terpasang')).toBeInTheDocument();
    expect(screen.getByText('Kualitas Baik (ISPU)')).toBeInTheDocument();
    expect(screen.getByText('Kualitas Sedang')).toBeInTheDocument();
  });

  it('filters stations by type when buttons are clicked', async () => {
    const mockDevices = [
      { uuid: '1', name: 'Alat AQMS Utama', type: 'aqms', pm25: 25 },
      { uuid: '2', name: 'Alat SOC Sensor', type: 'soc', pm25: 45 },
    ];

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ devices: mockDevices }),
    } as Response);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MapPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Alat AQMS Utama')).toBeInTheDocument();
      expect(screen.getByText('Alat SOC Sensor')).toBeInTheDocument();
    });

    // Click AQMS filter
    const aqmsBtn = screen.getByRole('button', { name: /^AQMS$/i });
    aqmsBtn.click();

    await waitFor(() => {
      expect(screen.getByText('Alat AQMS Utama')).toBeInTheDocument();
      expect(screen.queryByText('Alat SOC Sensor')).not.toBeInTheDocument();
    });
  });
});
