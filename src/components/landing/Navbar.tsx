import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/BIRULANGIT.svg" 
            alt="Biru Langit" 
            className="h-8 w-auto" 
          />
          <div className="hidden sm:flex flex-col border-l border-border/60 pl-3">
            <span className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Insight Laboratory
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Sistem Telemetri & Analisis IoT
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#solusi" className="hover:text-foreground transition-colors">
            Solusi
          </a>
          <a href="#proyek" className="hover:text-foreground transition-colors">
            Studi Kasus
          </a>
          <a href="#telemetry" className="hover:text-foreground transition-colors">
            Telemetri
          </a>
          <a href="#fitur" className="hover:text-foreground transition-colors">
            Fitur
          </a>
          <a href="#tentang" className="hover:text-foreground transition-colors">
            Tentang
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Jaringan Aktif</span>
          </div>

          <Link to="/login">
            <Button size="sm" className="font-semibold shadow-sm">
              Masuk ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
