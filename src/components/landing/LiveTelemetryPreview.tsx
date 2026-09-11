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
  { time: '10.00', date: '11 Sep 2026', fullTime: '11 Sep 2026 10.00', timestamp: 1, tult: 55, gku: 72, deli: 95 },
  { time: '11.00', date: '11 Sep 2026', fullTime: '11 Sep 2026 11.00', timestamp: 2, tult: 60, gku: 75, deli: 97 },
  { time: '12.00', date: '11 Sep 2026', fullTime: '11 Sep 2026 12.00', timestamp: 3, tult: 62, gku: 78, deli: 99 },
  { time: '13.00', date: '11 Sep 2026', fullTime: '11 Sep 2026 13.00', timestamp: 4, tult: 59, gku: 76, deli: 94 },
  { time: '14.00', date: '11 Sep 2026', fullTime: '11 Sep 2026 14.00', timestamp: 5, tult: 58, gku: 74, deli: 92 },
  { time: '15.00', date: '11 Sep 2026', fullTime: '11 Sep 2026 15.00', timestamp: 6, tult: 54, gku: 71, deli: 88 },
  { time: '16.00', date: '11 Sep 2026', fullTime: '11 Sep 2026 16.00', timestamp: 7, tult: 52, gku: 70, deli: 85 },
];

export function LiveTelemetryPreview() {
  const { data: tultData = [] } = useQuery({
    queryKey: ['landing-history-TULT'],
    queryFn: () => getTelkomStationHistory({ location: 'TULT' }),
    staleTime: 1000 * 60 * 2,
  });

  const { data: gkuData = [] } = useQuery({
    queryKey: ['landing-history-GKU'],
    queryFn: () => getTelkomStationHistory({ location: 'GKU' }),
    staleTime: 1000 * 60 * 2,
  });

  const { data: deliData = [] } = useQuery({
    queryKey: ['landing-history-Deli'],
    queryFn: () => getTelkomStationHistory({ location: 'Deli' }),
    staleTime: 1000 * 60 * 2,
  });

  const { chartData, activeDateRange } = useMemo(() => {
    const points: Array<{ station: 'tult' | 'gku' | 'deli'; time: Date; pm25: number | null }> = [];

    const addToList = (list: typeof tultData, station: 'tult' | 'gku' | 'deli') => {
      for (const item of list) {
        if (!item.created_at) continue;
        const d = new Date(item.created_at);
        if (!isNaN(d.getTime())) {
          points.push({
            station,
            time: d,
            pm25: typeof item.pm25 === 'number' ? item.pm25 : null,
          });
        }
      }
    };

    addToList(tultData, 'tult');
    addToList(gkuData, 'gku');
    addToList(deliData, 'deli');

    if (points.length === 0) {
      return { chartData: fallbackComparisonData, activeDateRange: '11 Sep 2026' };
    }

    let maxTs = 0;
    for (const p of points) {
      const ts = p.time.getTime();
      if (ts > maxTs) maxTs = ts;
    }

    const endHourDate = new Date(maxTs);
    endHourDate.setMinutes(0, 0, 0);
    const endTs = endHourDate.getTime() + (new Date(maxTs).getMinutes() > 0 ? 60 * 60 * 1000 : 0);
    const startTs = endTs - 6 * 60 * 60 * 1000; // 6 jam terakhir

    const slotMap = new Map<number, { count: Record<'tult' | 'gku' | 'deli', number>; sum: Record<'tult' | 'gku' | 'deli', number> }>();

    for (let ts = startTs; ts <= endTs; ts += 60 * 60 * 1000) {
      slotMap.set(ts, {
        count: { tult: 0, gku: 0, deli: 0 },
        sum: { tult: 0, gku: 0, deli: 0 },
      });
    }

    for (const p of points) {
      const pTs = p.time.getTime();
      if (p.pm25 == null) continue;

      const nearestHourTs = Math.round(pTs / (60 * 60 * 1000)) * (60 * 60 * 1000);
      const slot = slotMap.get(nearestHourTs);
      if (slot) {
        slot.sum[p.station] += p.pm25;
        slot.count[p.station] += 1;
      }
    }

    const result: MultiStationPoint[] = [];
    const dateSet = new Set<string>();

    for (const [ts, slot] of slotMap.entries()) {
      const d = new Date(ts);
      const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      dateSet.add(dateStr);

      const hourStr = String(d.getHours()).padStart(2, '0');
      const timeLabel = `${hourStr}.00`;

      result.push({
        time: timeLabel,
        date: dateStr,
        fullTime: `${dateStr} ${timeLabel}`,
        timestamp: ts,
        tult: slot.count.tult > 0 ? Math.round(slot.sum.tult / slot.count.tult) : null,
        gku: slot.count.gku > 0 ? Math.round(slot.sum.gku / slot.count.gku) : null,
        deli: slot.count.deli > 0 ? Math.round(slot.sum.deli / slot.count.deli) : null,
      });
    }

    const sorted = result.sort((a, b) => a.timestamp - b.timestamp);
    const activeDates = Array.from(dateSet).join(' - ');

    return { chartData: sorted.length > 0 ? sorted : fallbackComparisonData, activeDateRange: activeDates || '11 Sep 2026' };
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
              Tren kualitas udara partikulat PM2.5 (µg/m³) 6 jam terakhir ({activeDateRange}) dari 3 stasiun pemantauan Telkom University.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono">
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
                  Tanggal: {activeDateRange} &bull; TULT, GKU, Gedung Deli
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
                  <span>TULT</span>
                  <span className="h-2 w-2 rounded-full bg-[#0079FE]"></span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground mt-1">58 <span className="text-xs font-normal text-muted-foreground">µg/m³</span></div>
                <span className="text-[10px] text-amber-500 font-medium">ISPU: Sedang</span>
              </div>
              <div className="p-3 rounded-lg bg-[#10b981]/5 border border-[#10b981]/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>GKU</span>
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
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_label, payload) => {
                          const item = payload?.[0]?.payload as MultiStationPoint | undefined;
                          return item?.fullTime || _label;
                        }}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="tult"
                    stroke="#0079FE"
                    name="TULT (PM2.5)"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="gku"
                    stroke="#10b981"
                    name="GKU (PM2.5)"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="deli"
                    stroke="#f59e0b"
                    name="Gedung Deli (PM2.5)"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    connectNulls
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
