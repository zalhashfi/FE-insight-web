import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wind, Sprout, Gauge, Flame, Droplets, Thermometer, FlaskConical, CheckCircle2 } from 'lucide-react';

export function SolutionSection() {
  return (
    <section id="solusi" className="py-20 bg-muted/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider text-primary border-primary/30">
            Tipe Stasiun
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Stasiun Pemantauan Udara dan Tanah
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Sistem mendukung dua varian perangkat keras dengan integrasi sensor terstandar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* AQMS Card */}
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Wind className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">Stasiun AQMS</CardTitle>
                  <Badge variant="secondary" className="font-mono text-xs">UDARA</Badge>
                </div>
                <CardDescription className="text-base">
                  Pemantauan partikulat debu dan gas polutan udara secara terus-menerus.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parameter Sensor</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Gauge className="w-4 h-4 text-blue-500" />
                    <span>Partikulat PM2.5</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Karbon Monoksida (CO)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span>Suhu (°C)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    <span>Kelembapan Udara (%)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/40">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Penerapan</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Pemantauan emisi area pabrik dan kawasan industri
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Indeks kualitas udara lingkungan sekolah dan fasilitas publik
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* SOC Card */}
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">Stasiun SOC</CardTitle>
                  <Badge variant="secondary" className="font-mono text-xs">TANAH</Badge>
                </div>
                <CardDescription className="text-base">
                  Pemantauan kelembapan, keasaman, dan suhu tanah untuk kebutuhan pertanian dan riset.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parameter Sensor</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>Kelembapan Tanah (%)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <FlaskConical className="w-4 h-4 text-purple-500" />
                    <span>Keasaman Tanah (pH)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Thermometer className="w-4 h-4 text-amber-500" />
                    <span>Suhu Tanah (°C)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Gauge className="w-4 h-4 text-emerald-500" />
                    <span>Konduktivitas Tanah</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/40">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Penerapan</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Kontrol irigasi pertanian dan rumah kaca
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Riset kesuburan dan pemulihan lahan
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
