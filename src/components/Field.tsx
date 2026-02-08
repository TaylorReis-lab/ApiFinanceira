import { cn } from "@/utils/cn";
import type { PropsWithChildren } from "react";

export function Label({ children }: PropsWithChildren) {
  return <label className="text-sm font-medium text-slate-700">{children}</label>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none",
        "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
        "disabled:bg-slate-50 disabled:text-slate-500",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none",
        "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none",
        "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
        props.className
      )}
    />
  );
}
