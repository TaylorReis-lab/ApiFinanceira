import { cn } from "@/utils/cn";

export function JsonBlock({ value, className }: { value: unknown; className?: string }) {
  return (
    <pre
      className={cn(
        "overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs leading-relaxed text-slate-100",
        className
      )}
    >
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
