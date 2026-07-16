# Horavia Professionalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing Bookly PR into Horavia, a coherent and demonstrable scheduling product with a tested credential-free demo, distinct identity, production metadata, and current documentation.

**Architecture:** Preserve the authenticated Next.js, Supabase, and Stripe application while modularizing only the public demo. Centralize product metadata in `src/lib/site.ts`, keep fictional state logic pure and tested in `src/lib/demo-data.ts`, and split the interactive demo by navigation, overview, sections, and shared UI.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Supabase, Stripe test mode, Zod, Vitest, Playwright/browser QA.

## Global Constraints

- Product name is `Horavia` and slogan is `Do primeiro horário ao último atendimento.`
- Public and active authenticated interface copy is Brazilian Portuguese.
- Demo business is the fictional hair and beauty studio `Estúdio Aurora`.
- No architecture replacement, repository rename, merge, archive, or visibility change.
- No testimonials, external customer claims, ratings, or invented business-growth metrics.
- Public demo stays independent from Supabase and Stripe and stores only fictional data in the current browser.

---

### Task 1: Establish tested demo-state behavior and remove unused dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/lib/demo-data.ts`
- Create: `src/lib/demo-data.test.ts`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `createDemoState(): DemoState`, `createEmptyDemoState(): DemoState`, `parseDemoState(serialized: string): DemoState`, `completeNextAppointment(state: DemoState): DemoState`, and `getDemoMetrics(state: DemoState): DemoMetrics`.
- The demo dashboard consumes these pure functions without directly casting parsed JSON.

- [ ] **Step 1: Add the test runner and failing behavioral tests**

Add `"test": "vitest run"` and Vitest as a development dependency. Create tests asserting that the Estúdio Aurora dataset uses only coherent services, parses valid state, rejects malformed state, derives scheduled/completed/revenue metrics, returns independent empty arrays, and completes only the first scheduled appointment.

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test`

Expected: FAIL because `createEmptyDemoState`, `parseDemoState`, `completeNextAppointment`, and `getDemoMetrics` are not exported yet.

- [ ] **Step 3: Implement the minimal pure state API**

Use a Zod schema for persisted state. Return a fresh state from `createDemoState`, throw `Error("Os dados salvos da demonstração são inválidos.")` when parsing fails, derive metrics in one iteration, and immutably update only the first scheduled appointment.

- [ ] **Step 4: Verify GREEN and dependency cleanup**

Run `npm test`, then remove unused direct dependencies `@hookform/resolvers`, `@stripe/stripe-js`, `date-fns`, and `react-hook-form`. Verify with `npm run typecheck`, `npm run lint`, and `npm run build`.

- [ ] **Step 5: Add tests to CI and commit**

Insert `npm test` between typecheck and build in `.github/workflows/ci.yml` and commit as `test: cover Horavia demo state`.

### Task 2: Centralize Horavia identity and translate active product surfaces

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/components/brand-mark.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/demo/page.tsx`
- Modify: `src/components/demo-button.tsx`
- Modify: `src/components/sidebar.tsx`
- Modify: `src/components/nav-links.tsx`
- Modify: `src/app/(auth)/**/*.tsx`
- Modify: `src/app/dashboard/**/*.tsx`
- Modify: `.env.example`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `SITE_NAME`, `SITE_SLOGAN`, `SITE_DESCRIPTION`, `SITE_URL`, and `BrandMark`.
- Metadata, sitemap, robots, landing, demo, authentication, and dashboard consume the centralized identity.

- [ ] **Step 1: Add centralized site constants and mark**

Normalize `NEXT_PUBLIC_APP_URL` by removing a trailing slash and fall back to `http://localhost:3000`. Render a compact teal brand square with an accessible hidden label and typographic `Horavia` wordmark.

- [ ] **Step 2: Replace product identity and active copy**

Change package name to `horavia`, set `<html lang="pt-BR">`, replace every exposed Bookly reference with Horavia, translate active navigation and form copy, and keep database enum values unchanged while presenting Portuguese labels.

- [ ] **Step 3: Verify historical-name removal**

Run: `rg -n "Bookly|bookly|AgendaPro|agendapro" --glob '!docs/superpowers/**' --glob '!package-lock.json' .`

Expected: no matches outside the historical design and implementation documents.

- [ ] **Step 4: Commit identity and content**

Run tests, typecheck, lint, and build. Commit as `feat: establish Horavia identity and content`.

### Task 3: Modularize and harden the public demo

