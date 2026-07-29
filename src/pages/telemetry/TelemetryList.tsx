import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TableSkeleton, Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api';

type Station = {
  id: string;
  uuid: string;
  name: string;
  type: 'aqms' | 'soc';
};

async function fetchStations(): Promise<Station[]> {
  const res = await apiFetch('/api/stations');
  if (!res.ok) throw new Error('Failed to fetch stations');
  const json = await res.json();
  return json.stations || [];
}

async function fetchTelemetry(stationUuid: string, interval: string) {
  if (!stationUuid) return { type: '', data: [] };
  const res = await apiFetch(`/api/data/${stationUuid}/history?limit=200&interval=${interval}`);
  if (!res.ok) throw new Error('Failed to fetch telemetry');
  return res.json();
}

export function TelemetryList() {
  const [selectedStationUuid, setSelectedStationUuid] = useState<string>('');
  const [interval, setInterval] = useState<string>('2m');
  const [sensorGroup, setSensorGroup] = useState<string>('');

  const intervals = [
    { value: '2m', label: 'Per 2 Menit (Raw)' },
    { value: '1h', label: 'Per 1 Jam (Rata-rata)' },
    { value: '1d', label: 'Per Hari (Rata-rata)' },
  ];

  const { data: stations, isLoading: isLoadingStations } = useQuery({
    queryKey: ['stations'],
    queryFn: fetchStations,
  });

  const { data: telemetryResult, isLoading: isLoadingTelemetry, isError, refetch, isRefetching } = useQuery({
    queryKey: ['telemetry', selectedStationUuid, interval],
    queryFn: () => fetchTelemetry(selectedStationUuid, interval),
    enabled: !!selectedStationUuid,
  });

  const selectedStation = stations?.find(s => s.uuid === selectedStationUuid);
  const type = selectedStation?.type || telemetryResult?.type;
  const telemetries = telemetryResult?.data || [];

  // Default sensor group logic
  if (type === 'aqms' && !sensorGroup) setSensorGroup('pm25');
  if (type === 'soc' && !sensorGroup) setSensorGroup('ph_ec');

  const aqmsSensorGroups = [
    { value: 'pm25', label: 'PM 2.5', config: { pm25: { label: 'PM 2.5 (µg/m³)', color: 'hsl(var(--chart-1))' } } },
    { value: 'no2', label: 'NO2', config: { no2: { label: 'NO2 (µg/m³)', color: 'hsl(var(--chart-2))' } } },
    { value: 'co', label: 'CO2', config: { co: { label: 'CO (ppm)', color: 'hsl(var(--chart-3))' } } },
    { value: 'temp_hum', label: 'Temp & Hum', config: { temp: { label: 'Suhu (°C)', color: 'hsl(var(--chart-4))' }, hum: { label: 'Kelembapan (%)', color: 'hsl(var(--chart-5))' } } },
  ];

  const socSensorGroups = [
    { value: 'ph_ec', label: 'pH & EC', config: { ph: { label: 'pH', color: 'hsl(var(--chart-1))' }, ec: { label: 'EC (µS/cm)', color: 'hsl(var(--chart-2))' } } },
    { value: 'temp_hum', label: 'Temp & Hum', config: { temp: { label: 'Suhu (°C)', color: 'hsl(var(--chart-3))' }, hum: { label: 'Kelembapan (%)', color: 'hsl(var(--chart-4))' } } },
    { value: 'npk', label: 'NPK', config: { n: { label: 'Nitrogen', color: 'hsl(var(--chart-1))' }, p: { label: 'Fosfor', color: 'hsl(var(--chart-2))' }, k: { label: 'Kalium', color: 'hsl(var(--chart-3))' } } },
    { value: 'no2', label: 'NO2', config: { no2: { label: 'NO2 (µg/m³)', color: 'hsl(var(--chart-5))' } } },
  ];

  const sensorGroups = type === 'aqms' ? aqmsSensorGroups : socSensorGroups;
  const currentGroup = sensorGroups.find(g => g.value === sensorGroup) || sensorGroups[0];
  const chartConfig = (currentGroup?.config || {}) as unknown as ChartConfig;

  // reverse telemetries for chart so oldest is first (usually history API returns descending)
  const chartData = [...telemetries].reverse().map(item => ({
    ...item,
    time: new Date(item.measuredAt || item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  }));

  const handleStationChange = (v: string | null) => {
    if (!v) return;
    setSelectedStationUuid(v);
    const station = stations?.find(s => s.uuid === v);
    if (station?.type === 'aqms') setSensorGroup('pm25');
    if (station?.type === 'soc') setSensorGroup('ph_ec');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Data Sensor (Telemetry)</CardTitle>
            <CardDescription>Pilih Stasiun untuk melihat data sensor terbaru</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingStations ? (
            <Skeleton className="h-10 w-full sm:w-[300px]" />
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Select onValueChange={handleStationChange} value={selectedStationUuid}>
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
            </div>
          )}
        </CardContent>
      </Card>

      {selectedStationUuid && (
        <>
          {isLoadingTelemetry && (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Grafik Data Sensor</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <Skeleton className="w-full h-full" />
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Tabel Riwayat</CardTitle>
                </CardHeader>
                <CardContent>
                  <TableSkeleton rows={5} cols={4} />
                </CardContent>
              </Card>
            </div>
          )}
          {isError && <div className="p-4 text-destructive">Error loading data.</div>}
          {!isLoadingTelemetry && !isError && telemetries.length === 0 && (
            <div className="p-4">Belum ada data sensor.</div>
          )}

          {!isLoadingTelemetry && !isError && telemetries.length > 0 && (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle>Grafik Data Sensor - {selectedStation?.name}</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Select onValueChange={(v: string | null) => v && setInterval(v)} value={interval}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Pilih Interval" />
                      </SelectTrigger>
                      <SelectContent>
                        {intervals.map(int => (
                          <SelectItem key={int.value} value={int.value}>
                            {int.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select onValueChange={(v: string | null) => v && setSensorGroup(v)} value={sensorGroup}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Pilih Sensor Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {sensorGroups.map(group => (
                          <SelectItem key={group.value} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                        {type === 'aqms' ? (
                          <>
                            <TableHead>PM2.5</TableHead>
                            <TableHead>NO2</TableHead>
                            <TableHead>CO</TableHead>
                            <TableHead>Temp (°C)</TableHead>
                            <TableHead>Hum (%)</TableHead>
                            <TableHead>WS</TableHead>
                            <TableHead>WD</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead>pH</TableHead>
                            <TableHead>NO2</TableHead>
                            <TableHead>EC</TableHead>
                            <TableHead>Temp (°C)</TableHead>
                            <TableHead>Hum (%)</TableHead>
                            <TableHead>N</TableHead>
                            <TableHead>P</TableHead>
                            <TableHead>K</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {telemetries.map((data: any) => (
                        <TableRow key={data.id || (data.measuredAt + data.stationId)}>
                          <TableCell>{new Date(data.measuredAt || data.timestamp).toLocaleString('id-ID')}</TableCell>
                          {type === 'aqms' ? (
                            <>
                              <TableCell>{data.pm25}</TableCell>
                              <TableCell>{data.no2}</TableCell>
                              <TableCell>{data.co}</TableCell>
                              <TableCell>{data.temp}</TableCell>
                              <TableCell>{data.hum}</TableCell>
                              <TableCell>{data.ws}</TableCell>
                              <TableCell>{data.wd}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{data.ph}</TableCell>
                              <TableCell>{data.no2}</TableCell>
                              <TableCell>{data.ec}</TableCell>
                              <TableCell>{data.temp}</TableCell>
                              <TableCell>{data.hum}</TableCell>
                              <TableCell>{data.n}</TableCell>
                              <TableCell>{data.p}</TableCell>
                              <TableCell>{data.k}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
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
