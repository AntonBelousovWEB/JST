---
name: frontend-architecture
description: Implement or review product code in this React starter while preserving its FSD-inspired layers, DI boundaries, Reatom view models, and low-coupling module design.
---

# Frontend architecture

Follow existing code before inventing a new pattern. Keep the smallest complete vertical slice.

## Ownership

- `pages` compose routes, metadata, widgets, features, and dependencies. Keep `route.tsx` thin.
- `features` own one user workflow and depend on entity contracts/UI, never on `app` or `pages`.
- `entities` own domain types, models/mappers, repository ports/adapters, services, view-model stores, and entity UI.
- `shared` contains product-agnostic infrastructure only. Promote code here after a second real consumer.
- DTOs describe transport data only; never expose them to UI. `shared/api` owns generic HTTP mechanics. Entity API repositories own endpoints and typed request contracts. Services map/orchestrate domain data. Reatom stores are view models: loading, error, derived state, and user actions. Add runtime schema validation at the repository boundary when the real API is not trusted.

## DI boundary

Directly import stable lower-layer code: types, pure models, mappers, and components. Use DI for effectful or replaceable boundaries such as HTTP, storage, clocks, analytics, and request-scoped services, or when tests must substitute an implementation. Do not inject plain data or add an interface with one non-effectful implementation.

Passing an upper-layer dependency into a lower layer still creates upward coupling. Instead, define the port/token beside the consumer and bind its adapter in a discovered `*.provider.ts` composition module. A feature that needs page-owned state receives a narrow dependency object through its feature injector; it must not import `app`.

Strict FSD cross-slice isolation is optional when it adds indirection without reducing coupling. A direct same-layer import is acceptable while ownership is clear, there is no cycle, and the code has one consumer. Extract a feature/shared contract when reuse, independent change, or test substitution becomes real.

## Delivery check

Keep transport failure and empty/loading states explicit. Test domain mapping with a substituted repository and test the user flow with role-based Playwright locators. Run `npm run check`; add abstractions only when the current slice proves they are needed.
