import { Section } from "@/components/shared/section";

export function OurMission() {
  return (
    <Section
      id="our-mission"
      bleed
      spacing="loose"
      className="bg-black py-20 text-white sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-black px-8 py-20 text-center sm:px-16 lg:px-20 lg:py-24">
          <MissionBackground />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
            <h2 className="text-pretty text-[clamp(2.75rem,3vw+1.5rem,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white">
              Our{" "}
              <span className="bg-gradient-to-r from-[#6b4cff] via-[#7c63ff] to-[#7d65ff] bg-clip-text text-transparent">
                Mission
              </span>
            </h2>
            <p className="text-balance text-[clamp(1.8rem,1.4vw+1.6rem,2.75rem)] font-light leading-[1.1] tracking-[-0.04em] text-white">
              To make higher education guidance personal, transparent, and real.
            </p>
            <p className="text-lg leading-[1.6] text-white/70">
              We connect aspirants with verified students and alumni from the
              colleges they dream of — so they can learn what no brochure,
              counsellor, or ranking ever tells you.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function MissionBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_farthest-side_at_50%_125%,rgba(109,72,255,0.75)_0%,rgba(42,13,148,0.45)_45%,transparent_80%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>
    </>
  );
}