import Image from "next/image";
import { Briefcase, Clock } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import type { AlumniProfile } from "@/data/alumni-profiles";
import { BookCtaLink } from "@/components/booking/BookCtaLink";
import { QuestionDialog } from "@/components/question-dialog";

interface AlumniProfileHeroProps {
  profile: AlumniProfile;
}

export function AlumniProfileHero({ profile }: AlumniProfileHeroProps) {
  const experience = profile.stats.find((stat) =>
    stat.label.toLowerCase().includes("experience")
  );

  return (
    <section className="bg-white py-24 text-[#0E0F1C] sm:py-28 sm:pb-0 pb-0">
      <Container className="flex flex-col gap-12">
        <div className="relative z-0 isolate overflow-hidden rounded-[16px] border border-[#0F0F2F] bg-[#070516] px-6 py-10 text-white sm:px-6 sm:py-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(116,84,255,0.7)_0%,rgba(35,20,102,0.15)_40%,rgba(13,10,41,0.8)_90%)]" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="relative mx-auto flex w-full max-w-[220px] shrink-0 items-center justify-center lg:mx-0 lg:max-w-[240px]">
              <div className="relative aspect-square w-full overflow-hidden rounded-[20px] border border-white/20 bg-white/10 ">
                <Image
                  src={profile.heroImage}
                  alt={profile.name}
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-8">
              <div className="flex flex-col gap-6">
                <h1 className="text-pretty text-white text-[2.4rem] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[2.8rem]">
                  {profile.name}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white/80 sm:text-base">
                  <span className="inline-flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-highlight" />
                    {profile.headline}
                  </span>
                  {experience ? (
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-5 w-5 text-highlight" />
                      {experience.value}
                    </span>
                  ) : null}
                </div>

                <p className="max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                  {profile.heroTagline}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  asChild
                  variant="accent"
                  size="lg"
                  className="h-[48px] min-w-[160px] px-7 text-sm font-semibold shadow-[0_28px_70px_rgba(99,73,246,0.45)]"
                >
                  <BookCtaLink href={`/book/${profile.slug}/s_1`}>View Pricing</BookCtaLink>
                </Button>
                <QuestionDialog
                  educatorSlug={profile.slug}
                  triggerSize="lg"
                  triggerClassName="h-[48px] min-w-[160px] border-white/25 bg-transparent px-7 text-sm font-semibold text-white/90 hover:bg-white/10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 text-base leading-relaxed text-[#373A53] sm:text-lg">
          {profile.heroSummary.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </section>
  );
}

