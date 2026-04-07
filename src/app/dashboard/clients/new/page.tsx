import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "../_components/client-form";
import { createClientAction } from "../actions";

export default function NewClientPage() {
  return (
    <div className="p-6 sm:p-10">
      <Link
        href="/dashboard/clients"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">New client</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add someone you want to keep on file.
        </p>
      </header>

      <div className="max-w-xl rounded-lg border border-border bg-card p-6">
        <ClientForm
          action={createClientAction}
          submitLabel="Create client"
          pendingLabel="Creating..."
        />
      </div>
    </div>
  );
}
