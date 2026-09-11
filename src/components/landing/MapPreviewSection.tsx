import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTelkomStationsOverview } from '@/services/telkomApi';
import { AirQualityMap, getIspuQuality, type MapStation } from '@/components/map/AirQualityMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

// Realistic representative fallback stations for landing page GIS demonstration
const SHOWCASE_STATIONS: MapStation[] = [
  {
    uuid: 'telkom-tult',
    name: 'TULT',
    projectName: 'Telkom University AQMS',
    type: 'aqms',
    latitude: -6.968739,
    longitude: 107.628128,
    status: 'online',
    pm25: 58,
    temperature: 28.5,
    humidity: 62,
  },
  {
    uuid: 'telkom-gku',
    name: 'GKU',
    projectName: 'Telkom University AQMS',
    type: 'aqms',
    latitude: -6.972739,
    longitude: 107.629506,
    status: 'online',
    pm25: 76,
    temperature: 32.2,
    humidity: 54,
  },
  {
    uuid: 'telkom-deli',
    name: 'Gedung Deli',
    projectName: 'Telkom University AQMS',
    type: 'aqms',
    latitude: -6.975472,
    longitude: 107.629619,
    status: 'online',
    pm25: 99,
    temperature: 25.1,
    humidity: 80,
  },
];

export function MapPreviewSection() {
  const { data: stations = SHOWCASE_STATIONS } = useQuery({
    queryKey: ['landing-telkom-stations'],
    queryFn: async () => {
      try {
        const res = await getTelkomStationsOverview();
        return res && res.length > 0 ? res : SHOWCASE_STATIONS;
      } catch {
        return SHOWCASE_STATIONS;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const selectedStation = stations.find((s) => s.uuid === selectedStationId) || stations[0];
  return (
    <section id="map-preview" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <MapPin className="h-3.5 w-3.5" />
            GIS Spasial &amp; Pemantauan Lapangan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Pemetaan Kualitas Udara Real-Time
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Visualisasi pemantauan geografis sebaran stasiun INSIGHT Lab di lapangan. Ditenagai OpenStreetMap dan Leaflet yang ringan dan berpresisi tinggi.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/login">
            <Button size="lg" className="rounded-xl shadow-md font-semibold gap-2">
              Akses Dashboard Peta
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Map Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Interactive Station Selector */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Titik Pemantauan Aktif
            </h3>
            {stations.map((station) => {
              const isSelected = selectedStation.uuid === station.uuid;
              return (
                <Card
                  key={station.uuid}
                  onClick={() => setSelectedStationId(station.uuid)}
                  className={`cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border/60 hover:bg-muted/30'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-foreground">{station.name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {station.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{station.projectName}</p>
                    <div className="grid grid-cols-3 gap-2 text-center bg-background/80 rounded-lg p-2 border border-border/40 text-xs">
                      <div>
                        <div className="text-[10px] text-muted-foreground">PM2.5</div>
                        <div className={`font-bold ${getIspuQuality(station.pm25).textClass}`}>
                          {station.pm25 != null ? `${station.pm25} µg/m³` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">Suhu</div>
                        <div className="font-bold text-foreground">{station.temperature}°C</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">Lembap</div>
                        <div className="font-bold text-foreground">{station.humidity}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Sertifikasi &amp; Standar ISPU
            </div>
            <p>
              Penanda warna stasiun mengikuti baku mutu indeks standar pencemar udara (ISPU) Kementerian LHK dan acuan WHO.
            </p>
          </div>
        </div>

        {/* Right Leaflet Map */}
        <div className="lg:col-span-2 min-h-[460px] h-full flex flex-col">
          <AirQualityMap
            stations={stations}
            selectedStationId={selectedStation.uuid}
            onSelectStation={(s) => setSelectedStationId(s.uuid)}
            height="100%"
            className="flex-1 min-h-[460px] border-border/70"
          />
        </div>
      </div>
    </section>
  );
}
