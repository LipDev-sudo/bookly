import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function DemoButton() {
  return (
    <Link
      href="/demo"
      className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Explorar demonstração <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}
