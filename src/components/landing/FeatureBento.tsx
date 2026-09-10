import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HardDriveDownload, ShieldCheck, Radio, Zap } from 'lucide-react';

export function FeatureBento() {
  return (
    <section id="fitur" className="py-20 bg-muted/20 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider text-primary border-primary/30">
            Kemampuan Sistem
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Fitur Utama Platform
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Mendukung operasional harian teknisi dan pemantauan berkala instansi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-gradient-to-br from-card to-card/60 border-border/60 p-2 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 border border-blue-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Penerimaan Data Sensor Real-Time</CardTitle>
              <CardDescription className="text-base">
                Menerima paket telemetri berkala dari unit ESP32/mikrokontroler melalui REST API dengan format JSON terstruktur.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/60 border border-border/40 font-mono text-xs text-muted-foreground space-y-1">
                <div className="text-emerald-500">Endpoint: POST /api/data/ingest</div>
                <div>Payload: &#123; uuid, sensor_type, measured_at, ...metrics &#125;</div>
                <div>Database: MySQL / Relational Time-series Log</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/60 border-border/60 p-2 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 border border-indigo-500/20">
                <HardDriveDownload className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Pembaruan Firmware OTA</CardTitle>
              <CardDescription>
                Distribusi pembaruan kode binari stasiun langsung melalui jaringan tanpa melepas unit di lapangan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-muted/60 border border-border/40 text-xs space-y-2">
                <div className="flex justify-between font-mono">
                  <span>Versi: v2.1.0</span>
                  <Badge variant="outline" className="text-[10px]">Tersedia</Badge>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-full rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/60 border-border/60 p-2 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2 border border-cyan-500/20">
                <Radio className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Deteksi Perangkat Baru</CardTitle>
              <CardDescription>
                Mencatat otomatis MAC address stasiun baru yang mencoba terhubung untuk memudahkan registrasi awal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-muted/60 border border-border/40 text-xs font-mono">
                <div className="text-amber-500">Stasiun Belum Terdaftar</div>
                <div className="text-muted-foreground truncate">MAC: EC:FA:BC:11:89:90</div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-gradient-to-br from-card to-card/60 border-border/60 p-2 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 border border-purple-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Pengaturan Peran Pengguna (RBAC)</CardTitle>
              <CardDescription className="text-base">
                Pemisahan hak akses operasional berbasis peran menggunakan autentikasi token JWT.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40">
                  <div className="font-semibold text-foreground">Admin</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Kelola pengguna dan konfigurasi</div>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40">
                  <div className="font-semibold text-foreground">Engineer</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Registrasi alat dan upload firmware</div>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40">
                  <div className="font-semibold text-foreground">User</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Melihat riwayat dan grafik</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
