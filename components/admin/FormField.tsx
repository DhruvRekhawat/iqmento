"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "email" | "url" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { label: string; value: string }[];
  hint?: string;
  rows?: number;
  className?: string;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  error,
  options,
  hint,
  rows = 3,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={cn(error && "border-red-400")}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "flex h-12 w-full rounded-lg border border-[rgba(16,19,34,0.12)] bg-surface px-4 py-3 text-sm text-foreground transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]",
            error && "border-red-400"
          )}
        >
          <option value="">{placeholder || "Select..."}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(error && "border-red-400")}
        />
      )}
      {hint && !error && (
        <p className="text-xs text-foreground-muted">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
