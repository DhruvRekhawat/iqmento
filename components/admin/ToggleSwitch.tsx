"use client";

import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function ToggleSwitch({ label, checked, onChange, description }: ToggleSwitchProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-primary" : "bg-[rgba(16,19,34,0.12)]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      <div className="space-y-0.5">
        <span className="text-sm font-medium text-foreground-strong group-hover:text-foreground">
          {label}
        </span>
        {description && (
          <p className="text-xs text-foreground-muted">{description}</p>
        )}
      </div>
    </label>
  );
}
