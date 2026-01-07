import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import type { StrapiAlumni } from "@/types/alumni";
import { mapStrapiAlumniToAlumniProfile } from "@/lib/strapi-mappers";

interface AllAlumniGridProps {
  alumni: StrapiAlumni[];
}

export function AllAlumniGrid({ alumni }: AllAlumniGridProps) {
  if (alumni.length === 0) {
    return null;
  }

  const profiles = alumni.map((alum) => mapStrapiAlumniToAlumniProfile(alum));

  return (
    <section className="bg-white py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <header className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-pretty text-4xl font-medium leading-tight tracking-[-0.045em] text-[#12131c] sm:text-[2.85rem]">
            All Alumni Mentors
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#55586c] sm:text-lg">
            Browse our complete directory of verified alumni mentors ready to guide you through your journey.
          </p>
        </header>

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
      </Container>
    </section>
  );
}

