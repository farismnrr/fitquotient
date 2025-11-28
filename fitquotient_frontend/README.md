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

## Deployment
 
This project is part of the FitQuotient monorepo. The recommended way to deploy or run this application is using the root-level configuration.
 
### Quick Start (Root)
 
Please refer to the [Main README](../../README.md) for installation instructions.
 
```bash
# From project root
./install.sh
```
 
### Manual Development
 
If you want to run the frontend independently for development:
 
```bash
# Install dependencies
npm install
 
# Run development server
npm run dev
```
 
Ensure the Core API is running on port 5400 and CV Assessor on port 5500 (or update `.env.local` accordingly).
