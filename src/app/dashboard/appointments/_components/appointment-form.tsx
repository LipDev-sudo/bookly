"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AppointmentFormState } from "../actions";

type ClientOption = { id: string; name: string };
type ServiceOption = { id: string; name: string; duration_min: number };

type Defaults = {
  client_id?: string;
  service_id?: string;
  date?: string;
  time?: string;
  notes?: string | null;
  status?: string;
};

type Props = {
  action: (
    prev: AppointmentFormState,
    formData: FormData,
  ) => Promise<AppointmentFormState>;
  clients: ClientOption[];
  services: ServiceOption[];
  defaults?: Defaults;
  hiddenId?: string;
  submitLabel: string;
  pendingLabel: string;
};

export function AppointmentForm({
  action,
  clients,
  services,
  defaults,
  hiddenId,
  submitLabel,
  pendingLabel,
}: Props) {
  const [state, formAction, pending] = useActionState<
    AppointmentFormState,
    FormData
  >(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {hiddenId && <input type="hidden" name="id" value={hiddenId} />}

      {/* Client */}
      <div>
        <label
          htmlFor="client_id"
          className="mb-1 block text-sm font-medium"
        >
          Client <span className="text-destructive">*</span>
        </label>
        <select
          id="client_id"
          name="client_id"
          required
          defaultValue={defaults?.client_id ?? ""}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="" disabled>
            Select a client...
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.client_id && (
          <p className="mt-1 text-xs text-destructive">
            {state.fieldErrors.client_id}
          </p>
        )}
      </div>

      {/* Service */}
      <div>
        <label
          htmlFor="service_id"
          className="mb-1 block text-sm font-medium"
        >
          Service <span className="text-destructive">*</span>
        </label>
        <select
          id="service_id"
          name="service_id"
          required
          defaultValue={defaults?.service_id ?? ""}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="" disabled>
            Select a service...
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.duration_min} min)
            </option>
          ))}
        </select>
        {state?.fieldErrors?.service_id && (
          <p className="mt-1 text-xs text-destructive">
            {state.fieldErrors.service_id}
          </p>
        )}
      </div>

      {/* Date & time */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium">
            Date <span className="text-destructive">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={defaults?.date ?? ""}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {state?.fieldErrors?.date && (
            <p className="mt-1 text-xs text-destructive">
              {state.fieldErrors.date}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="time" className="mb-1 block text-sm font-medium">
            Time <span className="text-destructive">*</span>
          </label>
          <input
            id="time"
            name="time"
            type="time"
            required
            defaultValue={defaults?.time ?? ""}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {state?.fieldErrors?.time && (
            <p className="mt-1 text-xs text-destructive">
              {state.fieldErrors.time}
            </p>
          )}
        </div>
      </div>

      {/* Status (only show on edit) */}
      {hiddenId && (
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaults?.status ?? "scheduled"}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
            <option value="no_show">No show</option>
          </select>
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Optional..."
          defaultValue={defaults?.notes ?? ""}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {pending ? pendingLabel : submitLabel}
        </button>
        <Link
          href="/dashboard/appointments"
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
