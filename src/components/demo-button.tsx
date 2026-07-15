import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function DemoButton() {
  return (
    <Link
      href="/demo"
      className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      Explore demo <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}
