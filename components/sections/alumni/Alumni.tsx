import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { getAlumni } from "@/lib/strapi";
import { mapStrapiAlumniToMentorCard } from "@/lib/strapi-mappers";

type MentorCardContent = {
  slug: string;
  name: string;
  role: string;
  experience?: string;
  company?: string;
  image: string;
};

export async function Alumni() {
  let mentors: MentorCardContent[] = [];

  try {
    const alumniResponse = await getAlumni({
      populate: ["profile"],
      filters: {
        publishedAt: { $notNull: true },
      },
      pagination: {
        pageSize: 20,
      },
      sort: ["isFeatured:desc", "createdAt:desc"],
    });

    if (alumniResponse?.data && Array.isArray(alumniResponse.data)) {
      mentors = alumniResponse.data.map(mapStrapiAlumniToMentorCard);
    } else {
      console.warn("Alumni API returned unexpected format:", alumniResponse);
    }
  } catch (error) {
    console.error("Error fetching alumni:", error);
    // Log more details in development
    if (process.env.NODE_ENV === 'development') {
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
    // Fallback to empty array
  }
  return (
    <Section
      id="alumni"
      variant="hero"
      spacing="loose"
      bleed
      className="text-white"
    >
      <div className="relative isolate flex flex-col gap-12 overflow-hidden rounded-[36px] bg-linear-to-b from-white via-white to-[#c9b9ff] px-8 py-16 text-foreground sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,88,255,0.18)_0%,rgba(255,255,255,0)_62%)]" />

        <header className="relative z-10 flex flex-col items-center gap-4 text-center">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl md:text-[3.25rem]">
            Your{" "}
            <span className="bg-linear-to-r from-[#6D4AFF] via-[#715BFF] to-[#4F69FF] bg-clip-text text-transparent">
              Alumnus
            </span>
            <br className="hidden sm:block" />
            <span className="block sm:inline">all at one place</span>
          </h2>
        </header>

        <div className="relative z-10">
          {mentors.length > 0 ? (
            <div className="marquee-mask overflow-hidden bg-white/60 p-6 shadow-[0_40px_120px_rgba(110,70,255,0.16)] backdrop-blur-xl">
              <div className="marquee-track gap-6">
                {[...mentors, ...mentors].map((mentor, idx) => (
                  <MentorCard key={`${mentor.slug}-${idx}`} {...mentor} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white/60 p-8 text-center text-black/60">
              <p className="text-sm">No alumni data available. Please check your API configuration.</p>
              {process.env.NODE_ENV === 'development' && (
                <p className="mt-2 text-xs">
                  Make sure BACKEND_BASE_URL is set to http://localhost:1337
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

interface MentorCardProps {
  slug: string;
  name: string;
  role: string;
  experience?: string;
  company?: string;
  image: string;
}

function MentorCard({
  slug,
  name,
  role,
  experience,
  company,
  image,
}: MentorCardProps) {
  return (
    <article className="relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(16,19,34,0.06)] bg-white shadow-[0_24px_60px_rgba(26,30,61,0.08)] transition-transform duration-300 hover:-translate-y-2">
      <div className="relative h-44 overflow-hidden rounded-[24px] rounded-b-none">
        <Image
          src={image}
          alt={name}
          fill
          sizes="280px"
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        <div className="flex flex-col gap-1.5 text-left">
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#17181F]">
            {name}
          </h3>
          <p className="text-sm leading-relaxed text-[#555A71]">{role}</p>
          {experience ? (
            <p className="text-sm font-medium text-[#383C52]">{experience}</p>
          ) : null}
        </div>

        {company ? (
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[rgba(16,19,34,0.08)] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5a64ff]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#5A64FF]" />
            {company}
          </div>
        ) : null}

        <Button
          asChild
          variant="accent"
          size="md"
          className="mt-auto h-11 w-full rounded-full text-sm font-semibold"
        >
          <Link href={`/alumini/${slug}`}>Talk to Alumni</Link>
        </Button>
      </div>
    </article>
  );
}

