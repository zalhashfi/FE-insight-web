import { Link } from 'react-router';
import { Mail } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="tentang" className="border-t border-border/40 bg-card/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <img src="/BIRULANGIT.svg" alt="Biru Langit" className="h-7 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              <strong>INSIGHT Lab</strong> (<em>Innovation and Sustainability for Geo-Environmental Health Laboratorium</em>) dikembangkan oleh <strong>PT Ekshalasi Langit Biru</strong> sebagai platform pemantauan telemetri kualitas udara berbasis IoT.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <a 
                href="https://instagram.com/birulangit.ofc" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-lg bg-muted/50 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Instagram Biru Langit"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="mailto:contact@birulangit.id" 
                className="p-2 rounded-lg bg-muted/50 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Email Biru Langit"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Sistem & Solusi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#mitra" onClick={scrollTo('mitra')} className="hover:text-foreground transition-colors cursor-pointer">Mitra Riset</a></li>
              <li><a href="#proyek" onClick={scrollTo('proyek')} className="hover:text-foreground transition-colors cursor-pointer">Studi Kasus SMP Telkom</a></li>
              <li><a href="#telemetry" onClick={scrollTo('telemetry')} className="hover:text-foreground transition-colors cursor-pointer">Data Telemetri</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Akses Dashboard</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Halaman Masuk</Link></li>
              <li><Link to="/stations" className="hover:text-foreground transition-colors">Daftar Perangkat</Link></li>
              <li><Link to="/telemetry" className="hover:text-foreground transition-colors">Riwayat Sensor</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PT Ekshalasi Langit Biru (Biru Langit). Hak cipta dilindungi undang-undang.</p>
          <span className="text-[11px] font-mono">Powered by Data. Driven by Impact.</span>
        </div>
      </div>
    </footer>
  );
}

