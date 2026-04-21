"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ label = "Back to Colleges" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group inline-flex items-center gap-2 rounded-full border border-[#e5e7ef] bg-white px-4 py-2 text-sm font-medium text-[#11121b] shadow-sm transition-all duration-200 hover:border-[#4f39f6] hover:text-[#4f39f6] hover:shadow-md active:scale-[0.97]"
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
      <span>{label}</span>
    </button>
  );
}