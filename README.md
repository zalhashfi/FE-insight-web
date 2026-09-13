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

Copy `.env.example` to `.env.local` if you want to customize the backend proxy target during development (defaults to `http://localhost:3000`):

```bash
cp .env.example .env.local
```

Available variables in `.env.local`:
```bash
# Backend API proxy target during development
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
If you use a parent monorepo/workspace structure (`insight-workspace`):
```text
insight-workspace/
├── docker-compose.yml     # Orchestration (FE + BE + DB)
├── FE-insight-web/        # Frontend Client
└── BE-insight-api/        # Express.js Backend API
```
Run from the parent directory:
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

### 1. Automated Staging Deployment (GitHub Actions → Cloudflare Pages Preview)
Every `git push` to the `main` branch (or a manual `workflow_dispatch` run of `Deploy Staging`) will automatically:
1. Run the linter (`oxlint`), unit tests (`vitest`), and TypeScript build.
2. Deploy to the `staging` branch preview on Cloudflare Pages (`staging.fe-insight-web.pages.dev`, public) — including `functions/api/` so staging tests the same Functions runtime as production.

**GitHub Secrets required in the repository** (Settings → Secrets and variables → Actions, same as production):
- `CLOUDFLARE_API_TOKEN`: API token (Account / Cloudflare Pages / Edit).
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID.

If the secrets are not set, the `verify` job still runs and the deploy step is reported as `skipped` (green run).

### 2. Manual Staging Preview Deployment
```bash
npm run build
npx wrangler pages deploy dist --project-name=fe-insight-web --branch=staging
```

### Option B: VPS via Docker Compose (fallback)
The legacy path remains available as a fallback when Pages cannot be used (automatic SSH deploy has been replaced by section 1 above; run manually on the VPS):
```bash
docker compose -f docker-compose.staging.yml up -d --build
```
The app runs on port `8080` with an Nginx reverse proxy to the live `biru-langit.com` API.

### 3. Production Release via Tag (GitHub Actions → Cloudflare Pages)
Push a semver `vX.Y.Z` tag (the workflow only triggers on `v*.*.*`) to create a GitHub Release and deploy to production (Pages project `fe-insight-web`; custom domain `insight.biru-langit.com` once DNS resolves) — requires the `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets:
```bash
git tag v0.0.1 && git push origin v0.0.1
```
> Do not deploy a tag checkout manually without `--branch=main`: tags check out as detached HEAD and wrangler would infer branch `head` (this is how `v0.0.1` once landed on `head.fe-insight-web.pages.dev` instead of production). The workflow pins `--branch=main` for this reason.

### 4. Manual Cloudflare Pages / Static Hosting
Run from the repo root so wrangler uploads `functions/api/` alongside `dist/` (otherwise the `/api/` proxy is missing). Pin `--branch=main` for production — never deploy a tag checkout without it (see note under section 3):
```bash
npm run build
npx wrangler pages deploy dist --project-name=fe-insight-web --branch=main
```
### 5. Hostinger Shared Hosting (Production SPA)
1. Run the production build:
   ```bash
   npm run build
   ```
2. Upload the entire contents of the `dist/` folder to the `public_html` directory in cPanel/Hostinger File Manager.
3. Make sure the `.htaccess` file is at the `public_html` root for the React Router fallback:
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
