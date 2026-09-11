import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { apiFetch } from '@/lib/api';
import { getTelkomStationsOverview, getTelkomStationHistory } from '@/services/telkomApi';
import { getIspuQuality } from '@/components/map/AirQualityMap';
import { MultiStationComparisonChart } from '@/components/charts/MultiStationComparisonChart';
import { Clock } from 'lucide-react';
type Station = {
  id: string;
  uuid: string;
  name: string;
  type: 'aqms';
  locationKey?: string;
};

interface TelemetryRow {
  id?: string | number;
  uuid?: string;
  measured_at?: string;
  measuredAt?: string;
  timestamp?: string;
  created_at?: string;
  pm25?: number | null;
  temperature?: number | null;
  humidity?: number | null;
  co2?: number | null;
  windSpeed?: number | null;
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
    // fallback to internal /api/devices
  }

  const res = await apiFetch('/api/devices');
  if (!res.ok) throw new Error('Failed to fetch stations');
  const json = await res.json();
  return json.devices || json.stations || [];
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
export function TelemetryList() {
  const [selectedStationUuid, setSelectedStationUuid] = useState<string>('');
  const [timeRangeHours, setTimeRangeHours] = useState<number>(6); // Default 6 jam terakhir

  const { data: stations, isLoading: isLoadingStations } = useQuery({
    queryKey: ['stations'],
    queryFn: fetchStations,
  });

  // Set default selection to first station if not yet set
  const activeStationUuid = selectedStationUuid || stations?.[0]?.uuid || '';
  const selectedStation = stations?.find((s) => s.uuid === activeStationUuid);

  const { data: telemetryResult, isLoading: isLoadingTelemetry, isError } = useQuery({
    queryKey: ['telemetry', activeStationUuid, timeRangeHours],
    queryFn: () => fetchTelemetry(selectedStation),
    enabled: !!activeStationUuid,
  });
  const rawTelemetries = telemetryResult?.data || [];

  // Filter data berdasarkan rentang jam yang dipilih (default 12 jam)
  const telemetries = useMemo(() => {
    if (!rawTelemetries.length) return [];
    
    // Dapatkan timestamp data paling baru
    const latestItem = rawTelemetries[0];
    const latestTimeStr = latestItem?.created_at || latestItem?.measured_at || latestItem?.timestamp;
    const latestDate = latestTimeStr ? new Date(latestTimeStr).getTime() : Date.now();
    const cutoffTime = latestDate - timeRangeHours * 60 * 60 * 1000;

    return rawTelemetries.filter((item: TelemetryRow) => {
      const tStr = item.created_at || item.measured_at || item.timestamp;
      if (!tStr) return true;
      const itemTime = new Date(tStr).getTime();
      return !isNaN(itemTime) ? itemTime >= cutoffTime : true;
    });
  }, [rawTelemetries, timeRangeHours]);

  const chartConfig: ChartConfig = {
    pm25: { label: 'PM 2.5', color: 'hsl(var(--chart-1))' },
    temperature: { label: 'Suhu', color: 'hsl(var(--chart-2))' },
    humidity: { label: 'Kelembapan', color: 'hsl(var(--chart-3))' },
  };

  // reverse telemetries for chart so oldest is first (usually history API returns descending)
  const chartData = [...telemetries].reverse().map((item: TelemetryRow) => {
    const rawTime = (typeof item.measured_at === 'string' && item.measured_at)
      || (typeof item.measuredAt === 'string' && item.measuredAt)
      || (typeof item.timestamp === 'string' && item.timestamp);
    return {
      ...item,
      time: rawTime ? new Date(rawTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
    };
  });

  return (
    <div className="space-y-6">
      {/* Multi-Station 3 API PM2.5 Comparison Chart */}
      <MultiStationComparisonChart timeRangeHours={timeRangeHours} />

      <Card>
        <CardHeader>
          <CardTitle>Data Sensor (Telemetry)</CardTitle>
          <CardDescription>Pilih stasiun dan rentang waktu untuk melihat visualisasi data sensor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {isLoadingStations ? (
              <p>Loading stations...</p>
            ) : (
              <Select onValueChange={(v) => setSelectedStationUuid(v || '')} value={activeStationUuid}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Pilih Stasiun" />
                </SelectTrigger>
                <SelectContent>
                  {stations?.map(station => (
                    <SelectItem key={station.uuid} value={station.uuid}>
                      {station.name} ({station.type.toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Time range selector buttons */}
            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/50 text-xs">
              <span className="text-muted-foreground flex items-center gap-1 px-2 font-medium">
                <Clock className="h-3.5 w-3.5" />
                Rentang:
              </span>
              <Button
                type="button"
                size="sm"
                variant={timeRangeHours === 6 ? 'default' : 'ghost'}
                onClick={() => setTimeRangeHours(6)}
                className="h-7 text-xs px-2.5"
              >
                6 Jam (Default)
              </Button>
              <Button
                type="button"
                size="sm"
                variant={timeRangeHours === 12 ? 'default' : 'ghost'}
                onClick={() => setTimeRangeHours(12)}
                className="h-7 text-xs px-2.5"
              >
                12 Jam
              </Button>
              <Button
                type="button"
                size="sm"
                variant={timeRangeHours === 24 ? 'default' : 'ghost'}
                onClick={() => setTimeRangeHours(24)}
                className="h-7 text-xs px-2.5"
              >
                24 Jam
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeStationUuid && (
        <>
          {isLoadingTelemetry && <div className="p-4">Loading data...</div>}
          {isError && <div className="p-4 text-destructive">Error loading data.</div>}
          {!isLoadingTelemetry && !isError && telemetries.length === 0 && (
            <div className="p-4">Belum ada data sensor.</div>
          )}

          {!isLoadingTelemetry && !isError && telemetries.length > 0 && (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Grafik Data Sensor ({timeRangeHours} Jam Terakhir) - {selectedStation?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <LineChart data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
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
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Tabel Riwayat - {selectedStation?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>PM2.5 (µg/m³)</TableHead>
                        <TableHead>Suhu (°C)</TableHead>
                        <TableHead>Kelembapan (%)</TableHead>
                        <TableHead>CO (ppm)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {telemetries.map((data: TelemetryRow, idx: number) => {
                        const rawTime = (typeof data.measured_at === 'string' && data.measured_at)
                          || (typeof data.measuredAt === 'string' && data.measuredAt)
                          || (typeof data.timestamp === 'string' && data.timestamp);
                        return (
                          <TableRow key={String(data.id ?? data.uuid ?? idx)}>
                            <TableCell>{rawTime ? new Date(rawTime).toLocaleString('id-ID') : '-'}</TableCell>
                            <TableCell className={`font-semibold ${getIspuQuality(data.pm25).textClass}`}>
                              {data.pm25 != null ? String(data.pm25) : '-'}
                            </TableCell>
                            <TableCell>{data.temperature != null ? String(data.temperature) : '-'}</TableCell>
                            <TableCell>{data.humidity != null ? String(data.humidity) : '-'}</TableCell>
                            <TableCell>{data.co != null ? String(data.co) : '-'}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
