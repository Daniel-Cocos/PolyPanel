# PolyPanel Frontend

Frontend for a dual land-use company focused on stacked solar in the UK. The immediate goal is a clear landing page that explains how solar mounted above polytunnels can unlock more resilient farming, new generation capacity, and a planning story that works better for communities, councils, and network-constrained energy developers.

## Project Direction

This first version is intentionally focused on message clarity rather than product depth, but it now presents that story through a more polished business-marketing format.

- Position the company as a practical bridge between agriculture and energy infrastructure.
- Explain the core concept simply: protect crops below, generate power above, and use land more intelligently.
- Speak directly to UK conditions, including planning permissions, community acceptance, council scrutiny, and limited land availability for large energy projects.
- Highlight two main audiences from the start: farmers and energy companies.
- Keep the design modern, minimal, and corporate with clear section separation, strong typography, and restrained visual cues inspired by greenhouses, field structures, and grid infrastructure.
- Build the interface with MUI components and theme tokens so sections stay consistent and easier to maintain.
- Use Google Fonts for a stronger typographic voice (Space Grotesk for headings and Source Sans 3 for body copy).
- Lead with a fullscreen image-driven hero section that immediately positions the company as a credible partner for growers, developers, and planning stakeholders, including a refined responsive glass nav with balanced desktop and mobile spacing and a clean wordmark-style brand label.
- Use a hybrid motion stack: Framer Motion for lightweight content reveals and GSAP for premium hero and section choreography.
- Keep the homepage concise and conversion-focused with a clear pricing section that prioritises short plan summaries and optional deeper comparison details.
- Use a simple `mailto:` contact action for now so the site can launch before a full contact workflow exists.
- Include a dedicated `Dashboard` CTA in the hero nav that routes to a separate `/dashboard` page for future internal workflow features, including an interactive solar layout planner.

## Local Development

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run build
npm run lint
npm run preview
npm run deploy
```

The current scope includes React Router setup, a dedicated `src/pages/LandingPage.tsx` page, a new `src/pages/DashboardPage.tsx` route, section components under `src/components/LandingPage/`, a dashboard solar planner under `src/components/SolarPannel/`, a fullscreen hero with a dashboard CTA, a simplified 3-tier pricing section with optional comparison details, a market-problem section, a founder-led why-us section, MUI-driven layouts, Google-font typography, lightweight Framer Motion reveals, and GSAP-powered hero and scroll-driven section polish.

The solar planner now runs as a full-page split workspace with a compact left map sidebar and a right simulation sidebar. The dashboard surfaces and controls use the same dark blue-green visual language used across index-page content sections. The map uses a farm-wide selectable grid with larger planning cells and stronger content highlighting for `real` and `proposed` panels, and selecting a cell now drives inline configuration in the left panel instead of opening a modal. Empty cells show `No panel linked` with direct proposed/real add actions (real panel uses inline ID input through a modular registry service boundary), while linked cells show mode controls (`flat_down`, `sun_tracking`, `letting_sun_in`), panel metrics, and a trash remove action. The planner sidebar and map workspace now use MUI components with `sx` styling instead of bespoke class-based CSS.

The dashboard simulation is now centered on a backend-powered 12 month weather timeline from `GET /api/weather/timeline`, using real Open-Meteo archive data and the currently selected grid-cell coordinates when available. The simulation timeline is horizontally scrollable by month, proposed panel behavior is derived from real monthly weather inputs including rainfall and solar radiation, the energy chart tracks yearly monthly output instead of a mocked 24 hour curve, notifications still support quick actions, and the report button exports the current simulation as both JSON and CSV.

This frontend is configured for GitHub Pages project-site deployment under `/GreenTech/`, while container builds can override the base path to `/` with `VITE_PUBLIC_BASE=/`. Run `npm run deploy` from `frontend/` to publish the built `dist/` output to the repository `gh-pages` branch. The Vite dev server proxies `/api` requests to `http://localhost:8080` by default, can be redirected with `VITE_API_PROXY_TARGET`, and the Docker image serves the built app through Nginx with `/api` proxied to the backend service. The build also writes `dist/404.html` from `dist/index.html` so direct navigation to client-side routes keeps working on GitHub Pages.
