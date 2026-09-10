import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, MapPin, Activity, BellRing, Users, CheckCircle2 } from 'lucide-react';

export function ProjectShowcase() {
  return (
    <section id="proyek" className="py-20 bg-muted/30 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider text-primary border-primary/30">
              Studi Kasus Lapangan
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Implementasi di SMP Telkom
            </h2>
            <p className="text-muted-foreground text-base">
              Pemasangan unit sensor pemantau udara dan sistem peringatan dini berbasis aktivitas warga sekolah.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-card/60 p-2.5 rounded-lg border border-border/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Status: Fase Persiapan & Instalasi</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <Card className="lg:col-span-7 bg-card/80 backdrop-blur-md border-border/60 shadow-lg flex flex-col justify-between">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Pemantauan Udara Lingkungan Sekolah</CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>Lokasi: SMP Telkom (Koordinasi Mei 2026)</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">INDOOR & OUTDOOR</Badge>
              </div>

              <CardDescription className="text-sm sm:text-base leading-relaxed">
                Penempatan sensor memprioritaskan area dengan tingkat kepadatan aktivitas tinggi, terhubung dengan indikator visual kualitas udara untuk siswa dan guru.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-muted/50 border border-border/40 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>Titik Indoor</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dipasang di Ruang Guru dan Ruang Kelas untuk memantau sirkulasi udara dan partikulat debu saat kegiatan belajar.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-muted/50 border border-border/40 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <BellRing className="w-4 h-4 text-amber-500" />
                    <span>Titik Outdoor & EWS</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dipasang di area panggung sekolah dan depan gerbang, dilengkapi indikator bendera visual agar kondisi udara luar mudah dilihat.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rincian Kegiatan</h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Pengiriman data PM2.5, CO, suhu, dan kelembapan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sosialisasi lingkungan sehat untuk siswa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Penyediaan data berkala untuk evaluasi sekolah</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Akses data langsung melalui dashboard FE-insight</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            <Card className="bg-card/70 border-border/60 backdrop-blur-md p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Koordinasi Operasional</h3>
                  <p className="text-xs text-muted-foreground">Izin teknis dan sarana prasarana</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pelaksanaan dikoordinasikan langsung bersama Bagian Kemahasiswaan dan Sarana Prasarana sekolah untuk legalitas pemasangan, jalur daya listrik, dan perlindungan unit sensor.
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/10 via-primary/5 to-cyan-500/10 border-blue-500/30 p-6 space-y-3">
              <Badge variant="outline" className="border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono">
                PENERAPAN MITRA
              </Badge>
              <h3 className="font-bold text-base text-foreground">
                Dukungan untuk Sekolah dan Kampus
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stasiun AQMS dapat dipasang secara modular pada gedung pendidikan dan ruang pertemuan untuk memantau kelayakan sirkulasi udara harian.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
