import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProjectShowcase } from '@/components/landing/ProjectShowcase';
import { LiveTelemetryPreview } from '@/components/landing/LiveTelemetryPreview';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* 1. Header / Navigation */}
      <Navbar />

      {/* 2. Main Sections */}
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <ProjectShowcase />
        <LiveTelemetryPreview />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
