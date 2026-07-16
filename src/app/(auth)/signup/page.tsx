"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction, type AuthState } from "../actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signupAction,
    undefined,
  );

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold">Crie sua conta</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Ambiente demonstrativo; integrações exigem credenciais próprias
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="business_name"
            className="mb-1 block text-sm font-medium"
          >
            Nome do negócio
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            required
            placeholder="Estúdio Aurora"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
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
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Mínimo de 6 caracteres
          </p>
        </div>

        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
