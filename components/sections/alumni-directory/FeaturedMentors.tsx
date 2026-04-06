import Image from "next/image";

import { Container } from "@/components/shared/container";
import type { AlumniProfile } from "@/data/alumni-profiles";

interface FeaturedMentorsSectionProps {
  alumni: AlumniProfile[];
}

export function FeaturedMentorsSection({ alumni }: FeaturedMentorsSectionProps) {
  // Take first 5 alumni (caller should pre-sort with featured first)
  const featured = alumni.slice(0, 5);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <header className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-pretty text-4xl font-medium leading-tight tracking-[-0.045em] text-[#12131c] sm:text-[2.85rem]">
            Meet Our Featured Mentors
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#55586c] sm:text-lg">
            Each of these mentors once faced the same questions, doubts, and dreams. Now they&apos;re ready
            to guide you through them.
          </p>
        </header>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/85 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/85 to-transparent" />

          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-8">
              {[...featured, ...featured].map((mentor, index) => (
                  <MentorCard key={`${mentor.slug}-${index}`} mentor={mentor} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function MentorCard({ mentor }: { mentor: AlumniProfile }) {
  return (
    <article className="flex w-[340px] shrink-0 flex-col gap-6 rounded-[28px] border border-[#e0e3f4] bg-[#f8f8ff] p-6 shadow-[0_36px_110px_-72px_rgba(14,16,34,0.4)] transition-transform duration-300 hover:-translate-y-2">
      <div className="relative h-60 overflow-hidden rounded-3xl border border-[#dbdffa] bg-[#111315]">
        <Image
          src={mentor.image}
          alt={mentor.name}
          fill
          className="object-cover object-center opacity-95"
          sizes="(max-width: 768px) 340px, 360px"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#141626]">{mentor.name}</h3>
          <p className="text-sm font-medium uppercase tracking-[0.26em] text-[#7a7f95]">
            {mentor.location}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-[#55586c]">{mentor.headline}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {mentor.focusAreas.slice(0, 3).map((focus) => (
          <span
            key={`${mentor.slug}-${focus.title}`}
            className="rounded-full border border-[#d7dbed] bg-white px-3 py-1.5 text-xs font-medium text-[#4f39f6]"
          >
            {focus.title}
          </span>
        ))}
      </div>
    </article>
  );
}


