import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3 } from 'lucide-react';
import NetworkBackground from '@/components/three/NetworkBackground';

export function HeroSection() {
  const handleScrollToTelemetry = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('telemetry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-12 pb-16">
      <NetworkBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide backdrop-blur-sm shadow-sm">
          <img src="/BIRULANGIT LOGOGRAM.svg" alt="Logo Biru Langit" className="w-4 h-4" />
          <span>Sistem Monitoring IoT Lingkungan</span>
          <span className="w-1 h-1 rounded-full bg-primary/40"></span>
          <span className="text-muted-foreground font-normal">v1.0</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Pemantauan Data Sensor <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Udara dan Tanah
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            Platform pengumpulan dan visualisasi data stasiun kualitas udara (AQMS) dan kondisi tanah (SOC) secara real-time dari Biru Langit.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-md">
              Buka Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <a href="#telemetry" onClick={handleScrollToTelemetry} className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-semibold backdrop-blur-sm">
              <BarChart3 className="mr-2 h-4 w-4 text-primary" />
              Lihat Data Sensor
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
