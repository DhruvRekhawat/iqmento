"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ---------- Simple string list ----------

interface StringListProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function StringList({ label, values, onChange, placeholder, multiline }: StringListProps) {
  const addItem = () => onChange([...values, ""]);
  const updateItem = (index: number, val: string) => {
    const next = [...values];
    next[index] = val;
    onChange(next);
  };
  const removeItem = (index: number) => onChange(values.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground-strong">{label}</label>
        <Button type="button" variant="ghost" size="sm" onClick={addItem}>
          + Add
        </Button>
      </div>
      {values.map((val, i) => (
        <div key={i} className="flex gap-2 items-start">
          {multiline ? (
            <Textarea
              value={val}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
              rows={2}
              className="flex-1"
            />
          ) : (
            <Input
              value={val}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(i)}
            className="text-red-500 hover:text-red-700 shrink-0"
          >
            &times;
          </Button>
        </div>
      ))}
      {values.length === 0 && (
        <p className="text-xs text-foreground-muted py-2">No items yet. Click &quot;+ Add&quot; to add one.</p>
      )}
    </div>
  );
}

// ---------- Key-Value pair list ----------

interface KeyValueListProps {
  label: string;
  values: { label: string; value: string }[];
  onChange: (values: { label: string; value: string }[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export function KeyValueList({
  label,
  values,
  onChange,
  keyPlaceholder = "Label",
  valuePlaceholder = "Value",
}: KeyValueListProps) {
  const addItem = () => onChange([...values, { label: "", value: "" }]);
  const updateItem = (index: number, field: "label" | "value", val: string) => {
    const next = [...values];
    next[index] = { ...next[index], [field]: val };
    onChange(next);
  };
  const removeItem = (index: number) => onChange(values.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground-strong">{label}</label>
        <Button type="button" variant="ghost" size="sm" onClick={addItem}>
          + Add
        </Button>
      </div>
      {values.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            value={item.label}
            onChange={(e) => updateItem(i, "label", e.target.value)}
            placeholder={keyPlaceholder}
            className="flex-1"
          />
          <Input
            value={item.value}
            onChange={(e) => updateItem(i, "value", e.target.value)}
            placeholder={valuePlaceholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(i)}
            className="text-red-500 hover:text-red-700 shrink-0"
          >
            &times;
          </Button>
        </div>
      ))}
      {values.length === 0 && (
        <p className="text-xs text-foreground-muted py-2">No items yet.</p>
      )}
    </div>
  );
}

// ---------- Generic object list ----------

interface ObjectField {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
  className?: string;
}

interface ObjectListProps {
  label: string;
  fields: ObjectField[];
  values: Record<string, string>[];
  onChange: (values: Record<string, string>[]) => void;
  className?: string;
}

export function ObjectList({ label, fields, values, onChange, className }: ObjectListProps) {
  const addItem = () => {
    const empty: Record<string, string> = {};
    fields.forEach((f) => (empty[f.key] = ""));
    onChange([...values, empty]);
  };
  const updateItem = (index: number, key: string, val: string) => {
    const next = [...values];
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  };
  const removeItem = (index: number) => onChange(values.filter((_, i) => i !== index));

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground-strong">{label}</label>
        <Button type="button" variant="ghost" size="sm" onClick={addItem}>
          + Add
        </Button>
      </div>
      {values.map((item, i) => (
        <div
          key={i}
          className="radius-lg border border-[rgba(16,19,34,0.08)] bg-surface-muted/30 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              #{i + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(i)}
              className="text-red-500 hover:text-red-700 h-7 px-2"
            >
              Remove
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.key}
                className={cn(
                  field.type === "textarea" ? "sm:col-span-2" : "",
                  field.className
                )}
              >
                <label className="text-xs font-medium text-foreground-muted mb-1 block">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={item[field.key] || ""}
                    onChange={(e) => updateItem(i, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={2}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={item[field.key] || ""}
                    onChange={(e) => updateItem(i, field.key, e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-[rgba(16,19,34,0.12)] bg-surface px-3 py-2 text-sm"
                  >
                    <option value="">{field.placeholder || "Select..."}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type || "text"}
                    value={item[field.key] || ""}
                    onChange={(e) => updateItem(i, field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {values.length === 0 && (
        <p className="text-xs text-foreground-muted py-3 text-center">
          No items yet. Click &quot;+ Add&quot; to add one.
        </p>
      )}
    </div>
  );
}
