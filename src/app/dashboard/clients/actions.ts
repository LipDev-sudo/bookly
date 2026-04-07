"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// ----------------------------------------------------------------
// Validation
// ----------------------------------------------------------------

const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z
    .string()
    .email("Invalid email")
    .max(160)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z
    .string()
    .max(40)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  notes: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "notes", string>>;

export type ClientFormState = {
  error?: string;
  fieldErrors?: FieldErrors;
};

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

async function getBusinessId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  return business?.id ?? null;
}

function parseForm(formData: FormData) {
  return clientSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  });
}

function mapZodErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof FieldErrors;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

// ----------------------------------------------------------------
// Actions
// ----------------------------------------------------------------

export async function createClientAction(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: mapZodErrors(parsed.error) };

  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found for this user." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("clients").insert({
    business_id: businessId,
    name: parsed.data.name,
    email: parsed.data.email ?? null,
    phone: parsed.data.phone ?? null,
    notes: parsed.data.notes ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  redirect("/dashboard/clients");
}

export async function updateClientAction(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing client id." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: mapZodErrors(parsed.error) };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("clients")
    .update({
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      notes: parsed.data.notes ?? null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}

export async function deleteClientAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("clients").delete().eq("id", id);

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
}
