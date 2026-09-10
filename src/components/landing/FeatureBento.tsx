import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HardDriveDownload, ShieldCheck, Radio, Zap } from 'lucide-react';

export function FeatureBento() {
  return (
    <section id="fitur" className="py-20 bg-muted/20 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider text-primary border-primary/30">
            Platform Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Infrastruktur IoT yang Andal, Terukur, & Terstandarisasi
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Dirancang dari dasar untuk memenuhi standar industri pemantauan mikrokontroler dan analitik data cerdas.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Real-time Ingestion (Span 2) */}
          <Card className="md:col-span-2 bg-gradient-to-br from-card to-card/60 border-border/60 hover:border-primary/40 transition-all p-2 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 border border-blue-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Real-time Telemetry Streaming & Ingestion</CardTitle>
              <CardDescription className="text-base">
                Pipeline data terdistribusi yang mampu menerima ribuan paket telemetri sensor per detik melalui HTTP REST API dan broker MQTT dengan latensi submiliar detik.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/60 border border-border/40 font-mono text-xs text-muted-foreground space-y-1">
                <div className="text-emerald-500">✓ Ingestion Worker: Active (100% Health)</div>
                <div>Payload schema: &#123; device_uuid, sensor_type, measured_at, data: [...] &#125;</div>
                <div>Storage: Time-series Optimized Relational Database</div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: OTA Firmware */}
          <Card className="bg-gradient-to-br from-card to-card/60 border-border/60 hover:border-primary/40 transition-all p-2 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 border border-indigo-500/20">
                <HardDriveDownload className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Over-the-Air (OTA) Updates</CardTitle>
              <CardDescription>
                Manajemen pembaruan firmware mikrokontroler jarak jauh tanpa intervensi manual di lapangan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-muted/60 border border-border/40 text-xs space-y-2">
                <div className="flex justify-between font-mono">
                  <span>Target: AQMS-v2.1.0</span>
                  <Badge variant="outline" className="text-[10px]">Staged</Badge>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-3/4 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Auto Discovery */}
          <Card className="bg-gradient-to-br from-card to-card/60 border-border/60 hover:border-primary/40 transition-all p-2 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2 border border-cyan-500/20">
                <Radio className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Auto-Device Onboarding</CardTitle>
              <CardDescription>
                Deteksi otomatis perangkat baru via MAC address untuk onboarding cepat oleh teknisi lapangan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-muted/60 border border-border/40 text-xs font-mono">
                <div className="text-amber-500">⚠️ Unregistered Device Logged</div>
                <div className="text-muted-foreground truncate">MAC: EC:FA:BC:11:89:90</div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Role-based Security (Span 2) */}
          <Card className="md:col-span-2 bg-gradient-to-br from-card to-card/60 border-border/60 hover:border-primary/40 transition-all p-2 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 border border-purple-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Enterprise Role-Based Access Control (RBAC)</CardTitle>
              <CardDescription className="text-base">
                Manajemen hak akses granular untuk berbagai tingkatan pengguna: Administrator, Field Engineer, dan Regular Observer dengan token JWT terenkripsi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40">
                  <div className="font-semibold text-foreground">Admin</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Kontrol Penuh & Manajemen User</div>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40">
                  <div className="font-semibold text-foreground">Engineer</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Registrasi & Update Firmware</div>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40">
                  <div className="font-semibold text-foreground">User</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Pemantauan Data & Ekspor</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
