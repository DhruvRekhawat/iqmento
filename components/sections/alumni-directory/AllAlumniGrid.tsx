"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import type { AlumniProfile } from "@/data/alumni-profiles";

const ITEMS_PER_PAGE = 12;

interface AllAlumniGridProps {
  alumni: AlumniProfile[];
}

export function AllAlumniGrid({ alumni }: AllAlumniGridProps) {

  const [currentPage, setCurrentPage] = useState(1);

  if (alumni.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(alumni.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const sortedAlumni = [...alumni].sort((a: any, b: any) => {
  // 1️⃣ Featured first
  if (a.isFeatured && !b.isFeatured) return -1;
  if (!a.isFeatured && b.isFeatured) return 1;

  // 2️⃣ Then by reviews count
  return (b.reviews?.length || 0) - (a.reviews?.length || 0);
});

const profiles = sortedAlumni.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("all-alumni-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="all-alumni-grid" className="bg-white py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <header className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-pretty text-4xl font-medium leading-tight tracking-[-0.045em] text-[#12131c] sm:text-[2.85rem]">
            All Alumni Mentors
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#55586c] sm:text-lg">
            Browse our complete directory of verified alumni mentors ready to guide you through your journey.
          </p>
        </header>

        {/* Results count */}
        <p className="text-sm text-[#55586c] text-center -mt-6">
          Showing{" "}
          <span className="font-semibold text-[#12131c]">
            {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, alumni.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#12131c]">{alumni.length}</span>{" "}
          mentors
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles.map((profile) => (
            <Link
              key={profile.slug}
              href={`/alumni/${profile.slug}`}
              className="group flex flex-col gap-6 rounded-[28px] border border-[#e0e3f4] bg-[#f8f8ff] p-6 shadow-[0_36px_110px_-72px_rgba(14,16,34,0.4)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_36px_110px_-60px_rgba(14,16,34,0.5)]"
            >
              <div className="relative h-60 overflow-hidden rounded-3xl border border-[#dbdffa] bg-[#111315]">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  className="object-cover object-center opacity-95 transition-opacity duration-300 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#141626] group-hover:text-[#4f39f6] transition-colors">
                    {profile.name}
                  </h3>
                  <p className="text-sm font-medium uppercase tracking-[0.26em] text-[#7a7f95]">
                    {profile.location}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[#55586c] line-clamp-2">
                  {profile.headline}
                </p>
              </div>

              {profile.focusAreas && profile.focusAreas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.focusAreas.slice(0, 3).map((focus) => (
                    <span
                      key={`${profile.slug}-${focus.title}`}
                      className="rounded-full border border-[#d7dbed] bg-white px-3 py-1.5 text-xs font-medium text-[#4f39f6]"
                    >
                      {focus.title}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </section>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = useMemo(() => {
    const items: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push("…");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) items.push(i);
      if (currentPage < totalPages - 2) items.push("…");
      items.push(totalPages);
    }
    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 pt-4">
      {/* Prev */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e0e3f4] bg-white text-[#535353] transition-colors hover:border-[#4f39f6] hover:text-[#4f39f6] disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1 sm:gap-2">
        {pages.map((page, idx) =>
          page === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-10 w-8 items-center justify-center text-sm text-[#9e9e9e] select-none"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors ${
                currentPage === page
                  ? "border-[#4f39f6] bg-[#4f39f6] text-white"
                  : "border-[#e0e3f4] bg-white text-[#535353] hover:border-[#4f39f6] hover:text-[#4f39f6]"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e0e3f4] bg-white text-[#535353] transition-colors hover:border-[#4f39f6] hover:text-[#4f39f6] disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}