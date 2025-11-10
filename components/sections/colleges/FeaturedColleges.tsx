import type { ReactNode } from "react";
import { MapPin, Users2 } from "lucide-react";
import Image from "next/image";

import { Section } from "@/components/shared/section";

interface College {
  name: string;
  description: string;
  mentors: number;
  reviews: number;
  location: string;
  image: string;
}

const MOST_BOOKED: College[] = [
  {
    name: "Indian Institute of Technology, Delhi",
    location: "New Delhi, India",
    description:
      "Engineering meets innovation — get mentored by alumni now leading at Google and Tesla.",
    mentors: 15,
    reviews: 42,
    image: "/college-placeholder.svg",
  },
  {
    name: "Indian Institute of Management, Bangalore",
    location: "Bengaluru, India",
    description:
      "Decode essays, interviews, and campus life with mentors who cracked the IIM journey.",
    mentors: 18,
    reviews: 38,
    image: "/college-placeholder.svg",
  },
  {
    name: "Georgia Institute of Technology",
    location: "Atlanta, USA",
    description:
      "Navigate international admissions, co-ops, and STEM pathways with alumni across the US.",
    mentors: 12,
    reviews: 27,
    image: "/college-placeholder.svg",
  },
];

const RISING: College[] = [
  {
    name: "BITS Pilani",
    location: "Pilani, India",
    description:
      "Understand dual degrees, practice schools, and the startup culture from BITSians themselves.",
    mentors: 11,
    reviews: 26,
    image: "/college-placeholder.svg",
  },
  {
    name: "University of Toronto",
    location: "Toronto, Canada",
    description:
      "Plan your global undergraduate journey with clarity on research tracks, housing, and co-ops.",
    mentors: 9,
    reviews: 22,
    image: "/college-placeholder.svg",
  },
  {
    name: "Ashoka University",
    location: "Sonipat, India",
    description:
      "Explore interdisciplinary majors, the YIF pathway, and scholarships with current students.",
    mentors: 7,
    reviews: 18,
    image: "/college-placeholder.svg",
  },
];

export function FeaturedColleges() {
  return (
    <Section
      id="featured-colleges"
      bleed
      spacing="loose"
      className="relative overflow-hidden bg-[#010101] py-24 text-white sm:py-28"
    >
      <BackgroundLines />

      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-16 px-4 sm:px-6 lg:px-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-pretty text-[clamp(3rem,3vw+2rem,4.5rem)] font-medium leading-[0.9] tracking-[-0.04em]">
            Featured Colleges
          </h2>
          <p className="max-w-2xl text-lg leading-[1.6] text-[#a1a1a1] sm:text-xl">
            See where students are connecting the most this week.
          </p>
        </header>

        <CollegeGroup title="Most Booked Mentors This Week" colleges={MOST_BOOKED} />
        <CollegeGroup title="Rising Colleges" colleges={RISING} />
      </div>
    </Section>
  );
}

function CollegeGroup({ title, colleges }: { title: string; colleges: College[] }) {
  return (
    <section className="flex flex-col gap-10">
      <h3 className="text-center text-[clamp(2rem,1.6vw+1.6rem,2.75rem)] font-medium tracking-[-0.03em] text-[#a9a9a9]">
        {title}
      </h3>
      <div className="grid gap-10 lg:grid-cols-3">
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
    <article className="flex h-full flex-col gap-6 rounded-[24px] border border-white/10 bg-[#242424] p-6 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.65)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_40px_140px_-50px_rgba(79,57,246,0.45)]">
      <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-[#181818]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover opacity-70"
        />
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-[#9e9e9e]">
        <StarRow />
        <span>{reviews} Reviews</span>
      </div>

      <h4 className="text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-white">
        {name}
      </h4>

      <p className="text-sm leading-relaxed text-[#bebebe]">{description}</p>

      <div className="mt-auto flex flex-col gap-3 text-sm font-medium text-[#c2c2c2]">
        <InfoRow icon={<MapPin className="h-4 w-4" />} label={location} />
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
      <span className="text-[#9747ff]">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

function StarRow() {
  return (
    <span className="flex items-center gap-1 text-[#9747ff]">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.227 1.812c.3-.8 1.246-.8 1.546 0l1.253 3.342a.9.9 0 0 0 .636.57l3.512.8c.844.193 1.017.97.385 1.524l-2.684 2.374a.9.9 0 0 0-.268.85l.684 3.467c.164.834-.48 1.294-1.222.96l-3.172-1.429a.9.9 0 0 0-.716 0L4.309 15.7c-.74.334-1.386-.126-1.221-.96l.683-3.467a.9.9 0 0 0-.268-.85L.819 8.048c-.632-.554-.459-1.331.385-1.524l3.512-.8a.9.9 0 0 0 .636-.57l1.253-3.342Z" />
        </svg>
      ))}
    </span>
  );
}

function BackgroundLines() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(151,71,255,0.2)_0%,transparent_55%),radial-gradient(circle_at_0%_100%,rgba(79,57,246,0.2)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute left-0 right-0 top-[360px] h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 top-[620px] h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 top-[880px] h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
    </>
  );
}

