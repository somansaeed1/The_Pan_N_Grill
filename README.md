# The Pan N Grill

Monorepo with a Next.js `frontend/` and an Express `backend/`.

## Develop

```bash
npm run install:all
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:4000/api/health
```

## Vercel

The existing project deploys from the repo root; the root `vercel.json` points install, build and output at `frontend/`, so no dashboard change is needed.
The backend deploys as its own Vercel project with Root Directory set to `backend`.

Environment variables: see `frontend/env.example` and `backend/.env.example`.
