import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import type { StrapiAlumni } from "@/types/alumni";
import { mapStrapiAlumniToAlumniProfile } from "@/lib/strapi-mappers";

interface OtherAlumniSectionProps {
  currentSlug: string;
  otherAlumni?: StrapiAlumni[];
}

export function OtherAlumniSection({ currentSlug, otherAlumni = [] }: OtherAlumniSectionProps) {
  const others = otherAlumni
    .map(alum => mapStrapiAlumniToAlumniProfile(alum))
    .filter((profile) => profile.slug !== currentSlug)
    .slice(0, 5);

  return (
    <section className="bg-black py-24 text-white sm:py-32">
      <Container className="flex flex-col gap-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-pretty text-white text-4xl font-medium leading-tight tracking-[-0.045em] sm:text-[2.9rem]">
            Other Alumni
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Explore more mentors from IITs, NIDs, IIMs, global universities, and breakout startups.
          </p>
        </header>

        <div className="relative">

          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-8">
              {[...others, ...others].map((profile, index) => (
                <Link
                  key={`${profile.slug}-${index}`}
                  href={`/alumini/${profile.slug}`}
                  className="flex w-[320px] shrink-0 flex-col gap-5 rounded-[28px] border border-white/10 bg-white/10 p-6 text-white shadow-[0_38px_110px_-80px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 320px, 340px"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">
                      {profile.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                      {profile.location}
                    </p>
                    <p className="text-sm leading-relaxed text-white/70">{profile.headline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


