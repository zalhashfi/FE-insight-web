# AGENTS.md — zalhashfi/FE-insight-web

Frontend client web dashboard untuk IoT insight (AQMS & SOC) berbasis React 19, Vite, Tailwind CSS, TanStack Query, dan Vitest.

## Workflow & Development Guidelines

1. **Tech Stack & Tooling:**
   - React 19 + TypeScript + Vite + Tailwind CSS v4.
   - UI Components: Shadcn UI, Base UI, Lucide Icons, Recharts, Three.js (`@react-three/fiber`).
   - Testing & Linting: Oxlint (`npm run lint`), Vitest (`npm test`), TypeScript Build (`npm run build`).

2. **Commit Policy & Attribution:**
   - Author: `zalhashfi <211019493+zalhashfi@users.noreply.github.com>`.
   - **STRICT**: Dilarang menyertakan trailer `Co-authored-by` atau atribusi bot apa pun.

3. **Branching & Pull Requests:**
   - Feature branches menggunakan format `issue-<number>`.
   - Setiap PR harus menyertakan status checks `build-and-test` yang lulus.

## Agent skills

### Issue tracker
GitHub Issues using `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels
Standard canonical triage roles (`needs-triage`, `ready-for-agent`, etc.). See `docs/agents/triage-labels.md`.

### Domain docs
Single-context repository layout (`CONTEXT.md` + `docs/adr/`). See `docs/agents/domain.md`.
