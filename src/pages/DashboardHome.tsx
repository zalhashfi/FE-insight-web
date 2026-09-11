import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Radio, AlertCircle, Clock, Activity } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { apiFetch } from '@/lib/api';
import { getTelkomStationsOverview, getTelkomStationHistory } from '@/services/telkomApi';
import { MultiStationComparisonChart } from '@/components/charts/MultiStationComparisonChart';

type Station = {
  id: string;
  uuid: string;
  name: string;
  type: 'aqms';
  locationKey?: string;
};
interface TelemetryItem {
  measured_at?: string;
  measuredAt?: string;
  timestamp?: string;
  created_at?: string;
  pm25?: number;
  temperature?: number;
  humidity?: number;
  [key: string]: unknown;
}

async function fetchStations(): Promise<Station[]> {
  try {
    const telkomStations = await getTelkomStationsOverview();
    if (telkomStations && telkomStations.length > 0) {
      return telkomStations.map((s) => ({
        id: s.uuid,
        uuid: s.uuid,
        name: s.name,
        type: 'aqms',
        locationKey: s.locationKey,
      }));
    }
  } catch {
    // fallback
  }

  const res = await apiFetch('/api/devices');
  if (!res.ok) throw new Error('Failed to fetch devices');
  const json = await res.json();
  return json.devices || json.stations || [];
}

async function fetchUnregistered() {
  const res = await apiFetch('/api/devices/unregistered');
  if (!res.ok) throw new Error('Failed to fetch unregistered devices');
  const json = await res.json();
  return json.data || [];
}

async function fetchTelemetry(station: Station | undefined) {
  if (!station) return { type: 'aqms', data: [] };

  if (station.locationKey) {
    const data = await getTelkomStationHistory({ location: station.locationKey });
    return { type: 'aqms', data };
  }

  const res = await apiFetch(`/api/data/devices/${station.uuid}/data/aqms?limit=100`);
  if (!res.ok) throw new Error('Failed to fetch telemetry');
  const json = await res.json();
  return {
    type: json.sensor_type || 'aqms',
    data: json.data || [],
  };
}
export function DashboardHome() {
  const { user } = useAuth();
  
  const canSeeUnregistered = user?.role === 'admin' || user?.role === 'engineer';

  const { data: stations, isLoading: isLoadingStations } = useQuery({
    queryKey: ['stations'],
    queryFn: fetchStations,
  });

  const { data: unregistered } = useQuery({
    queryKey: ['unregistered'],
    queryFn: fetchUnregistered,
    enabled: canSeeUnregistered,
  });

  const firstStation = stations?.[0];
  const firstStationUuid = firstStation?.uuid || '';
  const { data: telemetryResult, isLoading: isLoadingTelemetry } = useQuery({
    queryKey: ['telemetry', firstStationUuid],
    queryFn: () => fetchTelemetry(firstStation),
    enabled: !!firstStationUuid,
  });

  const telemetries = telemetryResult?.data || [];
  const lastData = telemetries[0];

  const chartConfig: ChartConfig = {
    pm25: { label: 'PM 2.5', color: 'hsl(var(--chart-1))' },
    temperature: { label: 'Suhu', color: 'hsl(var(--chart-2))' },
    humidity: { label: 'Kelembapan', color: 'hsl(var(--chart-3))' },
  };

  const chartData = [...telemetries].reverse().map((item: TelemetryItem) => {
    const rawTime = (typeof item.measured_at === 'string' && item.measured_at)
      || (typeof item.measuredAt === 'string' && item.measuredAt)
      || (typeof item.created_at === 'string' && item.created_at)
      || (typeof item.timestamp === 'string' && item.timestamp);
    return {
      ...item,
      time: rawTime ? new Date(rawTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
    };
  });

  const lastDataTime = lastData ? (lastData.measured_at || lastData.measuredAt || lastData.created_at || lastData.timestamp) : null;


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-2">Selamat datang kembali, {user?.fullName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stasiun Aktif</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStations ? '...' : stations?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Alat yang terdaftar dalam sistem
            </p>
          </CardContent>
        </Card>
        
        {canSeeUnregistered && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perlu Didaftarkan</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unregistered ? unregistered.length : 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Perangkat terdeteksi belum diregistrasi
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Terakhir Masuk</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastDataTime ? new Date(lastDataTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lastDataTime ? new Date(lastDataTime).toLocaleDateString('id-ID') : 'Belum ada data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Station PM2.5 6h Comparison Chart */}
      <MultiStationComparisonChart timeRangeHours={6} />
      {stations && stations.length > 0 && (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Trend Sensor - {stations[0].name}
            </CardTitle>
            <CardDescription>
              Menampilkan riwayat data terakhir dari stasiun pertama
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTelemetry ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Memuat data...
              </div>
            ) : telemetries.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <LineChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {Object.entries(chartConfig).map(([key, config]) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={config.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Belum ada data sensor
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
