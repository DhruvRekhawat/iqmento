"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { BookOpen, ChevronDown, MapPin, Star, Users2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/shared/section";
import type { StrapiCollege } from "@/types/college";
import { mapStrapiCollegeToCollegeProfile } from "@/lib/strapi-mappers";

const COLLEGE_TYPES = [
  "IIT",
  "NIT",
  "IIM",
  "NID",
  "Medical",
  "Law",
  "Arts",
  "Commerce",
  "Engineering",
  "Design",
  "Business",
  "Other",
] as const;

const COLLEGE_TIERS = ["Tier 1", "Tier 2", "Tier 3"] as const;

const RATING_OPTIONS = [
  { label: "4.5+ Stars", value: 4.5 },
  { label: "4.0+ Stars", value: 4.0 },
  { label: "3.5+ Stars", value: 3.5 },
  { label: "3.0+ Stars", value: 3.0 },
];

interface FilterState {
  collegeType: string | null;
  collegeTier: string | null;
  minRating: number | null;
  location: string | null;
}

interface CollegesExplorerProps {
  colleges: StrapiCollege[];
}

export function CollegesExplorer({ colleges }: CollegesExplorerProps) {
  const [filters, setFilters] = useState<FilterState>({
    collegeType: null,
    collegeTier: null,
    minRating: null,
    location: null,
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Extract unique locations from colleges
  const locations = useMemo(() => {
    const locationSet = new Set<string>();
    colleges.forEach((college) => {
      if (college.location) {
        // Extract city from location (e.g., "Ahmedabad, Gujarat" -> "Ahmedabad")
        const city = college.location.split(",")[0]?.trim();
        if (city) locationSet.add(city);
      }
    });
    return Array.from(locationSet).sort();
  }, [colleges]);

  // Filter colleges based on active filters
  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      const profile = mapStrapiCollegeToCollegeProfile(college);

      // Filter by college type
      if (filters.collegeType && college.collegeType !== filters.collegeType) {
        return false;
      }

      // Filter by college tier
      if (filters.collegeTier && college.collegeTier !== filters.collegeTier) {
        return false;
      }

      // Filter by rating
      if (filters.minRating !== null && (college.rating || 0) < filters.minRating) {
        return false;
      }

      // Filter by location
      if (filters.location) {
        const collegeCity = profile.location.split(",")[0]?.trim().toLowerCase();
        const filterCity = filters.location.toLowerCase();
        if (collegeCity !== filterCity) {
          return false;
        }
      }

      return true;
    });
  }, [colleges, filters]);

  // Generate college cards from filtered colleges
  const collegeCards = useMemo(() => {
    return filteredColleges.map((college) => {
      const profile = mapStrapiCollegeToCollegeProfile(college);
      const programNames = profile.courses.map((course) => course.name);

      return {
        slug: profile.slug,
        name: profile.name,
        location: profile.location,
        programs:
          programNames.length > 0
            ? programNames.slice(0, 3).join(", ")
            : "Programs information coming soon",
        mentors: profile.alumni.length,
        reviews: profile.reviews.length,
        description: profile.hero.tagline,
        image: profile.heroImage || "/college-placeholder.svg",
      };
    });
  }, [filteredColleges]);

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const active: Array<{ key: string; label: string; value: string }> = [];
    if (filters.collegeType) {
      active.push({ key: "collegeType", label: "Type", value: filters.collegeType });
    }
    if (filters.collegeTier) {
      active.push({ key: "collegeTier", label: "Tier", value: filters.collegeTier });
    }
    if (filters.minRating !== null) {
      const ratingLabel = RATING_OPTIONS.find((opt) => opt.value === filters.minRating)?.label || `${filters.minRating}+ Stars`;
      active.push({ key: "minRating", label: "Rating", value: ratingLabel });
    }
    if (filters.location) {
      active.push({ key: "location", label: "Location", value: filters.location });
    }
    return active;
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: string | number | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setOpenDropdown(null);
  };

  const handleRemoveFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      collegeType: null,
      collegeTier: null,
      minRating: null,
      location: null,
    });
    setOpenDropdown(null);
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <Section id="colleges-explorer" className="bg-white">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="College Type"
              isOpen={openDropdown === "collegeType"}
              onToggle={() => setOpenDropdown(openDropdown === "collegeType" ? null : "collegeType")}
              selectedValue={filters.collegeType}
              options={COLLEGE_TYPES.map((type) => ({ label: type, value: type }))}
              onSelect={(value) => handleFilterChange("collegeType", value)}
            />

            <FilterDropdown
              label="Location"
              isOpen={openDropdown === "location"}
              onToggle={() => setOpenDropdown(openDropdown === "location" ? null : "location")}
              selectedValue={filters.location}
              options={locations.map((loc) => ({ label: loc, value: loc }))}
              onSelect={(value) => handleFilterChange("location", value)}
            />

            <FilterDropdown
              label="Ratings"
              isOpen={openDropdown === "ratings"}
              onToggle={() => setOpenDropdown(openDropdown === "ratings" ? null : "ratings")}
              selectedValue={filters.minRating !== null ? String(filters.minRating) : null}
              options={RATING_OPTIONS.map((opt) => ({ label: opt.label, value: String(opt.value) }))}
              onSelect={(value) => handleFilterChange("minRating", value ? parseFloat(value) : null)}
            />

            <FilterDropdown
              label="College Tier"
              isOpen={openDropdown === "collegeTier"}
              onToggle={() => setOpenDropdown(openDropdown === "collegeTier" ? null : "collegeTier")}
              selectedValue={filters.collegeTier}
              options={COLLEGE_TIERS.map((tier) => ({ label: tier, value: tier }))}
              onSelect={(value) => handleFilterChange("collegeTier", value)}
            />

            {hasActiveFilters && (
              <ActionPill variant="ghost" onClick={handleClearFilters}>
                Clear filters
              </ActionPill>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-3">
              {activeFilters.map((filter) => (
                <ActiveFilter
                  key={filter.key}
                  label={`${filter.label}: ${filter.value}`}
                  onRemove={() => handleRemoveFilter(filter.key as keyof FilterState)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {collegeCards.length > 0 ? (
            collegeCards.map((college) => (
              <CollegeCard key={college.slug} {...college} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-[#5b5f72]">No colleges found matching your filters.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-[#4f39f6] hover:text-[#2f23a8] font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

interface FilterDropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedValue: string | null;
  options: Array<{ label: string; value: string }>;
  onSelect: (value: string | null) => void;
}

function FilterDropdown({
  label,
  isOpen,
  onToggle,
  selectedValue,
  options,
  onSelect,
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isActive = selectedValue !== null;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          onToggle();
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onToggle]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "border-[#4f39f6] bg-[#edeaff] text-[#2f23a8]"
            : "border-[#d7dae2] bg-white text-[#535353] hover:border-[#b9bed1]"
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 min-w-[200px] rounded-2xl border border-[#e5e7ef] bg-white shadow-[0_28px_70px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto p-2">
            <button
              type="button"
              onClick={() => onSelect(null)}
              className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${
                selectedValue === null
                  ? "bg-[#edeaff] text-[#2f23a8] font-medium"
                  : "hover:bg-[#f5f5f5] text-[#535353]"
              }`}
            >
              All {label}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${
                  selectedValue === option.value
                    ? "bg-[#edeaff] text-[#2f23a8] font-medium"
                    : "hover:bg-[#f5f5f5] text-[#535353]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActionPill({
  variant,
  children,
  onClick,
}: {
  variant: "primary" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
}) {
  if (variant === "ghost") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-2xl border border-transparent px-5 py-3 text-sm font-semibold text-[#4f39f6] transition-colors hover:text-[#2f23a8]"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-[#101322] bg-[#101322] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-28px_rgba(12,12,24,0.45)]"
    >
      {children}
    </button>
  );
}

function ActiveFilter({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-2xl border border-[#4f39f6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#4f39f6] transition-colors hover:bg-[#edeaff]"
    >
      {label}
      <X className="h-4 w-4" />
    </button>
  );
}

interface CollegeCardProps {
  slug: string;
  name: string;
  location: string;
  programs: string;
  mentors: number;
  reviews: number;
  description: string;
  image: string;
}

function CollegeCard({
  slug,
  name,
  location,
  programs,
  mentors,
  reviews,
  description,
  image,
}: CollegeCardProps) {
  return (
    <Link
      href={`/colleges/${slug}`}
      className="group flex h-full flex-col rounded-3xl transition-transform duration-300 hover:-translate-y-2"
    >
      <article className="flex h-full flex-col gap-6 rounded-3xl border border-[#e5e7ef] bg-[#f5f5f5] p-6 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.45)] transition-shadow duration-300 group-hover:shadow-[0_40px_110px_-52px_rgba(15,23,42,0.45)]">
        <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-[#111]">
          <Image
            src={image}
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

        <h3 className="text-[1.45rem] font-semibold leading-snug tracking-[-0.02em] text-[#11121b] group-hover:text-[#2f23a8]">
          {name}
        </h3>

        <p className="text-sm leading-relaxed text-[#5b5f72]">{description}</p>

        <div className="mt-auto flex flex-col gap-3 text-sm font-medium text-[#575d71]">
          <InfoRow icon={<MapPin className="h-4 w-4" />} label={location} />
          <InfoRow icon={<BookOpen className="h-4 w-4" />} label={programs} />
          <InfoRow
            icon={<Users2 className="h-4 w-4" />}
            label={`${mentors} Mentors Available`}
          />
        </div>

        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f39f6]">
          Explore {name}
          <ChevronDown className="h-4 w-4 -rotate-90 transition-transform group-hover:translate-x-0.5" />
        </span>
      </article>
    </Link>
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

