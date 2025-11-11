import Image from "next/image";

import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import type { CollegeProfile } from "@/data/college-profiles";

interface AlumniShowcaseProps {
  alumni: CollegeProfile["alumni"];
}

export function AlumniShowcase({ alumni }: AlumniShowcaseProps) {
  return (
    <Section
      id="alumni-showcase"
      variant="hero"
      spacing="loose"
      bleed
      className="text-white"
    >
      <div className="relative isolate flex flex-col gap-12 overflow-hidden rounded-[16px] bg-linear-to-b from-white via-white to-[#c9b9ff] px-8 py-16 text-foreground sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,88,255,0.18)_0%,rgba(255,255,255,0)_62%)]" />

        <header className="relative z-10 flex flex-col items-center gap-4 text-center">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl md:text-[3.25rem]">
            The{" "}
            <span className="bg-linear-to-r from-[#6D4AFF] via-[#715BFF] to-[#4F69FF] bg-clip-text text-transparent">
              Alumnus
            </span>
          </h2>
        </header>

        <div className="relative z-10">
          <div className="marquee-mask overflow-hidden bg-white/60 p-6 shadow-[0_40px_120px_rgba(110,70,255,0.16)] backdrop-blur-xl">
            <div className="marquee-track gap-6">
              {[...alumni, ...alumni].map((mentor, index) => (
                <MentorCard key={`${mentor.name}-${index}`} mentor={mentor} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function MentorCard({ mentor }: { mentor: CollegeProfile["alumni"][number] }) {
  return (
    <article className="relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(16,19,34,0.06)] bg-white shadow-[0_24px_60px_rgba(26,30,61,0.08)] transition-transform duration-300 hover:-translate-y-2">
      <div className="relative h-44 overflow-hidden rounded-[24px] rounded-b-none">
        <Image
          src={mentor.image}
          alt={mentor.name}
          fill
          sizes="280px"
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        <div className="flex flex-col gap-1.5 text-left">
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#17181F]">
            {mentor.name}
          </h3>
          <p className="text-sm leading-relaxed text-[#555A71]">{mentor.role}</p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[rgba(16,19,34,0.08)] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5a64ff]">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#5A64FF]" />
          {mentor.company}
        </div>

        <Button
          variant="accent"
          size="md"
          className="mt-auto h-11 w-full rounded-full text-sm font-semibold"
        >
          Talk to Alumni
        </Button>
      </div>
    </article>
  );
}

