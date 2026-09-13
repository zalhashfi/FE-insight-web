import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getTelkomStationHistory } from '@/services/telkomApi';
import { comparisonChartConfig } from '@/components/charts/MultiStationComparisonChart';
import { getIspuQuality } from '@/components/map/AirQualityMap';
import { buildTelemetryWindow, type WindowPoint } from '@/lib/telemetryWindow';
import { useMemo } from 'react';

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

  const { points, windowLabel, dateRange, hasAnyValue, stationsWithData, latest } = useMemo(
    () => buildTelemetryWindow({ tult: tultData, gku: gkuData, deli: deliData }),
    [tultData, gkuData, deliData]
  );

  const tultQuality = getIspuQuality(latest.tult);
  const gkuQuality = getIspuQuality(latest.gku);
  const deliQuality = getIspuQuality(latest.deli);

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
              Tren fluktuasi konsentrasi partikulat halus (PM2.5) per 2 menit (
              {hasAnyValue ? `${windowLabel}, ${dateRange}` : 'satu jam terakhir'}) di 3 lokasi Telkom University: TULT, GKU, dan Gedung Deli.
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
                  Tanggal: {hasAnyValue ? `${dateRange} • Pukul ${windowLabel}` : '-'} &bull; TULT, GKU, Gedung Deli
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
                <div className="text-2xl font-bold font-mono text-foreground mt-1">
                  {latest.tult ?? '—'}
                  {latest.tult != null && <span className="text-xs font-normal text-muted-foreground"> µg/m³</span>}
                </div>
                <span className={`text-[10px] font-medium ${tultQuality.textClass}`}>ISPU: {tultQuality.label}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#10b981]/5 border border-[#10b981]/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>GKU</span>
                  <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground mt-1">
                  {latest.gku ?? '—'}
                  {latest.gku != null && <span className="text-xs font-normal text-muted-foreground"> µg/m³</span>}
                </div>
                <span className={`text-[10px] font-medium ${gkuQuality.textClass}`}>ISPU: {gkuQuality.label}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Gedung Deli</span>
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground mt-1">
                  {latest.deli ?? '—'}
                  {latest.deli != null && <span className="text-xs font-normal text-muted-foreground"> µg/m³</span>}
                </div>
                <span className={`text-[10px] font-medium ${deliQuality.textClass}`}>ISPU: {deliQuality.label}</span>
              </div>
            </div>

            <div className="pt-2" data-testid={hasAnyValue ? 'telemetry-chart' : undefined}>
              {!hasAnyValue ? (
                <div className="h-[340px] flex items-center justify-center text-sm text-muted-foreground">
                  Belum ada data telemetri pada jam {windowLabel}.
                </div>
              ) : (
                <ChartContainer config={comparisonChartConfig} className="min-h-[300px] h-[340px] w-full">
                  <LineChart data={points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} interval={4} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_label, payload) => {
                            const item = payload?.[0]?.payload as WindowPoint | undefined;
                            return item?.fullTime || _label;
                          }}
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    {stationsWithData.tult && (
                      <Line
                        type="monotone"
                        dataKey="tult"
                        stroke="#0079FE"
                        name="TULT (PM2.5)"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        connectNulls={false}
                      />
                    )}
                    {stationsWithData.gku && (
                      <Line
                        type="monotone"
                        dataKey="gku"
                        stroke="#10b981"
                        name="GKU (PM2.5)"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        connectNulls={false}
                      />
                    )}
                    {stationsWithData.deli && (
                      <Line
                        type="monotone"
                        dataKey="deli"
                        stroke="#f59e0b"
                        name="Gedung Deli (PM2.5)"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        connectNulls={false}
                      />
                    )}
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
