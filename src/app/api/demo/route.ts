import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEMO_EMAIL = "demo@bookly.app";
const DEMO_PASSWORD = "demo1234";

export async function POST() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (error) {
    return NextResponse.json(
      {
        error: `Demo login failed: ${error.message}. Make sure the demo user (${DEMO_EMAIL}) exists in Supabase Authentication.`,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
