"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// ----------------------------------------------------------------
// Validation
// ----------------------------------------------------------------

const appointmentSchema = z
  .object({
    client_id: z.string().uuid("Select a client"),
    service_id: z.string().uuid("Select a service"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    notes: z
      .string()
      .max(1000)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    status: z
      .enum(["scheduled", "completed", "canceled", "no_show"])
      .default("scheduled"),
  })
  .transform((d) => {
    const starts_at = new Date(`${d.date}T${d.time}`);
    return { ...d, starts_at };
  });

type FieldErrors = Partial<
  Record<
    "client_id" | "service_id" | "date" | "time" | "notes" | "status",
    string
  >
>;

export type AppointmentFormState = {
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

async function getServiceDuration(serviceId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("duration_min")
    .eq("id", serviceId)
    .maybeSingle();
  return data?.duration_min ?? 60;
}

function parseForm(formData: FormData) {
  return appointmentSchema.safeParse({
    client_id: formData.get("client_id"),
    service_id: formData.get("service_id"),
    date: formData.get("date"),
    time: formData.get("time"),
    notes: String(formData.get("notes") ?? ""),
    status: formData.get("status") ?? "scheduled",
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

export async function createAppointmentAction(
  _prev: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: mapZodErrors(parsed.error) };

  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found for this user." };

  const durationMin = await getServiceDuration(parsed.data.service_id);
  const starts_at = parsed.data.starts_at.toISOString();
  const ends_at = new Date(
    parsed.data.starts_at.getTime() + durationMin * 60_000,
  ).toISOString();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("appointments").insert({
    business_id: businessId,
    client_id: parsed.data.client_id,
    service_id: parsed.data.service_id,
    starts_at,
    ends_at,
    status: parsed.data.status,
    notes: parsed.data.notes ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  redirect("/dashboard/appointments?toast=created");
}

export async function updateAppointmentAction(
  _prev: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing appointment id." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: mapZodErrors(parsed.error) };

  const durationMin = await getServiceDuration(parsed.data.service_id);
  const starts_at = parsed.data.starts_at.toISOString();
  const ends_at = new Date(
    parsed.data.starts_at.getTime() + durationMin * 60_000,
  ).toISOString();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("appointments")
    .update({
      client_id: parsed.data.client_id,
      service_id: parsed.data.service_id,
      starts_at,
      ends_at,
      status: parsed.data.status,
      notes: parsed.data.notes ?? null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/appointments");
  redirect("/dashboard/appointments?toast=updated");
}

export async function deleteAppointmentAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("appointments").delete().eq("id", id);

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  redirect("/dashboard/appointments?toast=deleted");
}
