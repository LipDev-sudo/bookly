"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// ----------------------------------------------------------------
// Validation
// ----------------------------------------------------------------

const serviceSchema = z.object({
  name: z.string().min(1, "Informe o nome").max(120),
  description: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  duration_min: z.coerce
    .number({ message: "A duração deve ser um número" })
    .int("A duração deve ser um número inteiro")
    .min(5, "A duração mínima é de 5 minutos")
    .max(1440, "A duração máxima é de 24 horas"),
  // Price is entered in major units (e.g. 49.90), stored as cents.
  price: z.coerce
    .number({ message: "O preço deve ser um número" })
    .min(0, "O preço não pode ser negativo")
    .max(1_000_000),
  active: z.coerce.boolean().optional().default(true),
});

type FieldErrors = Partial<
  Record<"name" | "description" | "duration_min" | "price" | "active", string>
>;

export type ServiceFormState = {
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
  return serviceSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    duration_min: formData.get("duration_min"),
    price: formData.get("price"),
    active: formData.get("active") === "on",
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

export async function createServiceAction(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: mapZodErrors(parsed.error) };

  const businessId = await getBusinessId();
  if (!businessId) return { error: "Nenhum negócio foi encontrado para esta conta." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").insert({
    business_id: businessId,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    duration_min: parsed.data.duration_min,
    price_cents: Math.round(parsed.data.price * 100),
    active: parsed.data.active,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard");
  redirect("/dashboard/services?toast=created");
}

export async function updateServiceAction(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Identificador do serviço ausente." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: mapZodErrors(parsed.error) };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("services")
    .update({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      duration_min: parsed.data.duration_min,
      price_cents: Math.round(parsed.data.price * 100),
      active: parsed.data.active,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/services");
  redirect("/dashboard/services?toast=updated");
}

export async function deleteServiceAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("services").delete().eq("id", id);

  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard");
  redirect("/dashboard/services?toast=deleted");
}
