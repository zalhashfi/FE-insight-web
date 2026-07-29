# Insight Lab - Frontend (UI)

Frontend Web Dashboard untuk platform pemantauan **Insight Lab**, dibangun dengan React 19 dan Vite, menggunakan arsitektur komponen modern dengan Shadcn UI dan Tailwind CSS v4. Dashboard ini menampilkan data telemetri real-time, manajemen perangkat (stasiun), manajemen akses (user), serta fitur dukungan seperti pembaruan firmware dan tiket pemeliharaan.

Repository Backend (API): [BE-insight-web](https://github.com/zalhashfi/BE-insight-web)

## Key Features

- **Dashboard Analitik**: Tampilan interaktif dengan animasi Three.js pada Landing Page.
- **Data Sensor Real-time**: Menggunakan TanStack React Query (`staleTime: 0`) agar tampilan sensor dan telemetri bebas *stale data* dengan skeleton loading yang mulus.
- **Manajemen Alat & User**: Antarmuka CRUD penuh untuk pengaturan Alat dan Pengguna dengan proteksi role-based (Admin, Engineer).
- **Firmware & Tiket**: Halaman pengelolaan firmware untuk OTA update dan pembuatan tiket maintenance perangkat.
- **Autentikasi Aman**: Integrasi transparan dengan HttpOnly JWT cookie dari Backend, tanpa menyimpan token di localStorage.
- **Modern UI**: Penggunaan *Geist Variable* font, komponen aksesibel dari Shadcn UI, dan transisi fluid.

## Tech Stack

- **Language**: TypeScript (Node.js)
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State/Data Fetching**: TanStack React Query v5
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI (Radix UI) & Lucide Icons
- **3D Graphics**: Three.js (@react-three/fiber, @react-three/drei)

## Prerequisites

- Node.js 20+
- npm atau pnpm
- [Backend API (BE-insight-web)](https://github.com/zalhashfi/BE-insight-web) harus sudah berjalan.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/zalhashfi/FE-insight-web.git
cd FE-insight-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Karena aplikasi ini menggunakan Vite Proxy di development, Anda tidak perlu repot mengubah `.env` secara manual jika Backend berjalan di domain default. Namun, jika diperlukan, siapkan `.env`:

```bash
cp .env.example .env
```

| Variable           | Description                  | Default                                      |
| ------------------ | ---------------------------- | -------------------------------------------- |
| `VITE_API_URL`     | URL Backend API              | `https://backend.rizalhashfi.workers.dev`    |

*(Catatan: Konfigurasi default `vite.config.ts` sudah mengatur proksi `/api` ke worker backend)*

### 4. Start Development Server

```bash
npm run dev
```

Buka `http://localhost:5173` di browser Anda.

---

## Architecture

### Directory Structure

```
├── src/
│   ├── components/
│   │   ├── layout/       # ProtectedRoute, DashboardLayout
│   │   ├── three/        # NetworkBackground untuk Three.js
│   │   └── ui/           # Komponen reusable dari Shadcn (Button, Card, Skeleton, dll)
│   ├── contexts/
│   │   └── AuthContext.tsx # Manajemen state sesi JWT
│   ├── lib/
│   │   └── utils.ts      # Tailwind class merger (cn)
│   ├── pages/
│   │   ├── auth/         # LoginPage
│   │   ├── firmware/     # FirmwarePage
│   │   ├── profile/      # ProfilePage
│   │   ├── stations/     # StationList, AddStationDialog, UnregisteredDevices
│   │   ├── telemetry/    # TelemetryList
│   │   ├── tickets/      # TicketList
│   │   ├── users/        # UserList
│   │   ├── DashboardHome.tsx
│   │   ├── LandingPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── App.tsx           # Setup Routes & React Query Provider
│   ├── index.css         # Tailwind directives & CSS Variables Oklch
│   └── main.tsx          # React Entry Point
├── vite.config.ts        # Konfigurasi Vite & Proxy
└── package.json          # Dependensi
```

### Data Flow & State Management

1. **Routing**: Dikelola oleh React Router. Rute dengan akses terbatas dibungkus dengan komponen `<ProtectedRoute />`.
2. **Authentication**: `AuthContext` menampung state login (tanpa menyimpan token) dengan membaca data dari API. Semua fetch request memanggil `credentials: 'include'`.
3. **Data Fetching**: Dikelola oleh TanStack Query.
   - Digunakan untuk caching selektif, refetch otomatis, dan handling state loading/error.
   - Konfigurasi default diset ke `staleTime: 0` agar UI memprioritaskan penyajian skeleton sementara fetch background dijalankan demi data *fresh*.
4. **UI Styling**: Tailwind CSS dikombinasikan dengan class-variance-authority (`cva`) dan `clsx` dalam library `shadcn/ui`.

---

## Available Scripts

| Command                       | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| `npm run dev`                 | Start Vite dev server dengan proxy ke backend       |
| `npm run build`               | Compile TypeScript dan Build production bundle      |
| `npm run lint`                | Jalankan Oxlint untuk analisis statis kode          |
| `npm run preview`             | Preview hasil build production di lokal             |

---

## Deployment

Aplikasi ini dapat di-deploy ke berbagai platform static hosting seperti **Vercel**, **Netlify**, atau **Cloudflare Pages**. 

Contoh menggunakan **Cloudflare Pages**:

1. Login ke Cloudflare Dashboard.
2. Buat proyek Pages baru dari Git (hubungkan ke repo GitHub ini).
3. Set build configuration:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy!

*Penting: Karena backend mengandalkan HttpOnly cookie untuk JWT, pastikan domain Frontend dan Backend Anda mendukung CORS dan Credentials dengan benar di level produksi (biasanya direkomendasikan berjalan pada subdomain yang sama atau apex domain yang sama).*

---

## Troubleshooting

### CORS / API Error di Lokal
**Error:** Tidak bisa login / data tidak muncul di localhost.
**Solution:**
Pastikan Backend Worker berjalan dan `vite.config.ts` proksinya mengarah ke URL backend yang tepat. Jika menggunakan URL production backend (`*.workers.dev`), browser mungkin akan memblokir *third-party cookie*. Sangat disarankan menjalankan Backend secara lokal (`npm run dev` pada BE) dan mengubah target proxy di `vite.config.ts` ke `http://localhost:8787`.

### Skeleton Loading Tampil Terus Menerus
**Error:** Layar tersangkut di animasi skeleton.
**Solution:**
Periksa tab Network di browser. Kemungkinan API mengembalikan HTTP 500 atau 401 dan tidak ada error boundary yang menangkapnya. Cek log pada Backend Worker untuk debugging lebih lanjut.
