import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, MapPin, Activity, BellRing, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function ProjectShowcase() {
  return (
    <section id="proyek" className="py-20 bg-muted/30 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider text-primary border-primary/30">
              Implementasi Nyata di Lapangan
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Program Pengabdian Masyarakat (PENGMAS)
            </h2>
            <p className="text-muted-foreground text-base">
              Penerapan sistem monitoring IoT cerdas dan <em>Early Warning System</em> kualitas udara berbasis aktivitas pada institusi pendidikan.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-card/60 p-2.5 rounded-lg border border-border/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Status: Pilot Deployment Ready</span>
          </div>
        </div>

        {/* Featured Case Card */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <Card className="lg:col-span-7 bg-card/80 backdrop-blur-md border-border/60 shadow-lg flex flex-col justify-between">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Instalasi AQMS di SMP Telkom</CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>Mitra Edukasi: SMP Telkom (Survei & Koordinasi Mei 2026)</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">AQMS INDOOR / OUTDOOR</Badge>
              </div>

              <CardDescription className="text-sm sm:text-base leading-relaxed">
                Strategi penempatan unit sensor menggunakan <strong>metode sampling berbasis aktivitas</strong> di zona kepadatan tinggi (*high peak activity*), dilengkapi dengan sistem peringatan dini visual bagi siswa dan tenaga pengajar.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-muted/50 border border-border/40 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>Titik Indoor Sampling</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dipasang pada <strong>Ruang Guru</strong> & <strong>Ruang Kelas</strong> untuk memantau mikroklimat ruang belajar dan konsentrasi partikulat udara secara kontinyu.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-muted/50 border border-border/40 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <BellRing className="w-4 h-4 text-amber-500" />
                    <span>Early Warning System</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Sistem indikator visual (flag/display status) di <strong>area publik & panggung sekolah</strong> agar status kualitas udara luar langsung terpantau warga sekolah.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Output & Dampak Program</h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Telemetri PM2.5, CO, Suhu, & Kelembapan real-time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Edukasi lingkungan hidup & sosialisasi siswa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Integrasi data langsung ke Dashboard Biru Langit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Data referensi kebijakan lingkungan sehat sekolah</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Metrics & Architecture Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            <Card className="bg-card/70 border-border/60 backdrop-blur-md p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Kolaborasi Multi-Pihak</h3>
                  <p className="text-xs text-muted-foreground">Sinergi riset, universitas, & mitra sekolah</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Melibatkan koordinasi terpadu antara Bagian Kemahasiswaan, Sarana Prasarana (Sapra), dan Dewan Guru untuk legalitas, tata kelola keamanan alat, dan integrasi kurikulum edukasi lingkungan.
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/10 via-primary/5 to-cyan-500/10 border-blue-500/30 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono">
                  NEXT PROJECT ROLLOUT
                </Badge>
                <ShieldAlert className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Siap untuk Kemitraan & Replikasi di Lokasi Anda
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Platform Insight Laboratory siap dikonfigurasi untuk sekolah, kampus, balai penelitian, perkebunan, dan instansi Anda dengan model stasiun modular.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
