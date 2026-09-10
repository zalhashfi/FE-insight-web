# Product Requirements Document (PRD) — FE-insight-web

## 1. Overview & Business Context
- **Entity**: PT Ekshalasi Langit Biru (Brand: **Biru Langit**)
- **Platform Name**: **Insight Laboratory** (INSIGHT Lab — *Innovation and Sustainability for Geo-Environmental Health Laboratorium*)
- **Motto**: *"Powered by Data. Driven by Impact"*
- **Product Type**: Web Client Frontend Dashboard & Landing Page for IoT Environmental Intelligence.
- **Core Domain**: Pemantauan data telemetri kualitas udara (*Air Quality Monitoring System* - AQMS) berbasis *Low-Cost Sensors* dan IoT secara real-time, tervalidasi, dan aplikatif.

---

## 2. Target Audience & Users
1. **Instansi & Institusi Pendidikan**: Pemantau mikroklimat ruang belajar, atap gedung, dan area publik (misal: SMP Telkom).
2. **Kawasan Industri & Smart City**: Pemantau emisi partikulat debu (PM2.5) dan gas polutan (CO) untuk kepatuhan baku mutu lingkungan.
3. **Internal Operator & Teknisi**: Pengelola stasiun perangkat IoT, kalibrasi sensor, dan pembaruan firmware OTA.

---

## 3. Scope & Key Modules

### A. Public Landing Page (`/`)
- **Header Navigation**: Logo resmi `BIRULANGIT.svg`, link navigasi dengan *smooth scroll*, tombol *ThemeToggle* (Light/Dark/System), dan akses cepat ke dashboard.
- **Hero Section**: Tagline resmi, penjelasan fungsi platform, visual animasi Three.js canvas (`NetworkBackground`), dan tombol CTA ganda.
- **Showcase Kolaborasi & Mitra**: Menampilkan mitra riset dan institusi resmi (Telkom University, IPB, Kanazawa University, UTP, Bandung Techno Park, Kemendikbudristek).
- **Studi Kasus Lapangan (PENGMAS)**: Studi kasus instalasi nyata di SMP Telkom (titik indoor ruang kelas/ruang guru, dan titik outdoor di atap sekolah dengan sistem peringatan dini/EWS).
- **Live Telemetry Interactive Preview**: Preview grafik LineChart Recharts untuk parameter AQMS (PM2.5, Suhu, Kelembapan, CO) dengan status ambang aman.
- **Footer**: Identitas legal PT Ekshalasi Langit Biru, tautan navigasi, sosial media (@birulangit.ofc), dan hak cipta.

### B. Authentication (`/login`)
- Form masuk dengan validasi field, toggle visibilitas password, indikator loading, dan integrasi JWT token via API terpusat.
- Dukungan *ThemeToggle* dan tautan kembali ke beranda.

### C. Protected Dashboard (`/dashboard`, `/stations`, `/telemetry`, `/firmware`, `/users`)
- **Overview Dashboard**: Metrik stasiun aktif, peringatan perangkat belum terdaftar (*unregistered devices*), data terakhir masuk, dan tren sensor terkini.
- **Manajemen Alat (`/stations`)**: Tabel stasiun terdaftar (`/api/devices`) dan dialog penambahan stasiun baru.
- **Perangkat Baru (`/stations/unregistered`)**: Deteksi otomatis stasiun baru berbasis MAC address untuk registrasi cepat.
- **Data Sensor Telemetri (`/telemetry`)**: Pemilihan stasiun, visualisasi tren multi-garis Recharts, dan tabel log riwayat pengukuran.
- **Firmware Engine (`/firmware`)**: Distribusi dan pengunggahan binari firmware stasiun over-the-air (OTA).
- **Manajemen Pengguna (`/users`)**: Khusus role Administrator untuk mengelola akun dan hak akses pengguna (*Role-Based Access Control*).

---

## 4. Technical Constraints & Tech Stack
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Shadcn UI + Lucide Icons
- **Visuals & Charts**: Three.js (`@react-three/fiber`), Recharts
- **State & Data Fetching**: TanStack Query v5 + Centralized `apiFetch`
- **Testing & Quality**: Vitest, React Testing Library, Oxlint
