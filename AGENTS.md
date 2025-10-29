# Repository Guidelines

This guide summarizes the core conventions for the Vite + React + TypeScript workspace.

## Project Structure & Module Organization
Entry code lives in `src/main.tsx`, with routing in `src/App.tsx`. UI modules sit under `src/components/zexalva/`, route-level screens in `src/pages/`, shared state in `src/context/`, and utilities or mocks in `src/services/` and `src/data/`. Built assets land in `dist/`, and CLI helpers belong in `scripts/`. Use the `zexalva-chatbot/` package for the chatbot sandbox so the web storefront remains focused.

## Build, Test, and Development Commands
- `npm install` aligns local dependencies.
- `npm run dev` starts the Vite dev server on `localhost:5173`.
- `npm run build` compiles the production bundle to `dist/`.
- `npm run preview` serves the build for a final pass.
- `npm run lint` runs ESLint with the project config.
- `npm run typecheck` executes `tsc` in no-emit mode.
- `npm run list:models` queries Google Generative AI models using `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY` from `.env.local`.

## Coding Style & Naming Conventions
ESLint and TypeScript configs enforce modern browser targets, 2-space indentation, single quotes, and hook rules. Prefer functional React components: name components with `PascalCase`, hooks with a `use` prefix, utilities in `camelCase`, and shared constants in `SCREAMING_SNAKE_CASE`. Compose styling with Tailwind utilities inside JSX; extract repeated patterns into small dedicated components.

## Testing Guidelines
Automated tests are not configured yet. Until they are, gate releases with `npm run lint`, `npm run typecheck`, and a full manual pass through cart, checkout, and chatbot flows. When you introduce tests, colocate `*.test.tsx` files with the code under test or in `src/__tests__/`, and rely on Vitest + React Testing Library so the setup matches Vite.

## Commit & Pull Request Guidelines
Write commit subjects in the imperative (e.g., `Add hero animation`), keep them under 72 characters, and bundle related work together. PR descriptions should outline the change, list verification steps, and link issues. Include screenshots or short clips for UI adjustments and mention new env vars or config changes so reviewers can mirror the setup.

## Security & Configuration Tips
Store API credentials in `.env.local` and never commit them. Double-check edits to `tailwind.config.js`, `tsconfig*.json`, or `scripts/listModels.mjs`, because they affect build output and API access across both the storefront and chatbot packages.
