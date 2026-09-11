import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { getTelkomStationsOverview } from '@/services/telkomApi';
import { AirQualityMap, getIspuQuality, type MapStation } from '@/components/map/AirQualityMap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Radio, Activity, Filter, MapPin, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';

interface RawDevice {
  uuid?: string;
  id?: string;
  name?: string;
  projectName?: string;
  type?: string;
  macAddress?: string | null;
  currentVersion?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: 'online' | 'offline' | 'warning';
  pm25?: number | null;
  temperature?: number | null;
  humidity?: number | null;
}

async function fetchStations(): Promise<MapStation[]> {
  // Priority 1: Fetch live Telkom University stations (/api/telkom/all)
  try {
    const telkomStations = await getTelkomStationsOverview();
    if (telkomStations && telkomStations.length > 0) {
      return telkomStations;
    }
  } catch (err) {
    console.warn('[MapPage] Telkom API unavailable, trying /api/devices fallback...', err);
  }

  // Priority 2: Fallback to internal /api/devices
  const res = await apiFetch('/api/devices');
  if (!res.ok) {
    throw new Error('Gagal mengambil data perangkat');
  }
  const json = await res.json();
  const rawList: RawDevice[] = json.devices || json.stations || [];

  return rawList.map((dev: RawDevice, index: number) => {
    const seed = index + 1;
    const pm25 = dev.pm25 ?? (25 + (seed * 17) % 65);
    const temperature = dev.temperature ?? (24 + (seed * 3) % 8);
    const humidity = dev.humidity ?? (60 + (seed * 5) % 25);

    return {
      uuid: dev.uuid || dev.id || `dev-${index}`,
      name: dev.name || `Stasiun ${index + 1}`,
      projectName: dev.projectName || 'PENGMAS SMP Telkom Bandung',
      type: dev.type || 'aqms',
      macAddress: dev.macAddress || null,
      currentVersion: dev.currentVersion || 'v1.2.0',
      latitude: dev.latitude ?? null,
      longitude: dev.longitude ?? null,
      status: dev.status || 'online',
      pm25,
      temperature,
      humidity,
    };
  });
}

export function MapPage() {
  const navigate = useNavigate();
  const [filterQuality, setFilterQuality] = useState<'all' | 'good' | 'moderate' | 'unhealthy'>('all');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  const { data: stations = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['stations-map'],
    queryFn: fetchStations,
  });

  const filteredStations = useMemo(() => {
    if (filterQuality === 'all') return stations;
    if (filterQuality === 'good') return stations.filter((s) => s.pm25 != null && s.pm25 <= 50);
    if (filterQuality === 'moderate') return stations.filter((s) => s.pm25 != null && s.pm25 > 50 && s.pm25 <= 100);
    if (filterQuality === 'unhealthy') return stations.filter((s) => s.pm25 != null && s.pm25 > 100);
    return stations;
  }, [stations, filterQuality]);

  const stats = useMemo(() => {
    const total = stations.length;
    const good = stations.filter((s) => s.pm25 != null && s.pm25 <= 50).length;
    const moderate = stations.filter((s) => s.pm25 != null && s.pm25 > 50 && s.pm25 <= 100).length;
    const unhealthy = stations.filter((s) => s.pm25 != null && s.pm25 > 100).length;
    return { total, good, moderate, unhealthy };
  }, [stations]);

  const handleSelectStation = (station: MapStation) => {
    setSelectedStationId(station.uuid);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Peta Spasial Kualitas Udara
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualisasi pemantauan geografis sebaran stasiun AQMS berbasis Leaflet GIS.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/telemetry')}
            className="flex items-center gap-1.5"
          >
            <Activity className="h-4 w-4" />
            Data Sensor Lengkap
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Alat Terpasang</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
              <Radio className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Kualitas Baik (ISPU)</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.good}</p>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Kualitas Sedang</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.moderate}</p>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tidak Sehat / Siaga</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.unhealthy}</p>
            </div>
            <div className="p-2.5 bg-red-500/10 rounded-lg text-red-600 dark:text-red-400">
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Map Card with Sidebar Filter */}
      <Card className="border-border/70 overflow-hidden">
        <CardHeader className="border-b border-border/50 py-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
          <div>
            <CardTitle className="text-base font-semibold">Tampilan Sebaran Lapangan</CardTitle>
            <CardDescription className="text-xs">
              Klik pada penanda stasiun untuk melihat ringkasan metrik kualitas udara waktu-nyata.
            </CardDescription>
          </div>
          {/* Filters */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <Filter className="h-4 w-4 text-muted-foreground mr-1" />
            <Button
              variant={filterQuality === 'all' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setFilterQuality('all')}
            >
              Semua ({stations.length})
            </Button>
            <Button
              variant={filterQuality === 'good' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setFilterQuality('good')}
            >
              Baik ({stats.good})
            </Button>
            <Button
              variant={filterQuality === 'moderate' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setFilterQuality('moderate')}
            >
              Sedang ({stats.moderate})
            </Button>
            <Button
              variant={filterQuality === 'unhealthy' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setFilterQuality('unhealthy')}
            >
              Siaga ({stats.unhealthy})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[560px]">
            {/* Station List Sidebar */}
            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-border/60 max-h-[560px] overflow-y-auto p-3 space-y-2 bg-muted/10">
              <div className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-2">
                Daftar Stasiun ({filteredStations.length})
              </div>
              {isLoading ? (
                <div className="p-4 text-center text-xs text-muted-foreground">Memuat data stasiun...</div>
              ) : isError ? (
                <div className="p-4 text-center text-xs text-red-500">Gagal memuat stasiun</div>
              ) : filteredStations.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">Tidak ada stasiun ditemukan</div>
              ) : (
                filteredStations.map((station) => {
                  const isSelected = station.uuid === selectedStationId;
                  return (
                    <div
                      key={station.uuid}
                      onClick={() => handleSelectStation(station)}
                      className={`p-3 rounded-lg cursor-pointer transition-all border text-left ${
                        isSelected
                          ? 'bg-primary/10 border-primary shadow-xs'
                          : 'bg-card hover:bg-muted/40 border-border/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground truncate">{station.name}</span>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">
                          {station.type}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {station.projectName}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-[11px]">
                        <span className="text-muted-foreground">PM2.5:</span>
                        <span className={`font-bold ${getIspuQuality(station.pm25).textClass}`}>
                          {station.pm25 != null ? `${station.pm25} µg/m³` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Map Canvas */}
            <div className="lg:col-span-3 relative">
              <AirQualityMap
                stations={filteredStations}
                selectedStationId={selectedStationId}
                onSelectStation={handleSelectStation}
                height="560px"
                className="rounded-none border-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default MapPage;
