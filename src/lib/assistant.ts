import type { Tool, ToolResultBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// ----------------------------------------------------------------
// Tool definitions
// ----------------------------------------------------------------

export const ASSISTANT_TOOLS: Tool[] = [
  {
    name: "list_appointments",
    description:
      "List upcoming or recent appointments. Returns appointments with client name, service name, date/time, and status. Defaults to the next 7 days of scheduled appointments.",
    input_schema: {
      type: "object" as const,
      properties: {
        status: {
          type: "string",
          enum: ["scheduled", "completed", "canceled", "no_show"],
          description: "Filter by status. Omit to return all statuses.",
        },
        days_ahead: {
          type: "number",
          description:
            "How many days into the future to look (default 7). Use -30 to see the past 30 days.",
        },
      },
      required: [],
    },
  },
  {
    name: "search_clients",
    description:
      "Search for clients by name (case-insensitive partial match). Returns id, name, email, and phone.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Name (or partial name) to search for.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "list_services",
    description:
      "List all active services offered by the business, including id, name, duration in minutes, and price.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "create_appointment",
    description:
      "Schedule a new appointment. You must have valid client_id and service_id before calling this. starts_at must be an ISO 8601 datetime string.",
    input_schema: {
      type: "object" as const,
      properties: {
        client_id: { type: "string", description: "UUID of the client." },
        service_id: { type: "string", description: "UUID of the service." },
        starts_at: {
          type: "string",
          description: "Start date/time in ISO 8601 format, e.g. 2025-06-10T14:00:00.",
        },
        notes: { type: "string", description: "Optional notes for the appointment." },
      },
      required: ["client_id", "service_id", "starts_at"],
    },
  },
  {
    name: "update_appointment_status",
    description: "Update the status of an existing appointment.",
    input_schema: {
      type: "object" as const,
      properties: {
        appointment_id: { type: "string", description: "UUID of the appointment." },
        status: {
          type: "string",
          enum: ["scheduled", "completed", "canceled", "no_show"],
          description: "New status.",
        },
      },
      required: ["appointment_id", "status"],
    },
  },
  {
    name: "create_client",
    description: "Add a new client to the business.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Full name of the client." },
        email: { type: "string", description: "Email address (optional)." },
        phone: { type: "string", description: "Phone number (optional)." },
      },
      required: ["name"],
    },
  },
];

// ----------------------------------------------------------------
// Tool execution
// ----------------------------------------------------------------

type ToolInput = Record<string, unknown>;

export async function executeTool(
  toolName: string,
  input: ToolInput,
  businessId: string,
): Promise<ToolResultBlockParam["content"]> {
  const supabase = await createSupabaseServerClient();

  if (toolName === "list_appointments") {
    const daysAhead = typeof input.days_ahead === "number" ? input.days_ahead : 7;
    const now = new Date();
    let from: string;
    let to: string;

    if (daysAhead >= 0) {
      from = now.toISOString();
      to = new Date(now.getTime() + daysAhead * 86_400_000).toISOString();
    } else {
      from = new Date(now.getTime() + daysAhead * 86_400_000).toISOString();
      to = now.toISOString();
    }

    let q = supabase
      .from("appointments")
      .select("id, starts_at, ends_at, status, notes, clients(name), services(name, duration_min)")
      .eq("business_id", businessId)
      .gte("starts_at", from)
      .lte("starts_at", to)
      .order("starts_at", { ascending: true })
      .limit(20);

    if (input.status) {
      q = q.eq("status", input.status as string);
    }

    const { data, error } = await q;
    if (error) return `Error: ${error.message}`;

    if (!data || data.length === 0) return "No appointments found for that period.";

    const rows = data.map((a) => {
      const start = new Date(a.starts_at).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const client = (a.clients as { name: string } | null)?.name ?? "Unknown";
      const service = (a.services as { name: string } | null)?.name ?? "Unknown";
      return `• [${a.id}] ${start} — ${client} — ${service} — ${a.status}${a.notes ? ` (${a.notes})` : ""}`;
    });

    return rows.join("\n");
  }

  if (toolName === "search_clients") {
    const { data, error } = await supabase
      .from("clients")
      .select("id, name, email, phone")
      .eq("business_id", businessId)
      .ilike("name", `%${input.query as string}%`)
      .limit(10);

    if (error) return `Error: ${error.message}`;
    if (!data || data.length === 0) return "No clients found matching that name.";

    return data
      .map((c) => `• [${c.id}] ${c.name}${c.phone ? ` — ${c.phone}` : ""}${c.email ? ` — ${c.email}` : ""}`)
      .join("\n");
  }

  if (toolName === "list_services") {
    const { data, error } = await supabase
      .from("services")
      .select("id, name, duration_min, price_cents")
      .eq("business_id", businessId)
      .eq("active", true)
      .order("name");

    if (error) return `Error: ${error.message}`;
    if (!data || data.length === 0) return "No active services found.";

    return data
      .map((s) => {
        const price = (s.price_cents / 100).toFixed(2);
        return `• [${s.id}] ${s.name} — ${s.duration_min} min — $${price}`;
      })
      .join("\n");
  }

  if (toolName === "create_appointment") {
    const startsAt = new Date(input.starts_at as string);
    if (isNaN(startsAt.getTime())) return "Error: invalid starts_at datetime.";

    // get service duration to compute ends_at
    const { data: svc } = await supabase
      .from("services")
      .select("duration_min")
      .eq("id", input.service_id as string)
      .maybeSingle();

    const durationMin = svc?.duration_min ?? 60;
    const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        business_id: businessId,
        client_id: input.client_id as string,
        service_id: input.service_id as string,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: "scheduled",
        notes: (input.notes as string) ?? null,
      })
      .select("id")
      .single();

    if (error) return `Error creating appointment: ${error.message}`;

    return `Appointment created successfully. ID: ${data.id}`;
  }

  if (toolName === "update_appointment_status") {
    const { error } = await supabase
      .from("appointments")
      .update({ status: input.status as string })
      .eq("id", input.appointment_id as string)
      .eq("business_id", businessId);

    if (error) return `Error updating appointment: ${error.message}`;
    return `Appointment status updated to "${input.status}".`;
  }

  if (toolName === "create_client") {
    const { data, error } = await supabase
      .from("clients")
      .insert({
        business_id: businessId,
        name: input.name as string,
        email: (input.email as string) ?? null,
        phone: (input.phone as string) ?? null,
      })
      .select("id, name")
      .single();

    if (error) return `Error creating client: ${error.message}`;
    return `Client "${data.name}" created. ID: ${data.id}`;
  }

  return `Unknown tool: ${toolName}`;
}
