"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { ClientFormState } from "../actions";

type Defaults = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

type Props = {
  action: (prev: ClientFormState, formData: FormData) => Promise<ClientFormState>;
  defaults?: Defaults;
  hiddenId?: string;
  submitLabel: string;
  pendingLabel: string;
};

export function ClientForm({
  action,
  defaults,
  hiddenId,
  submitLabel,
  pendingLabel,
}: Props) {
  const [state, formAction, pending] = useActionState<ClientFormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      {hiddenId && <input type="hidden" name="id" value={hiddenId} />}
      <Field
        id="name"
        label="Nome"
        required
        defaultValue={defaults?.name ?? ""}
        error={state?.fieldErrors?.name}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        defaultValue={defaults?.email ?? ""}
        error={state?.fieldErrors?.email}
      />
      <Field
        id="phone"
        label="Telefone"
        defaultValue={defaults?.phone ?? ""}
        error={state?.fieldErrors?.phone}
      />
      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={defaults?.notes ?? ""}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {state?.fieldErrors?.notes && (
          <p className="mt-1 text-xs text-destructive">{state.fieldErrors.notes}</p>
        )}
      </div>

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
          href="/dashboard/clients"
          className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
        >
          Cancelar
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
  error,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
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
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
