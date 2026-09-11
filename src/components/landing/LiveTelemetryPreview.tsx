import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getTelkomStationHistory } from '@/services/telkomApi';
import { comparisonChartConfig, type MultiStationPoint } from '@/components/charts/MultiStationComparisonChart';
import { useMemo } from 'react';

const fallbackComparisonData: MultiStationPoint[] = [
  { time: '04:00', timestamp: 1, tult: 42, gku: 55, deli: 68 },
  { time: '06:00', timestamp: 2, tult: 48, gku: 62, deli: 75 },
  { time: '08:00', timestamp: 3, tult: 58, gku: 76, deli: 89 },
  { time: '10:00', timestamp: 4, tult: 55, gku: 72, deli: 95 },
  { time: '12:00', timestamp: 5, tult: 62, gku: 78, deli: 99 },
  { time: '14:00', timestamp: 6, tult: 58, gku: 74, deli: 92 },
  { time: '16:00', timestamp: 7, tult: 52, gku: 70, deli: 85 },
];

export function LiveTelemetryPreview() {
  const timeLow = useMemo(() => {
    const d = new Date(Date.now() - 12 * 60 * 60 * 1000);
    return d.toISOString().replace('T', ' ').slice(0, 19);
  }, []);

  const { data: tultData = [] } = useQuery({
    queryKey: ['landing-history-TULT'],
    queryFn: () => getTelkomStationHistory({ location: 'TULT', timeLow }),
    staleTime: 1000 * 60 * 2,
  });

  const { data: gkuData = [] } = useQuery({
    queryKey: ['landing-history-GKU'],
    queryFn: () => getTelkomStationHistory({ location: 'GKU', timeLow }),
    staleTime: 1000 * 60 * 2,
  });

  const { data: deliData = [] } = useQuery({
    queryKey: ['landing-history-Deli'],
    queryFn: () => getTelkomStationHistory({ location: 'Deli', timeLow }),
    staleTime: 1000 * 60 * 2,
  });

  const chartData = useMemo<MultiStationPoint[]>(() => {
    if (!tultData.length && !gkuData.length && !deliData.length) {
      return fallbackComparisonData;
    }

    const timeMap = new Map<string, MultiStationPoint>();

    let latestTs = 0;
    for (const item of [...tultData, ...gkuData, ...deliData]) {
      const ts = new Date(item.created_at).getTime();
      if (ts > latestTs) latestTs = ts;
    }

    if (latestTs === 0) latestTs = Date.now();
    const cutoff = latestTs - 12 * 60 * 60 * 1000; // 12 jam terakhir

    const processList = (list: typeof tultData, key: 'tult' | 'gku' | 'deli') => {
      for (const item of list) {
        const d = new Date(item.created_at);
        const ts = d.getTime();
        if (ts < cutoff) continue;

        const timeKey = item.created_at.substring(0, 16);
        const existing = timeMap.get(timeKey) || {
          time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          timestamp: ts,
          tult: null,
          gku: null,
          deli: null,
        };

        existing[key] = item.pm25;
        timeMap.set(timeKey, existing);
      }
    };

    processList(tultData, 'tult');
    processList(gkuData, 'gku');
    processList(deliData, 'deli');

    const sorted = Array.from(timeMap.values()).sort((a, b) => a.timestamp - b.timestamp);
    return sorted.length > 0 ? sorted : fallbackComparisonData;
  }, [tultData, gkuData, deliData]);

  return (
    <section id="telemetry" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Data Lapangan 3 Titik</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Komparasi PM2.5 Antar Stasiun
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Tren kualitas udara partikulat PM2.5 (µg/m³) 12 jam terakhir dari 3 stasiun pemantauan Telkom University.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0079FE]/10 text-[#0079FE] font-semibold border border-[#0079FE]/30">
              <span className="h-2 w-2 rounded-full bg-[#0079FE]"></span> TULT
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10b981]/10 text-[#10b981] font-semibold border border-[#10b981]/30">
              <span className="h-2 w-2 rounded-full bg-[#10b981]"></span> GKU
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f59e0b]/10 text-[#f59e0b] font-semibold border border-[#f59e0b]/30">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span> Gedung Deli
            </span>
          </div>
        </div>

        <Card className="border-border/60 shadow-xl overflow-hidden bg-card/80 backdrop-blur-md">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Grafik Simultan 3 Titik (PM2.5)
                </CardTitle>
                <CardDescription className="font-mono text-xs mt-0.5">
                  Gedung TULT, Gedung Kuliah Umum (GKU), Gedung Deli
                </CardDescription>
              </div>
              <Link to="/dashboard/telemetry">
                <Button size="sm" variant="outline" className="text-xs font-medium gap-1">
                  Buka Dashboard
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-[#0079FE]/5 border border-[#0079FE]/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Gedung TULT</span>
                  <span className="h-2 w-2 rounded-full bg-[#0079FE]"></span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground mt-1">58 <span className="text-xs font-normal text-muted-foreground">µg/m³</span></div>
                <span className="text-[10px] text-amber-500 font-medium">ISPU: Sedang</span>
              </div>
              <div className="p-3 rounded-lg bg-[#10b981]/5 border border-[#10b981]/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>GKU (Kuliah Umum)</span>
                  <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground mt-1">76 <span className="text-xs font-normal text-muted-foreground">µg/m³</span></div>
                <span className="text-[10px] text-amber-500 font-medium">ISPU: Sedang</span>
              </div>
              <div className="p-3 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Gedung Deli</span>
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground mt-1">99 <span className="text-xs font-normal text-muted-foreground">µg/m³</span></div>
                <span className="text-[10px] text-amber-500 font-medium">ISPU: Sedang</span>
              </div>
            </div>

            <div className="pt-2">
              <ChartContainer config={comparisonChartConfig} className="min-h-[300px] h-[340px] w-full">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} minTickGap={30} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="tult"
                    stroke="#0079FE"
                    name="TULT (PM2.5)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="gku"
                    stroke="#10b981"
                    name="GKU (PM2.5)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="deli"
                    stroke="#f59e0b"
                    name="Gedung Deli (PM2.5)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
