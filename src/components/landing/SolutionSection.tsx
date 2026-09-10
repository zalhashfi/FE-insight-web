import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wind, Sprout, Gauge, Flame, Droplets, Thermometer, FlaskConical, CheckCircle2 } from 'lucide-react';

export function SolutionSection() {
  return (
    <section id="solusi" className="py-20 bg-muted/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider text-primary border-primary/30">
            Dedicated Monitoring Solutions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Dua Arsitektur Khusus untuk Kebutuhan Lingkungan Anda
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Insight Laboratory mendukung dua jenis stasiun telemetri terstandar untuk pemantauan atmosfer dan tanah.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* AQMS Card */}
          <Card className="relative overflow-hidden border-border/60 hover:border-blue-500/50 transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <CardHeader className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Wind className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">AQMS System</CardTitle>
                  <Badge variant="secondary" className="font-mono text-xs">AIR QUALITY</Badge>
                </div>
                <CardDescription className="text-base">
                  Air Quality Monitoring System untuk deteksi polusi dan kondisi udara mikroklimat.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parameter yang Diukur</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Gauge className="w-4 h-4 text-blue-500" />
                    <span>Particulate Matter (PM2.5)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Karbon Monoksida (CO)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span>Suhu Udara (°C)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    <span>Kelembapan Udara (%)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/40">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Use Cases</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Pemantauan emisi area pabrik & kawasan industri
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Indeks standar kualitas udara perkotaan & fasilitas publik
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* SOC Card */}
          <Card className="relative overflow-hidden border-border/60 hover:border-emerald-500/50 transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <CardHeader className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">SOC System</CardTitle>
                  <Badge variant="secondary" className="font-mono text-xs">SOIL & AGRI</Badge>
                </div>
                <CardDescription className="text-base">
                  Soil & Agricultural Condition System untuk pertanian cerdas dan kesuburan tanah.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parameter yang Diukur</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>Kelembapan Tanah (%)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <FlaskConical className="w-4 h-4 text-purple-500" />
                    <span>Derajat Keasaman (pH)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Thermometer className="w-4 h-4 text-amber-500" />
                    <span>Suhu Substrat Tanah (°C)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-background/50 border border-border/40 text-sm">
                    <Gauge className="w-4 h-4 text-emerald-500" />
                    <span>Indeks Konduktivitas Elektrik</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/40">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Use Cases</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Presisi irigasi perkebunan dan rumah kaca (Greenhouse)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Pemantauan degradasi kesuburan tanah dan konservasi alam
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
