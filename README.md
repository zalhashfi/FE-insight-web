# Insight Laboratory - Frontend

Sistem monitoring dan manajemen perangkat IoT "Biru Langit" - Antarmuka Pengguna.

## Teknologi Utama
- **Framework:** React 19 dengan Vite
- **Routing:** React Router v7
- **State Management:** TanStack React Query v5
- **Styling:** TailwindCSS v4 dengan Oklch colors
- **Komponen:** Shadcn UI (Radix Primitives)
- **Animasi 3D:** Three.js (@react-three/fiber, @react-three/drei)
- **Visualisasi Data:** Recharts

## Fitur
1. **Authentication:** JWT HttpOnly cookie-based auth dengan Role-Based Access Control (Admin, Engineer, User).
2. **Landing Page:** Halaman depan dengan animasi 3D interaktif.
3. **Dashboard:** Ringkasan jumlah alat, perangkat yang belum terdaftar, dan data terakhir masuk.
4. **Manajemen Alat (Stations):** CRUD alat, registrasi otomatis untuk perangkat baru (unregistered devices).
5. **Data Sensor (Telemetry):** Visualisasi grafik *real-time* dengan opsi agregasi (2 menit, 1 jam, harian) dan riwayat data tabular.
6. **Manajemen Pengguna:** CRUD user (Hanya Admin).
7. **Firmware (OTA):** Manajemen rilis firmware OTA untuk alat (Hanya Admin & Engineer).
8. **Manajemen Tiket:** Pelaporan kendala/maintenance alat.

## Struktur Direktori Utama
- `src/components/` - Komponen UI *reusable* (terutama Shadcn UI) dan Layout
- `src/contexts/` - React Context (AuthContext)
- `src/lib/` - Utilities seperti `apiFetch` (global 401 interceptor)
- `src/pages/` - Halaman-halaman rute utama (Dashboard, StationList, TelemetryList, dll)
- `src/utils/` - Helper tambahan (logger)

## Instalasi & Menjalankan (Development)
```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

## Build & Deployment
Aplikasi ini sudah dipisahkan dari backend dan menggunakan proxy Vite `/api` di tahap *development*. Untuk *production*, pastikan *web server* diatur untuk melakukan *routing fallback* ke `index.html`.
```bash
npm run build
```
