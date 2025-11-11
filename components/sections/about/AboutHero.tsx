import Image from "next/image";

import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  return (
    <Section
      id="about-hero"
      bleed
      spacing="loose"
      className="bg-[#050505] py-2 sm:py-4"
    >
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-6">
        <div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-white py-10 px-6 shadow-[0_40px_95px_-48px_rgba(0,0,0,0.65)] sm:px-6 md:px-16 lg:px-10">
          <HeroSurface />

          <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,1fr)] lg:items-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <h1 className="text-pretty text-[clamp(2.75rem,3.6vw+1.75rem,4.75rem)] font-medium leading-[0.95] tracking-[-0.04em] text-[#050505]">
                  Because the right{" "}
                  <span className="bg-linear-to-r from-[#4f39f6] via-[#6458ff] to-[#7a6cff] bg-clip-text text-transparent">
                    guidance
                  </span>{" "}
                  can change everything.
                </h1>
                <div className="flex flex-col gap-5 text-base leading-[1.65] text-[#535353] sm:text-lg sm:tracking-[-0.01em]">
                  <p>
                    It started with a simple frustration:{" "}
                    <span className="italic">
                      Why is getting into the right college so confusing — even
                      in the age of information?
                    </span>
                  </p>
                  <p>
                    Our founders went through the same struggle — endless college
                    websites, half-true coaching advice, and sleepless nights
                    scrolling through forums that never really helped.
                  </p>
                </div>
              </div>

              <Button
                variant="accent"
                size="md"
                className="h-12 w-fit rounded-full px-8 text-xs font-semibold uppercase tracking-[0.18em] shadow-none"
              >
                Learn More
              </Button>
            </div>

            <div className="relative flex h-full min-h-[340px] w-full items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[520px] overflow-hidden rounded-[24px] bg-[#f5f5f7]">
                <Image
                  src="/aboutus/hero.png"
                  alt="Mentor guiding students at IQMento"
                  width={520}
                  height={360}
                  className="h-full w-full object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 rounded-[24px] border border-black/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function HeroSurface() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(104,86,255,0.12)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(214,215,255,0.35)_1px,transparent_1px),linear-gradient(180deg,rgba(214,215,255,0.35)_1px,transparent_1px)] bg-size-[98px_98px]" />
      <div className="pointer-events-none absolute inset-x-6 inset-y-6 rounded-[28px] border border-black/6" />
    </>
  );
}


