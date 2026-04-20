"use client";

import Image from "next/image";

import { Section } from "@/components/shared/section";
import { SearchBar } from "@/components/shared/search-bar";
import type { AlumniProfile } from "@/data/alumni-profiles";
import type { CollegeProfile } from "@/data/college-profiles";

interface AlumniDirectoryHeroProps {
  alumni?: AlumniProfile[];
  colleges?: CollegeProfile[];
}

export function AlumniDirectoryHero({
  alumni = [],
  colleges = [],
}: AlumniDirectoryHeroProps) {
  // Transform alumni data for search
  const alumniForSearch = alumni.map((profile) => ({
    slug: profile.slug || "",
    name: profile.name || "",
    location: profile.location || "",
    headline: profile.headline || "",
    image: profile.image || "",
  }));

  // Transform colleges data for search
  const collegesForSearch = colleges.map((profile) => ({
    slug: profile.slug || "",
    name: profile.name || "",
    location: profile.location || "",
    heroImage: profile.heroImage || null,
  }));

  return (
    <Section
      id="alumni-directory-hero"
      variant="hero"
      spacing="loose"
      bleed
      className="h-fit"
    >
      <div className="relative overflow-hidden rounded-[16px] border border-[#b0b0b0] bg-white px-6 pb-0 pt-16 sm:px-10 sm:pt-20">
        {/* Grid Background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(228,231,244,0.35)_1px,transparent_1px),linear-gradient(180deg,rgba(228,231,244,0.35)_1px,transparent_1px)] bg-size-[92px_92px]" />

        {/* Content */}
        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-balance text-[2.2rem] sm:text-[3.25rem] lg:text-[4rem] font-semibold leading-[0.95] tracking-[-0.05em] text-[#060510]">
              Find Your{" "}
              <span className="bg-linear-to-r from-[#6260FF] via-[#7C6CFF] to-[#4B73FF] bg-clip-text text-transparent">
                Alumni
              </span>{" "}
              Mentor
            </h1>

            <p className="max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-[#55596D]">
              Get honest, 1:1 guidance from people who&apos;ve been exactly where you want to go.
            </p>
          </div>

          {/* Search */}
          <div className="relative z-50 w-full max-w-xl">
            <SearchBar
              placeholder="Search colleges or mentors…"
              colleges={collegesForSearch}
              alumni={alumniForSearch}
              searchType="alumni"   // ✅ ADD THIS LINE
              className="group rounded-full border border-[#D7DBEF] bg-white/70 px-5 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-[#717799] shadow-[0_30px_100px_rgba(37,44,86,0.12)] backdrop-blur-sm transition focus-within:border-[#9AA4FF] focus-within:text-[#3D4194]"
            />
          </div>
        </div>

        {/* Image Section */}
        <div className="relative mt-6 flex items-end justify-center sm:mt-0 sm:-translate-y-24">
          <div className="relative w-full">
            
            {/* Main Image */}
            <Image
              src="/alumunus/hero-one.png"
              alt="Students and mentors in a workshop"
              width={1200}
              height={1640}
              priority
              className="relative z-10 w-full rounded-[28px] object-cover h-[280px] sm:h-auto scale-100 sm:scale-110"
            />

            {/* Bottom Frame */}
            <Image
              src="/alumunus/hero-frame.png"
              alt=""
              width={1200}
              height={520}
              priority
              className="absolute -bottom-6 left-1/2 z-0 w-[110%] max-w-none -translate-x-1/2 object-cover sm:-bottom-10"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}