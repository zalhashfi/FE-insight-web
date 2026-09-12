# Insight Web Frontend

A modern, highly-interactive web frontend built with React, Vite, and TypeScript. This project features robust 3D visualizations, sleek UI components, and performant data fetching.

- **Dynamic Spatial Map** powered by Leaflet with ISPU color indexing (Baik/Sedang/Tidak Sehat)
- **Multi-Station Comparison Chart** comparing 3 Telkom University locations (TULT, GKU, Gedung Deli) with 2-minute interval resolution
- **Live Environmental Telemetry** integrating directly with live AQMS sensors via Biru Langit API
- **Dynamic Routing** with React Router 7
- **3D Renderings** powered by Three.js and React Three Fiber
- **Modern UI Components** using Shadcn, Lucide React, and Tailwind CSS v4
- **Optimized Data Fetching** with TanStack React Query
- **Staging & Production Ready** via Docker multi-stage Nginx and automated GitHub Actions CI/CD
## Tech Stack

- **Language**: TypeScript
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **State Management / Data Fetching**: TanStack Query
- **Routing**: React Router 7
- **Testing**: Vitest, React Testing Library
- **Linting**: Oxlint

## Prerequisites

- Node.js 20 or higher
- npm (or pnpm/yarn)

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

### 3. Environment Setup (Optional)

Salin file `.env.example` menjadi `.env.local` jika ingin menyesuaikan target proxy backend saat development (default mengarah ke `http://localhost:3000`):

```bash
cp .env.example .env.local
```

Variabel yang tersedia di `.env.local`:
```bash
# Target proxy backend API saat development
VITE_API_URL=http://localhost:3000
```
### 4. Start Development Server

#### Standard Mode (Local Node.js)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Docker Compose Mode (Standalone FE)
```bash
docker compose up --build
```

#### Full-Stack Workspace Mode (Parent Workspace)
Jika menggunakan struktur monorepo/workspace induk (`insight-workspace`):
```text
insight-workspace/
├── docker-compose.yml     # Orchestration (FE + BE + DB)
├── FE-insight-web/        # Frontend Client
└── BE-insight-api/        # Express.js Backend API
```
Jalankan dari direktori induk:
```bash
docker compose up -d
```

## Contributing Guidelines

Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for branch naming standards, commit policies, and PR review rules.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Compile TypeScript and build for production |
| `npm run lint` | Run Oxlint for fast code linting |
| `npm run preview` | Preview the production build locally |

## Testing

This project uses Vitest for unit and component testing.

```bash
# Run tests
npx vitest

# Run with UI
npx vitest --ui
```

## Deployment

### 1. Automated Staging Deployment (GitHub Actions + Docker)
Setiap `git push` ke branch `main` akan otomatis:
1. Menjalankan linter (`oxlint`), unit test (`vitest`), dan build TypeScript.
2. Men-deploy ke VPS staging via SSH menggunakan Docker Compose (build ulang image Nginx).

**Prasyarat di VPS staging:** Docker Engine + plugin `docker compose`, akses SSH (user dengan izin `docker`), dan direktori deploy `/opt/fe-insight-web` (dibuat otomatis oleh workflow).

**GitHub Secrets yang perlu dikonfigurasi di repository** (Settings → Secrets and variables → Actions):
- `STAGING_SSH_HOST`: IP atau domain VPS staging.
- `STAGING_SSH_USER`: Username SSH (misal `ubuntu` atau `root`).
- `STAGING_SSH_KEY`: Private SSH key (format OpenSSH). Public key-nya daftarkan di `~/.ssh/authorized_keys` VPS.
- `STAGING_SSH_PORT`: Port SSH (opsional, default `22`).

Setelah merge ke `main`, cek progres di tab **Actions**. Jika secrets belum diisi, job `verify` tetap berjalan dan hanya job `deploy` yang gagal.

### 2. Manual Server Deployment via Docker Compose
Jalankan langsung di server staging:
```bash
docker compose -f docker-compose.staging.yml up -d --build
```
Aplikasi akan berjalan pada port `8080` lengkap dengan Nginx reverse proxy ke API live `biru-langit.com`.

### 3. Production Release via Tag (GitHub Actions → Cloudflare Pages)
Push tag `vX.Y.Z` untuk membuat GitHub Release sekaligus deploy ke Pages project `fe-insight-web` (butuh secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`):
```bash
git tag v0.0.1 && git push origin v0.0.1
```
### 4. Manual Cloudflare Pages / Static Hosting
```bash
npm run build
npx wrangler pages deploy dist --project-name=fe-insight-web
```
### 5. Hostinger Shared Hosting (Production SPA)
1. Jalankan build produksi:
   ```bash
   npm run build
   ```
2. Upload seluruh isi folder `dist/` ke direktori `public_html` di cPanel/Hostinger File Manager.
3. Pastikan file `.htaccess` berada di root `public_html` untuk fallback React Router:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
## Architecture & Directory Structure

```
├── public/         # Static assets that bypass Vite compilation
├── src/            # Source code
│   ├── components/ # Reusable UI components
│   ├── hooks/      # Custom React hooks
│   ├── pages/      # Route-level components
│   ├── lib/        # Utilities (e.g., Shadcn utils)
│   ├── App.tsx     # Main application root component
│   └── main.tsx    # Application entry point
├── dist/           # Production build output
└── functions/      # Edge functions (if using Cloudflare Pages)
```
