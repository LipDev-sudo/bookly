import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  Users,
  Briefcase,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logoutAction } from "../(auth)/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("owner_id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card sm:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Bookly</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
            Overview
          </NavItem>
          <NavItem href="/dashboard/appointments" icon={<CalendarDays className="h-4 w-4" />}>
            Appointments
          </NavItem>
          <NavItem href="/dashboard/clients" icon={<Users className="h-4 w-4" />}>
            Clients
          </NavItem>
          <NavItem href="/dashboard/services" icon={<Briefcase className="h-4 w-4" />}>
            Services
          </NavItem>
        </nav>
        <div className="border-t border-border p-4">
          <p className="mb-1 text-xs text-muted-foreground">Signed in as</p>
          <p className="mb-3 truncate text-sm font-medium">{user.email}</p>
          {business && (
            <p className="mb-3 truncate text-xs text-muted-foreground">
              {business.name}
            </p>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}
