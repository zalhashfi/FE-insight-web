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

Copy the example environment file if provided, or create a `.env.local` to define environment-specific variables like API endpoints.

```bash
touch .env.local
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

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

The app can be easily deployed to modern static hosting platforms like Cloudflare Pages (suggested by the presence of `.wrangler`), Vercel, or Netlify.

### Cloudflare Pages

```bash
# Assuming Wrangler CLI is installed
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
