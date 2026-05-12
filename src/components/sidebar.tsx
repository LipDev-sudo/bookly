"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, LogOut, Menu, X } from "lucide-react";
import { NavLinks } from "./nav-links";

type Props = {
  userEmail: string;
  businessName?: string;
  logoutAction: () => Promise<void>;
};

export function Sidebar({ userEmail, businessName, logoutAction }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const userInfo = (
    <div className="border-t border-border p-4">
      <p className="mb-1 text-xs text-muted-foreground">Signed in as</p>
      <p className="mb-3 truncate text-sm font-medium">{userEmail}</p>
      {businessName && (
        <p className="mb-3 truncate text-xs text-muted-foreground">
          {businessName}
        </p>
      )}
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card sm:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Bookly</span>
        </div>
        <div className="flex-1 p-4">
          <NavLinks />
        </div>
        {userInfo}
      </aside>

      {/* Mobile header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 sm:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span className="font-bold">Bookly</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute bottom-0 left-0 top-0 flex w-72 flex-col bg-card">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <span className="font-bold">Bookly</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
            {userInfo}
          </aside>
        </div>
      )}
    </>
  );
}
