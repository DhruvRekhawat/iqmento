import Image from "next/image";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import type { CollegeProfile } from "@/data/college-profiles";

interface AlumniShowcaseProps {
  alumni: CollegeProfile["alumni"];
  shortName?: string;
}

export function AlumniShowcase({ alumni, shortName }: AlumniShowcaseProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(151,71,255,0.42)_0%,rgba(5,5,5,0.95)_65%)]" />
      <Container className="relative z-10 flex flex-col gap-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-pretty text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-[2.85rem]">
            Alumni stories from {shortName ?? "this campus"}
          </h2>
          <p className="max-w-xl text-base text-white/65 sm:text-lg">
            Verified mentors spanning product, strategy, research, and innovation roles worldwide.
          </p>
        </header>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#050505] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-[#050505] to-transparent" />

          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-6">
              {[...alumni, ...alumni].map((mentor, index) => (
                <MentorCard key={`${mentor.name}-${index}`} mentor={mentor} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function MentorCard({ mentor }: { mentor: CollegeProfile["alumni"][number] }) {
  return (
    <article className="relative flex w-[290px] shrink-0 flex-col gap-5 rounded-[28px] border border-white/12 bg-white/10 p-6 shadow-[0_35px_90px_-60px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-2 sm:w-[320px]">
      <div className="relative h-44 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
        <Image
          src={mentor.image}
          alt={mentor.name}
          fill
          sizes="(max-width: 768px) 290px, 320px"
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-col gap-3 text-left">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">{mentor.name}</h3>
        <p className="text-sm leading-relaxed text-white/70">{mentor.role}</p>
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
          <span className="inline-flex h-2 w-2 rounded-full bg-[#b5db12]" />
          {mentor.company}
        </span>
        <Button
          variant="accent"
          size="md"
          className="mt-2 h-11 rounded-full text-sm font-semibold text-white shadow-[0_20px_50px_rgba(79,57,246,0.45)]"
        >
          Talk to Alumni
        </Button>
      </div>
    </article>
  );
}


