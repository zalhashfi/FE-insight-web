import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Wind, Sprout, Activity, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';

const mockAqmsData = [
  { time: '08:00', pm25: 22, temperature: 26.5, humidity: 75, co: 1.2 },
  { time: '10:00', pm25: 35, temperature: 28.2, humidity: 68, co: 1.8 },
  { time: '12:00', pm25: 48, temperature: 31.0, humidity: 55, co: 2.5 },
  { time: '14:00', pm25: 42, temperature: 32.5, humidity: 52, co: 2.1 },
  { time: '16:00', pm25: 38, temperature: 30.1, humidity: 60, co: 1.9 },
  { time: '18:00', pm25: 28, temperature: 27.8, humidity: 72, co: 1.4 },
];

const mockSocData = [
  { time: '08:00', soil_moisture: 65, temperature: 24.1, ph: 6.8 },
  { time: '10:00', soil_moisture: 62, temperature: 25.4, ph: 6.8 },
  { time: '12:00', soil_moisture: 58, temperature: 27.2, ph: 6.7 },
  { time: '14:00', soil_moisture: 54, temperature: 28.0, ph: 6.7 },
  { time: '16:00', soil_moisture: 59, temperature: 26.5, ph: 6.8 },
  { time: '18:00', soil_moisture: 68, temperature: 25.0, ph: 6.9 },
];

const aqmsConfig: ChartConfig = {
  pm25: { label: 'PM 2.5 (µg/m³)', color: 'hsl(var(--chart-1))' },
  temperature: { label: 'Suhu (°C)', color: 'hsl(var(--chart-2))' },
  humidity: { label: 'Kelembapan (%)', color: 'hsl(var(--chart-3))' },
};

const socConfig: ChartConfig = {
  soil_moisture: { label: 'Kelembapan Tanah (%)', color: 'hsl(var(--chart-1))' },
  temperature: { label: 'Suhu Tanah (°C)', color: 'hsl(var(--chart-2))' },
  ph: { label: 'Tingkat pH', color: 'hsl(var(--chart-3))' },
};

export function LiveTelemetryPreview() {
  const [activeTab, setActiveTab] = useState<'aqms' | 'soc'>('aqms');

  const chartData = activeTab === 'aqms' ? mockAqmsData : mockSocData;
  const currentConfig = activeTab === 'aqms' ? aqmsConfig : socConfig;

  return (
    <section id="telemetry" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Contoh Data Sensor</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Grafik Telemetri Lapangan
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Grafik data pengukuran 24 jam terakhir dari stasiun AQMS dan SOC.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-lg bg-muted border border-border/50 self-start md:self-auto">
            <Button
              variant={activeTab === 'aqms' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('aqms')}
              className="text-xs font-semibold gap-1.5"
            >
              <Wind className="w-3.5 h-3.5" />
              Stasiun AQMS Alpha
            </Button>
            <Button
              variant={activeTab === 'soc' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('soc')}
              className="text-xs font-semibold gap-1.5"
            >
              <Sprout className="w-3.5 h-3.5" />
              Stasiun SOC Beta
            </Button>
          </div>
        </div>

        <Card className="border-border/60 shadow-xl overflow-hidden bg-card/80 backdrop-blur-md">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  {activeTab === 'aqms' ? 'AQMS Stasiun Alpha (Surabaya Barat)' : 'SOC Stasiun Beta (Kebun Percobaan)'}
                </CardTitle>
                <CardDescription className="font-mono text-xs mt-0.5">
                  ID Perangkat: {activeTab === 'aqms' ? 'urn:uuid:8b3e2101-aqms-dev' : 'urn:uuid:4f2a7719-soc-dev'}
                </CardDescription>
              </div>
              <Link to="/login">
                <Button size="sm" variant="outline" className="text-xs font-medium gap-1">
                  Buka Dashboard
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {activeTab === 'aqms' ? (
                <>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                    <span className="text-xs text-muted-foreground">PM 2.5 Terakhir</span>
                    <div className="text-2xl font-bold font-mono text-foreground">28 <span className="text-xs font-normal text-muted-foreground">µg/m³</span></div>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 mt-1">Normal</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                    <span className="text-xs text-muted-foreground">Suhu Udara</span>
                    <div className="text-2xl font-bold font-mono text-foreground">27.8 <span className="text-xs font-normal text-muted-foreground">°C</span></div>
                    <span className="text-[10px] text-muted-foreground">Suhu Lingkungan</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                    <span className="text-xs text-muted-foreground">Kelembapan</span>
                    <div className="text-2xl font-bold font-mono text-foreground">72 <span className="text-xs font-normal text-muted-foreground">%</span></div>
                    <span className="text-[10px] text-muted-foreground">Normal</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                    <span className="text-xs text-muted-foreground">Karbon Monoksida</span>
                    <div className="text-2xl font-bold font-mono text-foreground">1.4 <span className="text-xs font-normal text-muted-foreground">ppm</span></div>
                    <span className="text-[10px] text-emerald-600">Ambang Aman</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                    <span className="text-xs text-muted-foreground">Kelembapan Tanah</span>
                    <div className="text-2xl font-bold font-mono text-foreground">68 <span className="text-xs font-normal text-muted-foreground">%</span></div>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 mt-1">Cukup Air</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                    <span className="text-xs text-muted-foreground">pH Tanah</span>
                    <div className="text-2xl font-bold font-mono text-foreground">6.9 <span className="text-xs font-normal text-muted-foreground">pH</span></div>
                    <span className="text-[10px] text-muted-foreground">Kondisi Netral</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                    <span className="text-xs text-muted-foreground">Suhu Tanah</span>
                    <div className="text-2xl font-bold font-mono text-foreground">25.0 <span className="text-xs font-normal text-muted-foreground">°C</span></div>
                    <span className="text-[10px] text-muted-foreground">Zona Akar</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                    <span className="text-xs text-muted-foreground">Status Irigasi</span>
                    <div className="text-2xl font-bold font-mono text-foreground">SIAGA</div>
                    <span className="text-[10px] text-emerald-600">Terpenuhi</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2">
              <ChartContainer config={currentConfig} className="min-h-[300px] w-full">
                <LineChart data={chartData as any}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {Object.entries(currentConfig).map(([key, config]) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={config.color}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
