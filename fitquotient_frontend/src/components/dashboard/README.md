Dashboard components and usage

This folder holds isolated components to compose the `/dashboard` route. They are intentionally small to make composition and testing easy.

Components:

- `Header.tsx` — contains job selector and primary actions (upload CV, connect ATS)
- `Navbar.tsx` — new global navbar shared across all pages (Overview, Jobs, CVs, Settings) — included in `layout.tsx`.
- `Sidebar.tsx` — contains filter inputs and saved filter shortcuts
- `CandidateList.tsx` — renders list of `CandidateCard` components
- `CandidateCard.tsx` — small summary card used in the candidate list
- `DetailDrawer.tsx` — right-side drawer implemented with the `Dialog` UI primitive to show candidate evidence and details
- `AnalyticsRow.tsx` — small metric row; replace it with charts later
- `mock-data.ts` — simplified candidate shape used for local development and UI work

Theme:

- Dashboard uses the same light theme as the landing pages — `bg-linear-to-br from-slate-50 to-slate-100 text-slate-900` — and the main panels use `bg-white` with `border-slate-200` cards so the visual language is consistent across login/register/landing.

How to run:

- Start dev server: `npm run dev`
- Visit `http://localhost:3000/dashboard`

Next steps:

- Add candidate compare modal component
- Wire network data with the API contract from `specs/dashboard.md`
- Add accessibility tests and focus-trap checks for the drawer
- Add `Jobs` page to create job descriptions (`/dashboard/jobs`) and `CVs` page to upload CVs (`/dashboard/cv`)
- Add `LLM settings` page at `/dashboard/settings/llm` to configure provider & API key
