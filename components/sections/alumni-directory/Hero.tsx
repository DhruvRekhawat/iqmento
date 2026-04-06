import Image from "next/image";

import { Section } from "@/components/shared/section";
import { SearchBar } from "@/components/shared/search-bar";
import type { AlumniProfile } from "@/data/alumni-profiles";
import type { CollegeProfile } from "@/data/college-profiles";

interface AlumniDirectoryHeroProps {
  alumni?: AlumniProfile[];
  colleges?: CollegeProfile[];
}

export function AlumniDirectoryHero({ alumni = [], colleges = [] }: AlumniDirectoryHeroProps) {
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
    <Section id="alumni-directory-hero" variant="hero" spacing="loose" bleed className="h-fit">
      <div className="relative overflow-hidden rounded-[16px] border border-[#b0b0b0] bg-white px-6 pb-0 pt-16 sm:px-10 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(228,231,244,0.35)_1px,transparent_1px),linear-gradient(180deg,rgba(228,231,244,0.35)_1px,transparent_1px)] bg-size-[92px_92px]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-balance text-[3.25rem] font-semibold leading-[0.92] tracking-[-0.05em] text-[#060510] sm:text-[3.75rem] lg:text-[4rem]">
              Find Your{" "}
              <span className="bg-linear-to-r from-[#6260FF] via-[#7C6CFF] to-[#4B73FF] bg-clip-text text-transparent">
                Alumni
              </span>{" "}
              Mentor
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-[#55596D] sm:text-xl">
              Get honest, 1:1 guidance from people who&apos;ve been exactly where you want to go.
            </p>
          </div>

          <div className="relative z-50 w-full max-w-xl">
            <SearchBar
              placeholder="Search colleges or mentors…"
              colleges={collegesForSearch}
              alumni={alumniForSearch}
              className="group rounded-full border border-[#D7DBEF] bg-white/70 px-6 py-4 text-base text-[#717799] shadow-[0_30px_100px_rgba(37,44,86,0.12)] backdrop-blur-sm transition focus-within:border-[#9AA4FF] focus-within:text-[#3D4194]"
            />
          </div>
        </div>

        <div className="relative mt-0 flex items-end justify-center sm:mt-0 sm:-translate-y-24 ">
          <div className="relative w-full">
            <Image
              src="/alumunus/hero-one.png"
              alt="Students and mentors in a workshop"
              width={1200}
              height={1640}
              priority
              className="relative z-10 h-auto w-full rounded-[28px] object-cover scale-110"
            />

            <Image
              src="/alumunus/hero-frame.png"
              alt=""
              width={1200}
              height={520}
              priority
              className="absolute -bottom-10 left-1/2 z-0 h-auto w-[105%] max-w-none -translate-x-1/2 object-cover"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

