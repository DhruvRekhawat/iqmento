import Image from "next/image";
import { MapPin } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import type { AlumniProfile } from "@/data/alumni-profiles";

interface AlumniProfileHeroProps {
  profile: AlumniProfile;
}

export function AlumniProfileHero({ profile }: AlumniProfileHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(148,126,255,0.32)_0%,rgba(5,5,5,0.95)_55%)]" />
      <Container className="relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
          <div className="flex flex-col gap-10">
            <div className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
              {profile.availability}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-pretty text-[3rem] font-medium leading-[0.92] tracking-[-0.05em] sm:text-[3.4rem]">
                  {profile.name}
                </h1>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                  <MapPin className="h-4 w-4 text-[#9ea9ff]" />
                  {profile.location}
                </span>
              </div>

              <p className="text-lg font-medium text-[#9ea2c5] sm:text-xl">{profile.headline}</p>
              <p className="max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
                {profile.heroTagline}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {profile.stats.map((stat) => (
                <div
                  key={`${profile.slug}-${stat.label}`}
                  className="rounded-2xl border border-white/12 bg-white/8 px-6 py-5 backdrop-blur-lg"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-base leading-relaxed text-white/75">
              {profile.heroSummary.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                asChild
                variant="accent"
                size="lg"
                className="h-[52px] min-w-[180px] rounded-full px-10 text-sm font-semibold shadow-[0_32px_70px_rgba(79,57,246,0.45)]"
              >
                <a href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Book a Session
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-[52px] min-w-[180px] rounded-full border-white/25 bg-transparent px-10 text-sm font-semibold text-white hover:bg-white/10"
              >
                <a href={profile.questionUrl} target="_blank" rel="noopener noreferrer">
                  Ask a Question
                </a>
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[520px]">
              <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_50%_100%,rgba(92,87,255,0.48)_0%,rgba(11,9,40,0.05)_70%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/5 shadow-[0_48px_160px_-90px_rgba(15,17,40,0.85)]">
                <Image
                  src={profile.heroImage}
                  alt={profile.name}
                  width={640}
                  height={760}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-white/10 p-5 text-sm leading-relaxed text-white/80 backdrop-blur-lg">
                  {profile.featuredQuote}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


