# Insight Web Frontend

A modern, highly-interactive web frontend built with React, Vite, and TypeScript. This project features robust 3D visualizations, sleek UI components, and performant data fetching.

## Key Features

- **Dynamic Routing** with React Router 7
- **3D Renderings** powered by Three.js and React Three Fiber
- **Modern UI Components** using Shadcn, Lucide React, and Tailwind CSS v4
- **Optimized Data Fetching** with TanStack React Query
- **Lightning-fast Dev Environment** with Vite

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

### 3. Environment Setup

Copy example file or create a `.env.local` to define environment-specific variables like backend API endpoints:

```bash
# Optional API override (default proxy routes to http://localhost:3000)
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

### Hostinger Shared Hosting (Production SPA)
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

### Cloudflare Pages / Static Hosting

```bash
npm run build
npx wrangler pages deploy dist
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
