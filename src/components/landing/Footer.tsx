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
              <strong>Insight Laboratory</strong> adalah ekosistem pemantauan lingkungan IoT berbasis cloud untuk mendukung inisiatif udara bersih, pertanian berkelanjutan, dan analitik presisi.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Solusi & Sistem</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#solusi" className="hover:text-foreground transition-colors">AQMS (Air Quality)</a></li>
              <li><a href="#solusi" className="hover:text-foreground transition-colors">SOC (Soil & Agri)</a></li>
              <li><a href="#proyek" className="hover:text-foreground transition-colors">PENGMAS SMP Telkom</a></li>
              <li><a href="#telemetry" className="hover:text-foreground transition-colors">Live Telemetry</a></li>
              <li><a href="#fitur" className="hover:text-foreground transition-colors">OTA Firmware Engine</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Akses Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Masuk ke Dashboard</Link></li>
              <li><Link to="/stations" className="hover:text-foreground transition-colors">Daftar Stasiun Alat</Link></li>
              <li><Link to="/telemetry" className="hover:text-foreground transition-colors">Data Riwayat Sensor</Link></li>
              <li><a href="https://github.com/zalhashfi/FE-insight-web" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub Repository</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Biru Langit. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <span>Powered by React 19, Vite, Three.js & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
