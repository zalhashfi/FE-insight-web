import { Link } from 'react-router';

export function Footer() {
  return (
    <footer id="tentang" className="border-t border-border/40 bg-card/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <img src="/BIRULANGIT.svg" alt="Biru Langit" className="h-7 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Insight Laboratory adalah platform pemantauan telemetri IoT untuk mendukung pemantauan udara bersih, riset lingkungan, dan pertanian terukur.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Sistem & Solusi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#solusi" className="hover:text-foreground transition-colors">Stasiun AQMS (Udara)</a></li>
              <li><a href="#solusi" className="hover:text-foreground transition-colors">Stasiun SOC (Tanah)</a></li>
              <li><a href="#proyek" className="hover:text-foreground transition-colors">Pemasangan SMP Telkom</a></li>
              <li><a href="#telemetry" className="hover:text-foreground transition-colors">Data Telemetri</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Akses Dashboard</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Halaman Masuk</Link></li>
              <li><Link to="/stations" className="hover:text-foreground transition-colors">Daftar Perangkat</Link></li>
              <li><Link to="/telemetry" className="hover:text-foreground transition-colors">Riwayat Sensor</Link></li>
              <li><a href="https://github.com/zalhashfi/FE-insight-web" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Repositori GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Biru Langit. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <span>FE-insight-web v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
