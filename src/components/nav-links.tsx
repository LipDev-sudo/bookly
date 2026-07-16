"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/appointments", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/clients", label: "Clientes", icon: Users },
  { href: "/dashboard/services", label: "Serviços", icon: Briefcase },
  { href: "/dashboard/billing", label: "Plano", icon: CreditCard },
];

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Área de gestão">
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
