import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <BrandMark />
      </Link>
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
