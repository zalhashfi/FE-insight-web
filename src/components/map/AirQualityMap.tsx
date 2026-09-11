import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapStation {
  uuid: string;
  name: string;
  projectName?: string;
  type: string;
  macAddress?: string | null;
  currentVersion?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: 'online' | 'offline' | 'warning';
  pm25?: number | null;
  temperature?: number | null;
  humidity?: number | null;
  co?: number | null;
}

interface AirQualityMapProps {
  stations: MapStation[];
  selectedStationId?: string | null;
  onSelectStation?: (station: MapStation) => void;
  height?: string;
  interactive?: boolean;
  className?: string;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

// Fallback coordinates (Telkom University / SMP Telkom Bandung area)
const DEFAULT_COORDS: [number, number] = [-6.974, 107.63];

function getMarkerColor(station: MapStation): { bg: string; border: string; label: string } {
  if (station.status === 'offline') {
    return { bg: '#64748b', border: '#475569', label: 'Offline' };
  }
  if (station.pm25 != null) {
    if (station.pm25 <= 50) {
      return { bg: '#10b981', border: '#059669', label: 'Baik' };
    }
    if (station.pm25 <= 100) {
      return { bg: '#f59e0b', border: '#d97706', label: 'Sedang' };
    }
    return { bg: '#ef4444', border: '#dc2626', label: 'Tidak Sehat' };
  }
  // Default active brand color
  return { bg: '#0079FE', border: '#005fcc', label: 'Aktif' };
}

function createCustomIcon(station: MapStation, isSelected: boolean): L.DivIcon {
  const { bg, border: _border } = getMarkerColor(station);
  const size = isSelected ? 34 : 26;
  const pulseSize = size + 10;

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: absolute;
        width: ${pulseSize}px;
        height: ${pulseSize}px;
        border-radius: 50%;
        background-color: ${bg};
        opacity: 0.25;
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background-color: ${bg};
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 700;
        font-size: ${isSelected ? '12px' : '10px'};
        text-transform: uppercase;
      ">
        ${station.type.slice(0, 3)}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-aqi-marker',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export const AirQualityMap: React.FC<AirQualityMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  height = '520px',
  interactive = true,
  className = '',
  defaultCenter = DEFAULT_COORDS,
  defaultZoom = 13,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Check if valid center is available from first station
    const firstWithCoords = stations.find((s) => s.latitude != null && s.longitude != null);
    const initialCenter = firstWithCoords?.latitude && firstWithCoords?.longitude
      ? [firstWithCoords.latitude, firstWithCoords.longitude] as [number, number]
      : defaultCenter;

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: defaultZoom,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive ? 'center' : false,
      doubleClickZoom: interactive,
      zoomControl: interactive,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    markerGroupRef.current = markerGroup;
    mapRef.current = map;

    // Force layout recalculation after mounting
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markerGroupRef.current = null;
    };
  }, [defaultCenter, defaultZoom, interactive, stations]);

  // Update Markers when stations or selection change
  useEffect(() => {
    const map = mapRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    stations.forEach((station, index) => {
      // Deterministic spread around default coords if lat/lng missing
      let lat = station.latitude;
      let lng = station.longitude;

      if (lat == null || lng == null) {
        // Offset slightly in circle pattern based on index
        const angle = (index * (2 * Math.PI)) / Math.max(stations.length, 1);
        const radius = 0.008 + (index % 3) * 0.004;
        lat = defaultCenter[0] + radius * Math.cos(angle);
        lng = defaultCenter[1] + radius * Math.sin(angle);
      }

      const isSelected = station.uuid === selectedStationId;
      const icon = createCustomIcon(station, isSelected);
      const marker = L.marker([lat, lng], { icon });

      const quality = getMarkerColor(station);

      const popupContent = `
        <div style="min-width: 180px; font-family: inherit; padding: 4px 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: 700; font-size: 13px; color: #0f172a;">${station.name}</span>
            <span style="
              font-size: 10px;
              font-weight: 600;
              padding: 2px 6px;
              border-radius: 9999px;
              background-color: ${quality.bg}20;
              color: ${quality.bg};
            ">${quality.label}</span>
          </div>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0;">
            ${station.projectName || 'Proyek INSIGHT Lab'} &bull; <strong>${station.type.toUpperCase()}</strong>
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; background: #f8fafc; padding: 6px; border-radius: 6px; margin-bottom: 8px;">
            <div>
              <span style="color: #64748b; font-size: 10px;">PM2.5</span>
              <div style="font-weight: 600; color: #0f172a;">${station.pm25 != null ? `${station.pm25} µg/m³` : 'N/A'}</div>
            </div>
            <div>
              <span style="color: #64748b; font-size: 10px;">Suhu</span>
              <div style="font-weight: 600; color: #0f172a;">${station.temperature != null ? `${station.temperature}°C` : 'N/A'}</div>
            </div>
          </div>
          <button id="btn-select-${station.uuid}" style="
            width: 100%;
            background-color: #0079FE;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">Lihat Detail Stasiun</button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${station.uuid}`);
        if (btn && onSelectStation) {
          btn.onclick = () => onSelectStation(station);
        }
      });

      marker.on('click', () => {
        if (onSelectStation) {
          onSelectStation(station);
        }
      });

      markerGroup.addLayer(marker);
      bounds.push([lat, lng]);

      if (isSelected) {
        marker.openPopup();
        map.setView([lat, lng], Math.max(map.getZoom(), 14));
      }
    });

    if (bounds.length > 1 && !selectedStationId) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] });
    }
  }, [stations, selectedStationId, onSelectStation, defaultCenter]);

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-border/70 shadow-sm z-0 ${className}`}
      style={{ height }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
