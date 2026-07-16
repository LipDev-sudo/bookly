"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthState } from "../actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold">Acesse sua agenda</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Entre na sua conta Horavia
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Criar conta
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Quer conhecer a Horavia sem criar conta?{" "}
        <Link href="/demo" className="font-medium text-primary hover:underline">
          Abrir demonstração local
        </Link>
      </p>
    </>
  );
}
