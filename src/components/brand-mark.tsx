import { cn } from "@/lib/utils";

type BrandMarkProps = {
  compact?: boolean;
  className?: string;
};

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-[0.7rem] bg-primary font-bold text-primary-foreground shadow-sm"
      >
        H
      </span>
      {compact ? (
        <span className="sr-only">Horavia</span>
      ) : (
        <span className="text-lg font-bold tracking-[-0.02em]">Horavia</span>
      )}
    </span>
  );
}
