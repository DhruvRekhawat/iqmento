import type { ReactNode } from "react";
import { BookOpen, ChevronDown, MapPin, Star, Users2, X } from "lucide-react";
import Image from "next/image";

import { Section } from "@/components/shared/section";

const FILTERS = [
  { label: "College Type", active: true },
  { label: "Location", active: false },
  { label: "Ratings", active: false },
  { label: "Availability", active: false },
  { label: "College Tier", active: false },
];

const ACTION_FILTERS = [
  { label: "Apply", variant: "primary" as const },
  { label: "Clear filters", variant: "ghost" as const },
];

const ACTIVE_FILTERS = ["Sales", "Psychology"];

const COLLEGE_CARDS = [
  {
    name: "Indian Institute of Technology, Delhi",
    location: "New Delhi, India",
    programs: "Engineering, Robotics, Product Design",
    mentors: 15,
    reviews: 42,
    description:
      "Engineering meets innovation — get mentored by alumni now leading at Google and Tesla.",
  },
  {
    name: "National Institute of Design, Ahmedabad",
    location: "Ahmedabad, Gujarat",
    programs: "Product Design, Animation, Strategic Design",
    mentors: 8,
    reviews: 26,
    description:
      "Deep dive into studios, juries, and placements with mentors who have lived the NID experience.",
  },
  {
    name: "University of Toronto",
    location: "Toronto, Canada",
    programs: "Computer Science, Psychology, Life Sciences",
    mentors: 12,
    reviews: 31,
    description:
      "Plan your global undergraduate journey with guidance on co-ops, research tracks, and housing.",
  },
  {
    name: "Ashoka University",
    location: "Sonipat, Haryana",
    programs: "Economics, Liberal Arts, Interdisciplinary Studies",
    mentors: 7,
    reviews: 19,
    description:
      "Understand Ashoka’s unique curriculum, YIF pathway, and scholarships directly from seniors.",
  },
  {
    name: "BITS Pilani",
    location: "Pilani, Rajasthan",
    programs: "Dual Degrees, Mechanical, Entrepreneurship",
    mentors: 11,
    reviews: 28,
    description:
      "Decode practice schools, clubs, and the startup ecosystem with BITSians across batches.",
  },
  {
    name: "Georgia Institute of Technology",
    location: "Atlanta, USA",
    programs: "Aerospace, Data Science, Industrial Engineering",
    mentors: 9,
    reviews: 24,
    description:
      "Navigate internationals admits—scholarships, co-ops, and internships with alumni in the US.",
  },
];

export function CollegesExplorer() {
  return (
    <Section id="colleges-explorer" className="bg-white">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            {FILTERS.map((filter) => (
              <FilterPill key={filter.label} active={filter.active}>
                {filter.label}
              </FilterPill>
            ))}

            {ACTION_FILTERS.map((filter) => (
              <ActionPill key={filter.label} variant={filter.variant}>
                {filter.label}
              </ActionPill>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {ACTIVE_FILTERS.map((filter) => (
              <ActiveFilter key={filter} label={filter} />
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {COLLEGE_CARDS.map((college) => (
            <CollegeCard key={college.name} {...college} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function FilterPill({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-[#4f39f6] bg-[#edeaff] text-[#2f23a8]"
          : "border-[#d7dae2] bg-white text-[#535353] hover:border-[#b9bed1]"
      }`}
    >
      <span>{children}</span>
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

function ActionPill({
  variant,
  children,
}: {
  variant: "primary" | "ghost";
  children: React.ReactNode;
}) {
  if (variant === "ghost") {
    return (
      <button
        type="button"
        className="rounded-2xl border border-transparent px-5 py-3 text-sm font-semibold text-[#4f39f6] transition-colors hover:text-[#2f23a8]"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="rounded-2xl border border-[#101322] bg-[#101322] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-28px_rgba(12,12,24,0.45)]"
    >
      {children}
    </button>
  );
}

function ActiveFilter({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl border border-[#4f39f6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#4f39f6]">
      {label}
      <X className="h-4 w-4" />
    </span>
  );
}

interface CollegeCardProps {
  name: string;
  location: string;
  programs: string;
  mentors: number;
  reviews: number;
  description: string;
}

function CollegeCard({
  name,
  location,
  programs,
  mentors,
  reviews,
  description,
}: CollegeCardProps) {
  return (
    <article className="flex h-full flex-col gap-6 rounded-3xl border border-[#e5e7ef] bg-[#f5f5f5] p-6 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_40px_110px_-52px_rgba(15,23,42,0.45)]">
      <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-[#111]">
        <Image
          src="/college-placeholder.svg"
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover opacity-75"
        />
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-[#9e9e9e]">
        <StarRow />
        <span>{reviews} Reviews</span>
      </div>

      <h3 className="text-[1.45rem] font-semibold leading-snug tracking-[-0.02em] text-[#11121b]">
        {name}
      </h3>

      <p className="text-sm leading-relaxed text-[#5b5f72]">{description}</p>

      <div className="flex flex-col gap-3 text-sm font-medium text-[#575d71]">
        <InfoRow icon={<MapPin className="h-4 w-4" />} label={location} />
        <InfoRow icon={<BookOpen className="h-4 w-4" />} label={programs} />
        <InfoRow
          icon={<Users2 className="h-4 w-4" />}
          label={`${mentors} Mentors Available`}
        />
      </div>
    </article>
  );
}

function InfoRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-3">
      <span className="text-[#4f39f6]">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

function StarRow() {
  return (
    <span className="flex items-center gap-1 text-[#9747ff]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-4 w-4" fill="currentColor" />
      ))}
    </span>
  );
}

