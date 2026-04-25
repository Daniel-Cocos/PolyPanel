# GreenTech Frontend

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
- Lead with a fullscreen image-driven hero section that immediately positions the company as a credible partner for growers, developers, and planning stakeholders.
- Use a hybrid motion stack: Framer Motion for lightweight content reveals and GSAP for premium hero and section choreography.
- Keep the homepage concise and conversion-focused with a clear pricing section for energy developers.
- Use a simple `mailto:` contact action for now so the site can launch before a full contact workflow exists.

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

The current landing page scope includes React Router setup, a dedicated `src/pages/LandingPage.tsx` page, section components under `src/components/LandingPage/`, a fullscreen hero, a 3-tier pricing section, MUI-driven layouts, Google-font typography, lightweight Framer Motion reveals, and GSAP-powered hero and scroll-driven section polish.

This frontend is configured for GitHub Pages project-site deployment under `/GreenTech/`. Run `npm run deploy` from `frontend/` to publish the built `dist/` output to the repository `gh-pages` branch. The build also writes `dist/404.html` from `dist/index.html` so direct navigation to client-side routes keeps working on GitHub Pages.
