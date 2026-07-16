# Horavia Professionalization Design

## Product role

Horavia is a demonstrable scheduling and client-management SaaS for independent professionals and small service businesses. It remains in the portfolio because it is the only project that demonstrates a vertical full-stack workflow with authentication, multi-tenant data isolation, recurring customer records, appointments, service pricing, revenue context, and protected test-mode billing.

The primary demonstrable flow is: open the public demo, understand today's operation, review appointments, inspect clients and services, complete the next appointment, observe the updated indicators, clear the local data, and restore the fictional workspace.

## Positioning

- **Name:** Horavia
- **Category:** scheduling and service management
- **Audience:** independent professionals and small service businesses
- **Value proposition:** keep appointments, client history, services, and the day's progress in one clear operational workspace
- **Personality:** reliable, calm, direct, and service-oriented
- **Tone:** concise Brazilian Portuguese, helpful without sounding promotional
- **Slogan:** “Do primeiro horário ao último atendimento.”
- **Demo business:** Estúdio Aurora, a fictional hair and beauty studio with one coherent service catalog and customer base
- **Demo disclosure:** every public demo surface must state that records are fictional, stored only in the current browser, and independent of Supabase and Stripe

## Visual direction

Horavia must look distinct from the portfolio's work-management, restaurant-ordering, learning, finance, and commerce products.

- Warm white and cool gray form the neutral canvas.
- Deep teal is the primary brand color and communicates trust without reusing the portfolio's dominant technology blue.
- Coral is a restrained accent for current-day emphasis and calls to action, not a decorative gradient.
- Semantic colors remain conventional and high-contrast: green for completed/active, amber for pending attention, and red for canceled/destructive actions.
- Geist remains the typeface to avoid unnecessary font cost and preserve excellent legibility.
- Lucide outline icons remain the icon language.
- The mark is a simple rounded “H”/time-slot symbol suitable for the app header and generated icon.
- Surfaces use generous whitespace, subtle borders, soft radii, and minimal shadows. No glassmorphism, generic gradient, retro styling, or ornamental illustration is introduced.

## Architecture

The authenticated Supabase and Stripe architecture remains unchanged. The public demo continues to be credential-free and browser-local.

The current monolithic demo component will be split by responsibility:

- `src/components/demo/demo-dashboard.tsx` owns view selection and state orchestration.
- `src/components/demo/demo-navigation.tsx` renders desktop and mobile navigation.
- `src/components/demo/demo-overview.tsx` renders metrics, revenue context, and next appointments.
- `src/components/demo/demo-sections.tsx` renders appointment, client, and service lists.
- `src/components/demo/demo-ui.tsx` holds small shared demo presentation primitives.
- `src/lib/demo-data.ts` owns the versioned fictional dataset, parsing, empty-state creation, metrics, and appointment transition functions.
- `src/lib/site.ts` centralizes name, description, slogan, public URL, and metadata copy.

No experimental or inactive architecture will be removed solely for not participating in the public demo.

## Content model

All public and active authenticated UI uses Brazilian Portuguese. The Estúdio Aurora data stays internally coherent:

- hair and beauty services only;
- BRL currency and Brazilian date/time language;
- realistic fictional names and `example.com` addresses;
- no customer counts, testimonials, ratings, or business-growth claims presented as real;
- operational metrics are explicitly derived from the local fictional records.

The landing page leads with the operational outcome, offers the interactive demo as the primary portfolio CTA, and keeps account creation secondary because external credentials may not be configured in a preview.

## Accessibility and performance

- Every interactive control has a visible focus indicator and at least a 44px practical touch target where space permits.
- Navigation exposes the current view with `aria-current`.
- Status is communicated with text as well as color.
- Destructive clearing requires confirmation inside the interface rather than immediate data loss.
- The demo parser validates persisted browser data and presents a recoverable error state.
- Reduced-motion preferences disable nonessential animation.
- Client JavaScript is limited to the interactive demo and authenticated controls; static landing and metadata remain server-rendered.
- Unused direct dependencies are removed after reference and build verification.

## SEO and social presentation

- Root metadata uses `pt-BR`, a canonical URL derived from `NEXT_PUBLIC_APP_URL`, an accurate description, Open Graph fields, and Twitter card metadata.
- Generated icon and Open Graph image use the Horavia mark and positioning.
- `robots.txt` and `sitemap.xml` use the same normalized site URL.
- The public README identifies Horavia as a fictional product demonstration and documents which flows require external test credentials.

## Testing and acceptance

Automated tests cover the versioned fictional dataset, persisted-data parsing, metric derivation, empty-state creation, and completing the next appointment. The repository must pass:

- `npm ci`
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm audit`
- `git diff --check`
- secret and real-environment-file scan

Rendered QA covers the landing page and demo at 1440×900 and 390×844, keyboard-visible controls, navigation, completion, clear/confirm, reset, empty state, title, icon, metadata, console health, and screenshot refresh.

## Scope boundaries

- Do not rename the repository during this PR.
- Do not merge the PR.
- Do not change repository visibility.
- Do not replace Supabase, Stripe, or the data architecture.
- Do not invent testimonials, external customers, or performance claims.
- Do not add features unrelated to presenting and validating the existing scheduling product.
