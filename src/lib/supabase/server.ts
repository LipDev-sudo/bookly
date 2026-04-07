import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 *
 * Note: in Next.js 16, `cookies()` is async and must be awaited.
 * The `set` calls are wrapped in try/catch because Server Components
 * cannot mutate cookies — only Server Actions and Route Handlers can.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignored — called from a Server Component during render.
            // Auth refresh happens in middleware, so this is safe.
          }
        },
      },
    },
  );
}

/**
 * Supabase admin client (uses the SECRET key — server only).
 * Bypasses Row Level Security. Use sparingly: webhooks, seed scripts, admin tasks.
 */
export function createSupabaseAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op
        },
      },
    },
  );
}
