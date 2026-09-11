import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <a href="#mitra" onClick={scrollTo('mitra')} className="hover:text-foreground transition-colors cursor-pointer">
            Mitra
          </a>
          <a href="#proyek" onClick={scrollTo('proyek')} className="hover:text-foreground transition-colors cursor-pointer">
            Studi Kasus
          </a>
          <a href="#telemetry" onClick={scrollTo('telemetry')} className="hover:text-foreground transition-colors cursor-pointer">
            Data Telemetri
          </a>
          <a href="#map-preview" onClick={scrollTo('map-preview')} className="hover:text-foreground transition-colors cursor-pointer">
            Peta Spasial
          </a>
          <a href="#tentang" onClick={scrollTo('tentang')} className="hover:text-foreground transition-colors cursor-pointer">
            Tentang
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link to="/login">
            <Button size="sm" className="font-semibold shadow-sm cursor-pointer">
              Masuk ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
