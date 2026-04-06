"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CsvUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  endpoint: string;
  templateColumns: string[];
  onComplete?: () => void;
}

export function CsvUploadDialog({
  open,
  onOpenChange,
  title,
  endpoint,
  templateColumns,
  onComplete,
}: CsvUploadDialogProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string[][] | null>(null);
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [result, setResult] = React.useState<{
    created: number;
    skipped: number;
    errors: { row: number; message: string }[];
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function getAuthHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setHeaders([]);
    setResult(null);
    setError(null);
  }

  function handleFile(f: File) {
    if (!f.name.endsWith(".csv")) {
      setError("Please select a .csv file");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) {
        setError("CSV must have a header row and at least one data row");
        return;
      }
      const hdrs = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      setHeaders(hdrs);
      const rows = lines.slice(1, 6).map((line) =>
        line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""))
      );
      setPreview(rows);
    };
    reader.readAsText(f);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setResult(data);
        onComplete?.();
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function downloadTemplate() {
    const csv = templateColumns.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload: {title}</DialogTitle>
          <DialogDescription>
            Upload a CSV file to create multiple records at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download template */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground-muted">Need a template?</span>
            <Button type="button" variant="outline" size="sm" onClick={downloadTemplate}>
              Download CSV Template
            </Button>
          </div>

          {/* File drop zone */}
          {!result && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "radius-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-8 px-4 transition-colors",
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-[rgba(16,19,34,0.16)] hover:border-[rgba(16,19,34,0.3)] bg-surface-muted/50"
              )}
            >
              <svg className="w-8 h-8 text-foreground-muted/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-foreground-muted">
                {file ? file.name : "Drop a CSV file here or click to browse"}
              </span>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />

          {/* Preview table */}
          {preview && !result && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                Preview (first {preview.length} rows)
              </h4>
              <div className="overflow-x-auto radius-lg border border-[rgba(16,19,34,0.12)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-muted">
                      {headers.slice(0, 6).map((h, i) => (
                        <th key={i} className="text-left py-2 px-3 font-semibold text-foreground-muted whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                      {headers.length > 6 && (
                        <th className="text-left py-2 px-3 font-semibold text-foreground-muted">
                          +{headers.length - 6} more
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-t border-[rgba(16,19,34,0.06)]">
                        {row.slice(0, 6).map((cell, j) => (
                          <td key={j} className="py-2 px-3 text-foreground max-w-[150px] truncate">
                            {cell || <span className="text-foreground-muted italic">empty</span>}
                          </td>
                        ))}
                        {row.length > 6 && <td className="py-2 px-3 text-foreground-muted">...</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="radius-lg bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <div className="text-2xl font-semibold text-emerald-700">{result.created}</div>
                  <div className="text-xs text-emerald-600 font-medium">Created</div>
                </div>
                <div className="radius-lg bg-amber-50 border border-amber-200 p-4 text-center">
                  <div className="text-2xl font-semibold text-amber-700">{result.skipped}</div>
                  <div className="text-xs text-amber-600 font-medium">Skipped</div>
                </div>
                <div className="radius-lg bg-red-50 border border-red-200 p-4 text-center">
                  <div className="text-2xl font-semibold text-red-700">{result.errors.length}</div>
                  <div className="text-xs text-red-600 font-medium">Errors</div>
                </div>
              </div>
              {result.errors.length > 0 && (
                <details className="radius-lg border border-[rgba(16,19,34,0.12)] p-3">
                  <summary className="text-sm font-medium text-foreground-muted cursor-pointer">
                    View errors
                  </summary>
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <div key={i} className="text-xs text-red-600">
                        Row {err.row}: {err.message}
                      </div>
                    ))}
                  </div>
                </details>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => { reset(); onOpenChange(false); }}
                className="w-full"
              >
                Done
              </Button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="radius-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Upload button */}
          {file && !result && (
            <Button
              type="button"
              variant="primary"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : `Upload ${file.name}`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