**Files:**
- Delete: `src/components/demo-dashboard.tsx`
- Create: `src/components/demo/demo-dashboard.tsx`
- Create: `src/components/demo/demo-navigation.tsx`
- Create: `src/components/demo/demo-overview.tsx`
- Create: `src/components/demo/demo-sections.tsx`
- Create: `src/components/demo/demo-ui.tsx`
- Modify: `src/app/demo/page.tsx`

**Interfaces:**
- `DemoDashboard` owns `DemoView`, browser storage subscription, clear confirmation, reset, and completion.
- Presentational children receive typed state and callbacks and never read local storage.

- [ ] **Step 1: Route state transitions through tested helpers**

Replace direct JSON casting, empty-object literals, and appointment mapping with `parseDemoState`, `createEmptyDemoState`, and `completeNextAppointment`.

- [ ] **Step 2: Add recoverable and destructive states**

Show a Portuguese recovery alert for invalid storage. Require a visible confirmation panel before clearing local records and return focus to the clear control after canceling.

- [ ] **Step 3: Split presentation by responsibility**

Move navigation, overview, entity lists, appointment rows, metric cards, and empty-state UI into the planned files. Preserve the existing local demo behavior and mobile navigation.

- [ ] **Step 4: Verify and commit**

Run `npm test`, typecheck, lint, and build. Commit as `refactor: simplify Horavia interactive demo`.

### Task 4: Apply distinct visual system, accessibility, and metadata

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`
- Modify: `src/components/demo/*.tsx`
- Create: `src/app/icon.tsx`
- Create: `src/app/opengraph-image.tsx`
- Create: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- All metadata routes consume `SITE_URL` and centralized identity.
- Semantic status tokens remain separate from brand tokens.

- [ ] **Step 1: Apply Horavia tokens**

Use deep teal `hsl(174 62% 24%)` as primary, coral `hsl(18 88% 56%)` as restrained accent, warm white backgrounds, neutral cards, accessible focus rings, and conventional green/amber/red statuses.

- [ ] **Step 2: Improve first-fold clarity and mobile operation**

Lead with scheduling value and the interactive demo, show today's Estúdio Aurora agenda without fabricated commercial metrics, keep desktop scanning compact, and keep mobile controls reachable without horizontal overflow.

- [ ] **Step 3: Add production presentation**

Generate a simple icon and 1200×630 Open Graph image, add canonical/Open Graph/Twitter metadata, and generate consistent robots and sitemap routes from `SITE_URL`.

- [ ] **Step 4: Verify and commit visual refinement**

Run automated checks and inspect 1440×900 and 390×844. Commit as `style: refine Horavia product experience`.

### Task 5: Documentation, screenshots, and repository audit

**Files:**
- Modify: `README.md`
- Delete: `docs/screenshots/bookly-demo-desktop.png`
- Delete: `docs/screenshots/bookly-demo-mobile.png`
- Create: `docs/screenshots/horavia-demo-desktop.png`
- Create: `docs/screenshots/horavia-demo-mobile.png`

**Interfaces:**
- README links to the updated screenshots and distinguishes public demo behavior from credential-dependent Supabase and Stripe flows.

- [ ] **Step 1: Capture current Horavia screenshots**

Capture the demo overview at 1440×900 and 390×844 after clearing stale `bookly-demo-v1` and initializing the current versioned state.

- [ ] **Step 2: Rewrite README**

Document name, positioning, audience, slogan, demo disclosure, architecture, setup, validation commands, security boundaries, and known limitations without roadmap claims already implemented.

- [ ] **Step 3: Audit changed files and secrets**

Run dependency-reference checks, historical-name search, Unicode control-character scan, `.env`/secret scan, and `git diff --check`.

- [ ] **Step 4: Commit documentation**

Commit as `docs: present Horavia demo and setup`.

### Task 6: Final validation and Pull Request update

**Files:**
- Modify only files required to fix failures found by validation.

**Interfaces:**
- PR #2 remains the single review surface; no merge or repository rename occurs.

- [ ] **Step 1: Run clean validation**

Run in order: `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm audit`, and `git diff --check`. Every command must exit 0.

- [ ] **Step 2: Run rendered QA**

Validate `/` and `/demo` at 1440×900 and 390×844, page identity, nonblank content, framework overlay absence, console errors/warnings, navigation, complete-next, clear confirmation, empty state, reset, icon, title, metadata, robots, sitemap, and Open Graph image.

- [ ] **Step 3: Push and update PR #2**

Push `feat/portfolio-polish`, update the PR title/body to Horavia, list the real tests and limitations, preserve review history, and do not merge.

- [ ] **Step 4: Confirm remote state**

Verify local HEAD equals `origin/feat/portfolio-polish`, PR checks pass, the worktree is clean, and the final diff contains only justified files.
