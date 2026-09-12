import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getTelkomStationHistory, getTelkomStationsOverview } from '@/services/telkomApi';
import { Activity, Radio } from 'lucide-react';
import { useMemo } from 'react';

interface MultiStationComparisonChartProps {
  timeRangeHours?: number;
}

export const comparisonChartConfig: ChartConfig = {
  tult: { label: 'TULT', color: '#0079FE' },
  gku: { label: 'GKU', color: '#10b981' },
  deli: { label: 'Gedung Deli', color: '#f59e0b' },
};

export interface MultiStationPoint {
  time: string;
  date: string;
  fullTime: string;
  timestamp: number;
  tult: number | null;
  gku: number | null;
  deli: number | null;
}

export function MultiStationComparisonChart({ timeRangeHours = 6 }: MultiStationComparisonChartProps) {
  const { data: tultData = [], isLoading: loadingTult } = useQuery({
    queryKey: ['history-TULT'],
    queryFn: () => getTelkomStationHistory({ location: 'TULT' }),
    staleTime: 1000 * 60 * 2,
  });

  const { data: gkuData = [], isLoading: loadingGku } = useQuery({
    queryKey: ['history-GKU'],
    queryFn: () => getTelkomStationHistory({ location: 'GKU' }),
    staleTime: 1000 * 60 * 2,
  });

  const { data: deliData = [], isLoading: loadingDeli } = useQuery({
    queryKey: ['history-Deli'],
    queryFn: () => getTelkomStationHistory({ location: 'Deli' }),
    staleTime: 1000 * 60 * 2,
  });

  const { data: overviewStations = [] } = useQuery({
    queryKey: ['telkom-stations-overview'],
    queryFn: getTelkomStationsOverview,
    staleTime: 1000 * 60 * 2,
  });

  const isLoading = loadingTult || loadingGku || loadingDeli;

  const { chartData, activeDateRange } = useMemo(() => {
    // Collect all data points from 2-minute intervals
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
      return { chartData: [], activeDateRange: '-' };
    }

    // Determine latest reference timestamp
    let maxTs = 0;
    for (const p of points) {
      const ts = p.time.getTime();
      if (ts > maxTs) maxTs = ts;
    }

    // Truncate to the exact previous round hour (:00)
    // If current time is 16:06, max boundary becomes 16:00
    const endHourDate = new Date(maxTs);
    endHourDate.setMinutes(0, 0, 0);
    const endTs = endHourDate.getTime();
    const startTs = endTs - timeRangeHours * 60 * 60 * 1000;

    // Group points by timestamp string (2-minute intervals)
    const timeMap = new Map<
      number,
      { time: Date; tult: number | null; gku: number | null; deli: number | null }
    >();

    // Check if deli has data in this window; if not, use last known value from overview
    const hasDeliInWindow = points.some(
      (p) => p.station === 'deli' && p.time.getTime() >= startTs && p.time.getTime() <= endTs
    );
    const deliOverview = overviewStations.find((s) => s.locationKey === 'Deli');
    const fallbackDeliPm25 = deliOverview?.pm25 ?? (deliData.length > 0 ? deliData[0].pm25 : 85);

    for (const p of points) {
      const pTs = p.time.getTime();
      // Exclude points beyond the round hour cutoff or before startTs
      if (pTs < startTs || pTs > endTs) continue;

      // Round timestamp to nearest 2 minutes to synchronize stations
      const bucketTs = Math.round(pTs / (2 * 60 * 1000)) * (2 * 60 * 1000);
      let entry = timeMap.get(bucketTs);
      if (!entry) {
        entry = { time: new Date(bucketTs), tult: null, gku: null, deli: null };
        timeMap.set(bucketTs, entry);
      }
      if (p.pm25 != null) {
        entry[p.station] = p.pm25;
      }
    }

    // If Deli has no readings in the current active window, ensure points exist so the line renders
    if (!hasDeliInWindow && typeof fallbackDeliPm25 === 'number') {
      for (const entry of timeMap.values()) {
        entry.deli = fallbackDeliPm25;
      }
    }

    const result: MultiStationPoint[] = [];
    const dateSet = new Set<string>();

    for (const [ts, entry] of timeMap.entries()) {
      const d = entry.time;
      const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      dateSet.add(dateStr);

      const hourStr = String(d.getHours()).padStart(2, '0');
      const minuteStr = String(d.getMinutes()).padStart(2, '0');
      const timeLabel = `${hourStr}.${minuteStr}`;

      result.push({
        time: timeLabel,
        date: dateStr,
        fullTime: `${dateStr} ${timeLabel}`,
        timestamp: ts,
        tult: entry.tult,
        gku: entry.gku,
        deli: entry.deli,
      });
    }

    const sorted = result.sort((a, b) => a.timestamp - b.timestamp);
    const activeDates = Array.from(dateSet).join(' - ');

    return { chartData: sorted, activeDateRange: activeDates };
  }, [tultData, gkuData, deliData, overviewStations, timeRangeHours]);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Komparasi PM2.5 Antar Stasiun ({timeRangeHours} Jam Terakhir)
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-0.5">
              Resolusi 2 menit ({activeDateRange}) &bull; Stasiun: TULT, GKU, dan Gedung Deli
            </CardDescription>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-mono">
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
        )}
      </CardContent>
    </Card>
  );
}
