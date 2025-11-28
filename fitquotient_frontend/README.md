This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Theme & Tailwind

This project defines brand colors and theme tokens in `tailwind.config.mjs` and `src/app/globals.css`.

- Primary brand colors are under the `primary` key (500/600/700) and are applied globally via the `theme-primary` class on `body` in `src/app/layout.tsx`.
- Neutral/slate values and accent cyan/sky values are set to match enterprise styling.

You can test the styles on the root page which demonstrates the primary color usage.

## Design system: shadcn UI

Minimal flow to build and run locally via docker-compose (use .env or pass ENV vars):

- This project is wired to use the shadcn UI components for consistent design.
- Prefer importing UI components from '@/components/ui' (the central export) so the whole app uses one canonical source for UI primitives.
- To add more shadcn components, run: `npx shadcn@latest add <component-name>` and re-export from `src/components/ui`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy with Docker

This project includes a Dockerfile for multi-stage builds and a `docker-compose.yml` file for local testing. There is also a `deploy.sh` script to build and push to a container registry and an optional GitHub Actions workflow `.github/workflows/docker-publish.yml` to automate builds and pushes.

See `DEPLOYMENT.md` for a quick guide with commands to build locally, use docker-compose, and push images to Docker Hub. If you use Kubernetes, manifests are available under `k8s/deployment.yaml`.

## Minimal deployment via Makefile and Docker Compose

This repo includes a Makefile with a few helpful Docker targets. The two minimal commands you asked for are:

```bash
make docker-build IMAGE=yourusername/fitquotient-ui TAG=v1.0.0
```

```bash
make docker-run IMAGE=yourusername/fitquotient-ui TAG=v1.0.0 ENV_VARS="URL_CORE=https://api.example.com URL_API_KEY=abc123"
```

Minimal flow to build and run locally via docker-compose:

````bash
# Build (compose build) — the build will pick up `URL_CORE` and `URL_API_KEY` from your `.env` or from the environment
OR
make docker-build ENV_VARS="URL_CORE=https://api.example.com URL_API_KEY=abc123"
 If you changed next.config.ts to switch from `NEXT_PUBLIC_URL_CORE` to `URL_CORE` (recommended), you'll need to do a clean build before running containers so the compiled bundles don't keep old references.

 Quick commands:

 ```bash
 # Remove local Next.js build artifacts
 make clean

 # Optional: create/update .env with URL_CORE and URL_API_KEY and run a local build
 URL_CORE=https://api.example.com URL_API_KEY=abc123 make build-local

 # Build the docker image and start service (compose uses build-time args and runtime envs)
 # It will use URL_CORE and URL_API_KEY from your .env or the environment
 make docker-rebuild ENV_VARS="URL_CORE=https://api.example.com URL_API_KEY=abc123"
 make docker-up
````

Notes:

- The `Dockerfile`, `docker-compose.yml`, and Makefile are wired to pass `URL_CORE` as a build arg and runtime env var — do not use NEXT_PUBLIC_URL_CORE or expose secrets unnecessarily.
- `URL_CORE`: server/runtime variable (and also exported at build-time via next.config.ts so the client can read it) — still considered less-sensitive than API keys, but avoid exposing secrets to the browser.

# Start

make docker-up

# Stop

make docker-down

Container name, image & healthcheck notes:

- The Compose setup sets `container_name` and a default image name `fitquotient-ui` for easier tooling and shorthand. If you'd prefer using the Compose default project naming, remove the `container_name` line from `docker-compose.yml`.
- The Dockerfile and docker-compose healthchecks now target the dedicated frontend API route `/api/health` (and the frontend endpoint will optionally probe the configured backend `URL_CORE` at `/health`). This provides a lightweight, unauthenticated health check suitable for orchestration platforms.

````

Notes:

```bash
make docker-compose-down
````

## Push to GHCR (optional)

To build and push the frontend image to GitHub Container Registry (GHCR), use the `push-ghcr-ui.sh` script included in the repo. Ensure you have a PAT or `CR_PAT` set with write:packages scope.

```bash
# (optional) give execution permission
chmod +x ./push-ghcr-ui.sh

# push tag 'latest' (or pass a tag)
./push-ghcr-ui.sh latest
```
