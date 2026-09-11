# Design Specification (DESIGN.md) — FE-insight-web

## 1. Design Philosophy & Guidelines
- **Core Aesthetic**: *Modern Clean Technical & Environmental Intelligence*.
- **Design Standards**: Mengikuti prinsip **UI/UX Pro Max** dan **Unslop**:
  - Bahasa lugas, faktual, tanpa hiperbola dan puffery.
  - Kontras tajam dan terbaca jelas (rasio kontras minimum 4.5:1 untuk teks).
  - Konsistensi visual di seluruh mode terang (*Light*) dan gelap (*Dark*).
  - Navigasi halus (*smooth scrolling*) tanpa *layout shift* yang mengganggu.

---

## 2. Color Palette & Theming (Light & Dark Mode)

### Base Tokens
- **Brand Primary**: Biru Langit Blue `#0079FE` / `oklch(0.58 0.21 245)` (Light) & `oklch(0.72 0.17 240)` (Dark)
- **Primary Foreground**: Pure Crisp White `oklch(0.99 0 0)` (Light) & Deep Navy `oklch(0.12 0.02 240)` (Dark)
- **Background**:
  - *Light*: `oklch(0.995 0.004 230)` / Fresh Crisp Sky Tint White
  - *Dark*: `oklch(0.14 0.015 240)` / Deep Technical Navy
- **Card Surface**:
  - *Light*: `oklch(1 0 0)` with `border-border/60` and `backdrop-blur`
  - *Dark*: `oklch(0.18 0.02 240)` with subtle glass overlay
- **Ring / Focus**: `oklch(0.58 0.21 245)` (Light) & `oklch(0.72 0.17 240)` (Dark)
### Semantic Colors
- **Success / Good Quality**: Emerald `#10b981` (misal: PM2.5 < 50 µg/m³, status normal)
- **Warning / Moderate**: Amber `#f59e0b` (misal: PM2.5 51-100 µg/m³, peringatan dini)
- **Destructive / Poor**: Red `#ef4444` (misal: PM2.5 > 100 µg/m³, notifikasi EWS)
- **Data Series Palette**:
  - `PM2.5`: Biru Langit / Cyan
  - `Suhu`: Amber / Red
  - `Kelembapan`: Cyan / Indigo
  - `CO`: Purple / Emerald

---

## 3. Typography Hierarchy
- **Font Family**: `Geist Variable`, sans-serif (Inter fallback).
- **Headings**:
  - Hero H1: `text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight`
  - Section H2: `text-3xl sm:text-4xl font-bold tracking-tight`
  - Card Title: `text-xl font-bold`
- **Body & Captions**:
  - Lead: `text-lg sm:text-xl text-muted-foreground font-normal`
  - Body: `text-sm sm:text-base leading-relaxed`
  - Micro / Meta: `text-xs font-mono text-muted-foreground`

---

## 4. Layout & Component Architecture

### Landing Page Layout
1. **Sticky Glassmorphism Header (`Navbar.tsx`)**:
   - Logo `BIRULANGIT.svg` (kiri).
   - Menu anchor links dengan smooth scroll (tengah).
   - Theme Toggle & CTA Dashboard (kanan).
2. **Hero Section (`HeroSection.tsx`)**:
   - Canvas 3D Three.js di background (`pointer-events-none`).
   - Pill badge identitas institusi.
   - Dual CTA button dengan micro-interactions (*hover:scale-105 active:scale-95*).
3. **Showcase Mitra (`PartnerSection.tsx`)**:
   - Logo marquee / bar institusi mitra resmi dengan kontras tinggi.
4. **Studi Kasus Lapangan (`ProjectShowcase.tsx`)**:
   - Layout kartu 12-kolom (Showcase studi kasus SMP Telkom 7-kolom, Sidebar arsitektur 5-kolom).
5. **Live Telemetry Preview (`LiveTelemetryPreview.tsx`)**:
   - Metric summary cards (PM2.5, Suhu, Kelembapan, CO).
   - Interactive Recharts LineChart dengan tooltip dan legend terstandar.
6. **Footer (`Footer.tsx`)**:
   - Grid 4-kolom (Profil Biru Langit, Sistem & Solusi, Akses Dashboard, Copyright).

---

## 5. Accessibility & Interaction Rules
- **Interactive Elements**: Wajib memiliki kelas `cursor-pointer`, focus rings yang terlihat, dan transisi 150-300ms.
- **Form Controls**: Wajib memiliki label yang terikat secara semantik.
- **Icons**: Menggunakan set ikon vektor standar `lucide-react`, tanpa emoji dekoratif sebagai pengganti ikon UI.
