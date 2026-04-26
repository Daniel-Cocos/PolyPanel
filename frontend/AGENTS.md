# PolyPanel Frontend

## Guidelines

- Update this file when you find / change anything that would conflict with the knowledge in this file (`./AGENTS.md`)
- Try to keep files to under 200 lines of code, if file exceeds 200 lines separate it into modules where it makes sense
- Prefer small, focused React components and keep page composition in `src/pages`
- Reuse the shared MUI theme in `src/theme.ts` instead of introducing one-off visual tokens
- Preserve reduced-motion behavior when changing animation code; the app already gates GSAP and Framer Motion effects with `useReducedMotion`
- Keep the site compatible with GitHub Pages deployment under the `/GreenTech/` base path

## Tech stack and frameworks

- React 19 + TypeScript 6
- Vite 8 with `@vitejs/plugin-react`
- React Router 7 for client-side routing
- MUI 9 with Emotion for UI primitives and theming
- GSAP + ScrollTrigger for hero and scroll-triggered motion
- Framer Motion for lightweight reveal animations and reduced-motion integration
- ESLint 10 + `typescript-eslint` + `eslint-plugin-react-hooks`
- GitHub Pages deployment via `gh-pages`

## Repository layout and structure

- `src/` application source
- `src/main.tsx` React entry point; wires `ThemeProvider`, `CssBaseline`, and `BrowserRouter`
- `src/App.tsx` route entry for landing and dashboard paths
- `src/pages/` top-level page composition modules
- `src/components/LandingPage/` landing-page sections, shared reveal helper, and GSAP hook
- `src/components/SolarPannel/` dashboard map planner and simulation modules
- `src/components/SolarPannel/dashboard/` year-long weather-driven simulation domain, inline cell editor/sidebar UI, registry service boundary, and report helpers
- `src/lib/` shared library setup; currently GSAP plugin registration
- `src/assets/` static images bundled by Vite
- `public/` static public assets
- `index.html` Vite HTML shell
- `package.json` npm scripts and frontend dependency manifest
- `vite.config.ts`, `tsconfig*.json`, `eslint.config.js` build, typing, and lint configuration
- `README.md` frontend-specific project direction and local development notes
- `.agents/skills/` repo-local skills for frontend design, Framer Motion, GSAP, and UI review workflows
- `skills-lock.json` installed skill manifest
- `dist/` production build output

## Build / Lint / Test commands

- `npm run dev` starts the Vite dev server
- `npm run build` runs TypeScript project builds, creates the Vite production bundle, and copies `dist/index.html` to `dist/404.html`
- `npm run lint` runs ESLint across the repo
- `npm run preview` serves the production build locally
- `npm run deploy` builds and publishes `dist/` to GitHub Pages
- No automated test command is currently configured in `package.json`

## Design language

- Modern, minimal, corporate landing-page aesthetic focused on UK agritech and energy credibility
- Brand palette is defined in `src/theme.ts`: deep blue primary (`#14506d`), green secondary (`#49c889`), soft off-white/green backgrounds, and muted slate text
- Typography pairs Space Grotesk for headings with Source Sans 3 for body copy
- MUI theme tokens enforce sharp `3px` radii, bold buttons, restrained chips, and clean paper surfaces
- Layout favors strong section separation, fullscreen imagery, glassmorphism-style navigation, and concise conversion-focused content blocks
- Motion uses a hybrid approach: subtle Framer Motion reveals plus richer GSAP hero/scroll choreography, while respecting reduced-motion preferences

## Documentation links

- Looks for skills `./.agents/skills` that match your task before making any decisions
- You can use webfetch to access the following documentations to look for implementation details
  - React: https://react.dev/
  - TypeScript: https://www.typescriptlang.org/docs/
  - Vite: https://vite.dev/guide/
  - React Router: https://reactrouter.com/home
  - MUI: https://mui.com/material-ui/getting-started/
  - Framer Motion: https://motion.dev/docs/react
  - GSAP: https://gsap.com/docs/v3/
  - ESLint: https://eslint.org/docs/latest/
  - GitHub Pages: https://docs.github.com/en/pages

## Pre hand-off instructions

- Always verify lint, build, and test commands show no errors before handing changes off to a user
