import { GraduationCap, Landmark, Globe2, Cpu, Award } from 'lucide-react';

const partners = [
  {
    name: 'Telkom University',
    role: 'Pusat Riset Utama & Inkubasi',
    icon: GraduationCap,
  },
  {
    name: 'IPB University',
    role: 'Riset Kolaborasi Lingkungan',
    icon: Landmark,
  },
  {
    name: 'Kanazawa University',
    role: 'Mitra Riset Internasional',
    icon: Globe2,
  },
  {
    name: 'Universiti Teknologi PETRONAS',
    role: 'Kolaborasi Akademik & Sensor',
    icon: GraduationCap,
  },
  {
    name: 'Bandung Techno Park',
    role: 'Akselerasi Teknologi & IoT',
    icon: Cpu,
  },
  {
    name: 'Kemendikbudristek',
    role: 'Dukungan Program Riset',
    icon: Award,
  },
];

export function PartnerSection() {
  return (
    <section id="mitra" className="py-14 border-y border-border/40 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Ekosistem & Kolaborasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Mitra Riset & Institusi Pendukung
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Pengembangan sensor dan metodologi pemantauan lingkungan INSIGHT Lab didukung oleh jejaring riset terkemuka.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner) => {
            const Icon = partner.icon;
            return (
              <div
                key={partner.name}
                className="group flex flex-col items-center text-center p-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-sm"
              >
                <div className="p-2.5 rounded-lg bg-primary/5 text-primary border border-primary/10 mb-3 group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-foreground line-clamp-2 leading-snug">
                  {partner.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                  {partner.role}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
