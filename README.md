# Frontend Starter

A production-oriented React starter for applications that need server rendering, explicit architectural boundaries, and a small but serious delivery pipeline.

It uses React Router Framework Mode for SSR instead of a hand-written server. The example domain shows how pages, features, entities, repositories, stores, DI, persistence, and UI fit together; remove it with one command when starting a real product.

## Stack

- React 19 and TypeScript
- React Router Framework Mode with SSR
- Vite
- Reatom stable
- Mantine UI
- Needle DI with one container per rendered application
- Vitest and Playwright
- ESLint, lint-staged, Husky, and GitHub Actions

## Quick start

Requirements: Node.js 24 and npm 11.

```bash
npm ci
npm run dev
```

The development server is available at `http://localhost:5173` with SSR, HMR, and route type generation.

To turn the repository into a clean application, remove the demonstration domain and rename the package:

```bash
npm run template:reset -- --name my-product
```

The reset is intentionally one-way. Run it on a fresh branch or immediately after creating a repository from this template.

## Architecture

```text
src/
├── app/          application providers, DI composition, and root layout
├── pages/        React Router route modules and page composition
├── widgets/      reusable page-level UI blocks
├── features/     user-facing use cases
├── entities/     domain models, services, repositories, stores, and entity UI
└── shared/       framework-independent infrastructure and utilities
```

Higher layers may depend on lower layers, never the reverse. ESLint enforces the important boundaries:

- `shared` cannot import application or domain layers;
- `entities` can depend only on `entities` and `shared`;
- `features` cannot depend on `app`, `pages`, or `widgets`;
- `widgets` cannot depend on `app` or `pages`.

Types stay next to the code they describe. Create a separate `types.ts` only when it improves a module, not to satisfy a repository-wide ritual.

### Routing and SSR

[`src/routes.ts`](src/routes.ts) uses React Router's official file-route convention to discover route modules under `src/pages` during development, type generation, and builds. There is no browser-side directory scan or route registry to maintain:

```text
src/pages/
├── _index/route.tsx                 /
├── about/route.tsx                  /about
└── products.$productId/route.tsx    /products/:productId
```

Keep route-local components and tests next to `route.tsx`; only the route module is discovered. The `@/` alias keeps cross-layer imports stable, while relative imports remain local to a route folder.

React Router owns the development server, client/server builds, HTTP responses, hydration, route errors, and production serving. [`src/root.tsx`](src/root.tsx) owns only the document shell and application providers. This keeps transport concerns out of the domain layers and avoids maintaining a second, partial web framework in the repository.

### Metadata and response security

React 19 hoists native `<title>`, `<meta>`, and `<link>` elements into the document head during SSR, so route modules can own their metadata without another head manager. The example includes description and social metadata; add canonical URLs, robots rules, and share images only when the deployment origin and assets are real.

The root route sends safe, origin-independent browser headers. Content Security Policy, HSTS, cross-origin isolation, and feature policies belong in deployment configuration once the product's domains, embeds, OAuth flows, and third-party scripts are known.

### Dependency injection

[`src/app/container/container.ts`](src/app/container/container.ts) discovers `*.provider.ts` modules and builds a fresh container for each server render. The hydrated browser application keeps its container for the lifetime of the app. Tests can replace bindings through a child container.

### State

The example uses the stable Reatom packages. Stores stay in the owning entity and expose state and operations to features; React components subscribe through `reatomComponent`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the React Router SSR development server |
| `npm run typecheck` | Generate route types and run TypeScript |
| `npm run build` | Type-check and create production client/server builds |
| `npm start` | Serve the production build |
| `npm test` | Run Vitest in watch mode |
| `npm run test:unit` | Run unit and integration tests once |
| `npm run test:e2e` | Build and run Playwright SSR/hydration tests |
| `npm run lint` | Run cached, type-aware ESLint with zero warnings |
| `npm run lint:fix` | Apply safe ESLint fixes |
| `npm run check` | Run the local CI quality gate |
| `npm run template:reset -- --name <name>` | Remove the example domain and rename the app |

## Quality gates

- Vitest collects only `src/**/*.test.{ts,tsx}`.
- Playwright verifies usable server-rendered HTML with JavaScript disabled and clean client hydration.
- Pre-commit checks operate only on staged files; the full gate runs in CI.
- GitHub Actions runs lint, unit tests, type checking, the production build, and Chromium E2E tests.
- Dependabot proposes weekly npm and GitHub Actions updates.

Run the complete local gate before opening a pull request:

```bash
npm run check
npm run test:e2e
```

## Production

```bash
npm run build
PORT=3000 npm start
```

Deploy `build/`, `package.json`, `package-lock.json`, and production dependencies to any Node.js host. Use a platform-specific React Router adapter only when the target platform requires one.

## Deliberate omissions

There is no auth framework, API client policy, mock server, analytics SDK, or environment schema in the base template. Add those after the product has a real contract for them; speculative infrastructure makes starters harder to remove and easier to misuse.

- A service worker needs an explicit offline/update/cache policy and tests; a generic cache can serve stale SSR or authenticated responses.
- Partytown only helps after real third-party scripts measurably block the main thread.
- Unhead duplicates React 19 and React Router metadata handling.
- Helmet is Express middleware; this template uses React Router response headers and has no custom Express server.
