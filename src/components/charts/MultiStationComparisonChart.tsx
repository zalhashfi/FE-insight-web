import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getTelkomStationHistory } from '@/services/telkomApi';
import { Activity, Radio } from 'lucide-react';
import { useMemo } from 'react';

interface MultiStationComparisonChartProps {
  timeRangeHours?: number;
}

export const comparisonChartConfig: ChartConfig = {
  tult: { label: 'TULT (Gedung TULT)', color: '#0079FE' },
  gku: { label: 'GKU (Gedung Kuliah Umum)', color: '#10b981' },
  deli: { label: 'Gedung Deli', color: '#f59e0b' },
};

export interface MultiStationPoint {
  time: string;
  timestamp: number;
  tult: number | null;
  gku: number | null;
  deli: number | null;
}

export function MultiStationComparisonChart({ timeRangeHours = 12 }: MultiStationComparisonChartProps) {
  const timeLow = useMemo(() => {
    const d = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000);
    return d.toISOString().replace('T', ' ').slice(0, 19);
  }, [timeRangeHours]);

  const { data: tultData = [], isLoading: loadingTult } = useQuery({
    queryKey: ['history-TULT', timeRangeHours],
    queryFn: () => getTelkomStationHistory({ location: 'TULT', timeLow }),
    staleTime: 1000 * 60 * 2,
  });

  const { data: gkuData = [], isLoading: loadingGku } = useQuery({
    queryKey: ['history-GKU', timeRangeHours],
    queryFn: () => getTelkomStationHistory({ location: 'GKU', timeLow }),
    staleTime: 1000 * 60 * 2,
  });

  const { data: deliData = [], isLoading: loadingDeli } = useQuery({
    queryKey: ['history-Deli', timeRangeHours],
    queryFn: () => getTelkomStationHistory({ location: 'Deli', timeLow }),
    staleTime: 1000 * 60 * 2,
  });
  const isLoading = loadingTult || loadingGku || loadingDeli;

  const chartData = useMemo<MultiStationPoint[]>(() => {
    const timeMap = new Map<string, MultiStationPoint>();

    let latestTs = 0;
    for (const item of [...tultData, ...gkuData, ...deliData]) {
      const ts = new Date(item.created_at).getTime();
      if (ts > latestTs) latestTs = ts;
    }

    if (latestTs === 0) latestTs = Date.now();
    const cutoff = latestTs - timeRangeHours * 60 * 60 * 1000;

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

    return Array.from(timeMap.values()).sort((a, b) => a.timestamp - b.timestamp);
  }, [tultData, gkuData, deliData, timeRangeHours]);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Komparasi PM2.5 Antar Stasiun ({timeRangeHours} Jam Terakhir)
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Perbandingan tren partikulat PM2.5 (µg/m³) simultan: Gedung TULT, GKU, dan Gedung Deli.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#0079FE]/10 text-[#0079FE] font-semibold border border-[#0079FE]/30">
              <span className="h-2 w-2 rounded-full bg-[#0079FE]"></span> TULT
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#10b981]/10 text-[#10b981] font-semibold border border-[#10b981]/30">
              <span className="h-2 w-2 rounded-full bg-[#10b981]"></span> GKU
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#f59e0b]/10 text-[#f59e0b] font-semibold border border-[#f59e0b]/30">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span> Gedung Deli
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[320px] flex items-center justify-center text-sm text-muted-foreground">
            <Radio className="h-5 w-5 animate-spin mr-2 text-primary" />
            Memuat data 3 stasiun...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center text-sm text-muted-foreground">
            Tidak ada data telemetri dalam rentang {timeRangeHours} jam terakhir.
          </div>
        ) : (
          <ChartContainer config={comparisonChartConfig} className="min-h-[320px] h-[340px] w-full">
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
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="gku"
                stroke="#10b981"
                name="GKU (PM2.5)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="deli"
                stroke="#f59e0b"
                name="Gedung Deli (PM2.5)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
