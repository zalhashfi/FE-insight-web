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
import { apiFetch } from '@/lib/api';

type Station = {
  id: string;
  uuid: string;
  name: string;
  type: 'aqms' | 'soc';
};

async function fetchStations(): Promise<Station[]> {
  const res = await apiFetch('/api/devices');
  if (!res.ok) throw new Error('Failed to fetch stations');
  const json = await res.json();
  return json.devices || json.stations || [];
}

async function fetchTelemetry(stationUuid: string, sensorType: string = 'aqms') {
  if (!stationUuid) return { type: sensorType, data: [] };
  const res = await apiFetch(`/api/data/devices/${stationUuid}/data/${sensorType}?limit=100`);
  if (!res.ok) throw new Error('Failed to fetch telemetry');
  const json = await res.json();
  return {
    type: json.sensor_type || sensorType,
    data: json.data || [],
  };
}

export function TelemetryList() {
  const [selectedStationUuid, setSelectedStationUuid] = useState<string>('');

  const { data: stations, isLoading: isLoadingStations } = useQuery({
    queryKey: ['stations'],
    queryFn: fetchStations,
  });

  const selectedStation = stations?.find(s => s.uuid === selectedStationUuid);
  const stationType = (selectedStation?.type || 'aqms') as 'aqms' | 'soc';

  const { data: telemetryResult, isLoading: isLoadingTelemetry, isError } = useQuery({
    queryKey: ['telemetry', selectedStationUuid, stationType],
    queryFn: () => fetchTelemetry(selectedStationUuid, stationType),
    enabled: !!selectedStationUuid,
  });

  const telemetries = telemetryResult?.data || [];
  const type = telemetryResult?.type || stationType;

  const chartConfig: ChartConfig = type === 'aqms' ? {
    pm25: { label: 'PM 2.5', color: 'hsl(var(--chart-1))' },
    temperature: { label: 'Suhu', color: 'hsl(var(--chart-2))' },
    humidity: { label: 'Kelembapan', color: 'hsl(var(--chart-3))' },
  } : {
    soil_moisture: { label: 'Moisture', color: 'hsl(var(--chart-1))' },
    temperature: { label: 'Suhu', color: 'hsl(var(--chart-2))' },
    ph: { label: 'pH', color: 'hsl(var(--chart-3))' },
  };

  // reverse telemetries for chart so oldest is first (usually history API returns descending)
  const chartData = [...telemetries].reverse().map(item => {
    const rawTime = item.measured_at || item.measuredAt || item.timestamp;
    return {
      ...item,
      soil_moisture: item.soil_moisture ?? item.soilMoisture ?? item.moisture,
      time: rawTime ? new Date(rawTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Sensor (Telemetry)</CardTitle>
          <CardDescription>Pilih Stasiun untuk melihat data sensor terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStations ? (
            <p>Loading stations...</p>
          ) : (
            <Select onValueChange={(v) => setSelectedStationUuid(v || '')} value={selectedStationUuid}>
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
        </CardContent>
      </Card>

      {selectedStationUuid && (
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
                  <CardTitle>Grafik Data Sensor - {selectedStation?.name}</CardTitle>
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
                            <TableHead>PM2.5 (µg/m³)</TableHead>
                            <TableHead>Suhu (°C)</TableHead>
                            <TableHead>Kelembapan (%)</TableHead>
                            <TableHead>CO (ppm)</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead>Moisture (%)</TableHead>
                            <TableHead>Suhu (°C)</TableHead>
                            <TableHead>pH</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {telemetries.map((data: any, idx: number) => {
                        const rawTime = data.measured_at || data.measuredAt || data.timestamp;
                        return (
                          <TableRow key={data.id || data.uuid || idx}>
                            <TableCell>{rawTime ? new Date(rawTime).toLocaleString('id-ID') : '-'}</TableCell>
                            {type === 'aqms' ? (
                              <>
                                <TableCell>{data.pm25 ?? '-'}</TableCell>
                                <TableCell>{data.temperature ?? '-'}</TableCell>
                                <TableCell>{data.humidity ?? '-'}</TableCell>
                                <TableCell>{data.co ?? '-'}</TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>{data.soil_moisture ?? data.soilMoisture ?? data.moisture ?? '-'}</TableCell>
                                <TableCell>{data.temperature ?? '-'}</TableCell>
                                <TableCell>{data.ph ?? '-'}</TableCell>
                              </>
                            )}
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
