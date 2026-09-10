# Architecture Decision Record (ADR) — Frontend Architecture

## ADR 001: Centralized API Client & Token Management
- **Status**: Accepted & Implemented
- **Context**: Aplikasi frontend membutuhkan penanganan token JWT yang konsisten di semua permintaan HTTP ke backend Express.js.
- **Decision**: Menggunakan wrapper terpusat `apiFetch` (`src/lib/api.ts`) yang otomatis menyisipkan header `Authorization: Bearer <token>` dan fallback penyimpanan sesi di `sessionStorage`.

## ADR 002: Multi-Theme Support (Light / Dark / System)
- **Status**: Accepted & Implemented
- **Context**: Kebutuhan antarmuka modern yang nyaman bagi operator lapangan di siang hari (Light) maupun monitoring malam hari (Dark).
- **Decision**: Menggunakan `ThemeProvider` kustom berbasis Tailwind CSS v4 class strategy (`.dark`) dengan persistensi `localStorage`.

## ADR 003: Modular Landing Page Component Breakdown
- **Status**: Accepted & Implemented
- **Context**: Landing page membutuhkan orkestrasi konten yang komprehensif (Hero 3D, Studi Kasus PENGMAS, Telemetri Live Preview, Footer) tanpa membebani satu file besar.
- **Decision**: Memecah landing page ke dalam modul-modul independen di `src/components/landing/` dengan integrasi *smooth scrolling* di tingkat browser.
