import type { ReactNode } from "react";
import { MapPin, Users2 } from "lucide-react";
import Image from "next/image";

import { Section } from "@/components/shared/section";
import type { CollegeProfile } from "@/data/college-profiles";

interface College {
  name: string;
  description: string;
  mentors: number;
  reviews: number;
  location: string;
  image: string;
}

interface FeaturedCollegesProps {
  colleges: CollegeProfile[];
}

export function FeaturedColleges({ colleges }: FeaturedCollegesProps) {
  const mappedColleges = colleges.map((college) => ({
    name: college.name,
    description: college.hero.tagline || college.hero.description || "",
    mentors: college.alumni.length,
    reviews: college.reviews.length,
    location: college.location,
    image: college.heroImage || "/college-placeholder.svg",
  }));

  const MOST_BOOKED = mappedColleges.slice(0, 3);
  const RISING = mappedColleges.slice(3, 6);

  return (
    <Section
      id="featured-colleges"
      bleed
      spacing="loose"
      className="bg-white py-16 sm:py-24 md:py-28"
    >
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10 sm:gap-16 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col items-center gap-3 sm:gap-4 text-center">
          <h2 className="text-pretty text-[2.1rem] sm:text-[clamp(2.8rem,2.4vw+2.2rem,4.25rem)] font-semibold leading-none tracking-[-0.05em] text-[#171717]">
            Featured Colleges
          </h2>
          <p className="max-w-xl text-sm sm:text-base leading-[1.7] text-[#686868] sm:text-lg">
            See where students are connecting the most this week.
          </p>
        </header>

        <CollegeGroup title="Most Booked Mentors This Week" colleges={MOST_BOOKED} />
        <CollegeGroup title="Rising Colleges" colleges={RISING} />
      </div>
    </Section>
  );
}

function InfoRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 sm:gap-3">
      <span className="text-[#6c6c6c] shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </span>
  );
}

function StarRow() {
  return (
    <span className="flex items-center gap-0.5 sm:gap-1 text-[#7157ff]">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width="15"
          height="15"
          viewBox="0 0 18 18"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="sm:w-[18px] sm:h-[18px]"
        >
          <path d="M8.227 1.812c.3-.8 1.246-.8 1.546 0l1.253 3.342a.9.9 0 0 0 .636.57l3.512.8c.844.193 1.017.97.385 1.524l-2.684 2.374a.9.9 0 0 0-.268.85l.684 3.467c.164.834-.48 1.294-1.222.96l-3.172-1.429a.9.9 0 0 0-.716 0L4.309 15.7c-.74.334-1.386-.126-1.221-.96l.683-3.467a.9.9 0 0 0-.268-.85L.819 8.048c-.632-.554-.459-1.331.385-1.524l3.512-.8a.9.9 0 0 0 .636-.57l1.253-3.342Z" />
        </svg>
      ))}
    </span>
  );
}

function CollegeGroup({ title, colleges }: { title: string; colleges: College[] }) {
  return (
    <section className="flex flex-col gap-6 sm:gap-10">
      <h3 className="text-center text-[1.35rem] sm:text-[clamp(1.9rem,1.4vw+1.5rem,2.4rem)] font-medium tracking-[-0.02em] text-[#5f5f5f]">
        {title}
      </h3>
      {/* 1 col on mobile, 2 col on md, 3 col on lg — desktop unchanged */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {colleges.map((college) => (
          <CollegeCard key={college.name} {...college} />
        ))}
      </div>
    </section>
  );
}

function CollegeCard({
  name,
  description,
  mentors,
  reviews,
  location,
  image,
}: College) {
  return (
    <article className="group relative flex h-full flex-col gap-4 sm:gap-5 overflow-hidden rounded-[16px] sm:rounded-[24px] border border-[#e6e6e6] bg-white p-4 sm:p-6 shadow-[0_28px_90px_rgba(31,31,51,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_36px_110px_rgba(31,31,51,0.12)]">
      <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.92)_0%,rgba(245,245,245,0.9)_45%,rgba(255,255,255,0.98)_100%)] opacity-70" />
      <div className="relative z-10 flex h-full flex-col gap-4 sm:gap-5">
        <div className="relative h-44 sm:h-36 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#f0f0f0]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="object-cover"
          />
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#7a7a7a]">
          <StarRow />
          <span>{reviews} Reviews</span>
        </div>

        <h4 className="text-[1.1rem] sm:text-[1.35rem] font-semibold leading-tight tracking-[-0.01em] text-[#202020]">
          {name}
        </h4>

        <p className="text-xs sm:text-sm leading-relaxed text-[#737373] line-clamp-3 sm:line-clamp-none">
          {description}
        </p>

        <div className="mt-auto flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-[#7d7d7d]">
          <InfoRow icon={<MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />} label={location} />
          <InfoRow icon={<Users2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />} label={`${mentors} Mentors Available`} />
        </div>
      </div>
    </article>
  );
}