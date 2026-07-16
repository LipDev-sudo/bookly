import Link from "next/link";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { DEMO_DISCLOSURE } from "@/lib/site";

export type DemoView = "overview" | "appointments" | "clients" | "services";

type ViewDefinition = {
  id: DemoView;
  label: string;
  icon: LucideIcon;
};

const VIEWS: ViewDefinition[] = [
  { id: "overview", label: "Visão geral", icon: BarChart3 },
  { id: "appointments", label: "Agenda", icon: CalendarDays },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "services", label: "Serviços", icon: BriefcaseBusiness },
];

type DemoNavigationProps = {
  view: DemoView;
  onChange: (view: DemoView) => void;
};

export function DemoSidebar({ view, onChange }: DemoNavigationProps) {
  return (
    <aside className="hidden border-r border-border bg-card lg:flex lg:flex-col">
      <Link
        href="/"
        className="flex h-20 items-center border-b border-border px-6"
        aria-label="Voltar para o início da Horavia"
      >
        <BrandMark />
      </Link>
      <DemoNav view={view} onChange={onChange} className="flex-1 p-4" />
      <div className="border-t border-border p-4 text-xs leading-5 text-muted-foreground">
        <span className="mb-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
          Modo demonstrativo
        </span>
        <p>{DEMO_DISCLOSURE}</p>
      </div>
    </aside>
  );
}

export function DemoMobileNavigation({ view, onChange }: DemoNavigationProps) {
  return (
    <DemoNav
      view={view}
      onChange={onChange}
      className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:hidden"
      mobile
    />
  );
}

function DemoNav({
  view,
  onChange,
  className,
  mobile = false,
}: DemoNavigationProps & { className: string; mobile?: boolean }) {
  return (
    <nav className={className} aria-label="Navegação da demonstração">
      {VIEWS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-current={view === id ? "page" : undefined}
          className={
            mobile
              ? `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold ${
                  view === id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground"
                }`
              : `mb-1 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors ${
                  view === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </nav>
  );
}
