"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { ServiceFormState } from "../actions";

type Defaults = {
  name?: string;
  description?: string | null;
  duration_min?: number;
  price?: number;
  active?: boolean;
};

type Props = {
  action: (
    prev: ServiceFormState,
    formData: FormData,
  ) => Promise<ServiceFormState>;
  defaults?: Defaults;
  hiddenId?: string;
  submitLabel: string;
  pendingLabel: string;
};

export function ServiceForm({
  action,
  defaults,
  hiddenId,
  submitLabel,
  pendingLabel,
}: Props) {
  const [state, formAction, pending] = useActionState<ServiceFormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      {hiddenId && <input type="hidden" name="id" value={hiddenId} />}

      <Field
        id="name"
        label="Service name"
        required
        placeholder="Men's haircut"
        defaultValue={defaults?.name ?? ""}
        error={state?.fieldErrors?.name}
      />

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Optional — what's included, what to expect..."
          defaultValue={defaults?.description ?? ""}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {state?.fieldErrors?.description && (
          <p className="mt-1 text-xs text-destructive">
            {state.fieldErrors.description}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="duration_min"
          label="Duration (minutes)"
          type="number"
          required
          min={5}
          step={5}
          defaultValue={String(defaults?.duration_min ?? 60)}
          error={state?.fieldErrors?.duration_min}
        />
        <Field
          id="price"
          label="Price"
          type="number"
          required
          min={0}
          step="0.01"
          defaultValue={
            defaults?.price !== undefined ? String(defaults.price) : "0"
          }
          error={state?.fieldErrors?.price}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaults?.active ?? true}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        Active (clients can book this service)
      </label>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? pendingLabel : submitLabel}
        </button>
        <Link
          href="/dashboard/services"
          className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  defaultValue,
  placeholder,
  error,
  min,
  step,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  min?: number;
  step?: number | string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
