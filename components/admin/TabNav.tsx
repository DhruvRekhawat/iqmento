"use client";

import { cn } from "@/lib/utils";

interface TabNavProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onChange: (key: string) => void;
}

export function TabNav({ tabs, activeTab, onChange }: TabNavProps) {
  return (
    <nav className="flex flex-wrap gap-1 border-b border-[rgba(16,19,34,0.12)] mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] border-b-2 transition-colors -mb-[1px]",
            activeTab === tab.key
              ? "border-primary text-foreground-strong"
              : "border-transparent text-foreground-muted hover:text-foreground-strong hover:border-[rgba(16,19,34,0.12)]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
