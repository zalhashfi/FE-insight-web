import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3 } from 'lucide-react';
import NetworkBackground from '@/components/three/NetworkBackground';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
      <NetworkBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <img src="/BIRULANGIT LOGOGRAM.svg" alt="Logogram" className="w-4 h-4" />
          <span>Next-Gen Environmental IoT Platform</span>
          <span className="w-1 h-1 rounded-full bg-primary/40"></span>
          <span className="text-muted-foreground font-normal">v1.0 Ready</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Pemantauan & Analisis IoT <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Presisi Lingkungan
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            Platform terpadu dari <strong>Biru Langit</strong> untuk mengumpulkan, menganalisis, dan memvisualisasikan data sensor kualitas udara (AQMS) dan kondisi tanah (SOC) secara real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-md hover:shadow-primary/25 transition-all">
              Akses Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <a href="#telemetry" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-semibold backdrop-blur-sm">
              <BarChart3 className="mr-2 h-4 w-4 text-primary" />
              Lihat Live Telemetri
            </Button>
          </a>
        </div>

        {/* Quick Highlights bar */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-border/40 text-left">
          <div className="p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30">
            <div className="text-2xl font-bold text-foreground font-mono">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime Sensor Network</div>
          </div>
          <div className="p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30">
            <div className="text-2xl font-bold text-primary font-mono">&lt; 1s</div>
            <div className="text-xs text-muted-foreground">Telemetry Latency</div>
          </div>
          <div className="p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30">
            <div className="text-2xl font-bold text-foreground font-mono">AQMS + SOC</div>
            <div className="text-xs text-muted-foreground">Multi-Device Architecture</div>
          </div>
          <div className="p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30">
            <div className="text-2xl font-bold text-primary font-mono">OTA Ready</div>
            <div className="text-xs text-muted-foreground">Remote Firmware Upgrade</div>
          </div>
        </div>
      </div>
    </section>
  );
}
