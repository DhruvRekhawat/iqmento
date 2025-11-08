import Image from "next/image";

import { Container } from "@/components/shared/container";

const ROADMAP_STEPS = [
  {
    title: "Find Your Alumni Mentor",
    description:
      "Search by college, course, or career path. View mentor profiles with ratings, experience, and background.",
  },
  {
    title: "Book a 1:1 Call",
    description:
      "Start with a free 15-minute trial or go deeper with a paid session tailored to your needs.",
  },
  {
    title: "Get Insider Intel",
    description:
      "Ask the questions that matter—campus life, placements, professors, workload, and career scope—from someone who’s been there.",
  },
];

export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="relative overflow-hidden bg-black py-24 text-white sm:py-32"
    >
      <RoadmapBackground />

      <Container bleed>
        <div className="relative mx-auto flex w-full max-w-[1100px] flex-col items-center gap-16 px-6 text-center md:px-12">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-balance text-4xl font-medium leading-none text-white tracking-tight sm:text-5xl md:text-6xl max-w-lg">
              Your <span className="text-[#635bff]">Roadmap</span> to the Right College
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              From the first discovery call to final decisions, IQMento keeps you
              moving with clarity, confidence, and alumni-backed insights.
            </p>
          </div>

          <div className="grid w-full gap-8 md:grid-cols-3">
            {ROADMAP_STEPS.map((step, index) => (
              <article
                key={step.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-left shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-3xl transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="absolute -left-16 top-12 hidden h-px w-20 bg-linear-to-r from-transparent via-white/50 to-transparent md:block" />
                <div className="flex h-full flex-col gap-6">

                  <h3 className="text-2xl font-semibold leading-snug tracking-[-0.02em] text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/75">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function RoadmapBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/roadmap/background.svg"
          alt=""
          fill
          className="object-cover object-center opacity-80"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(151,71,255,0.65)_0%,rgba(0,0,0,0.85)_65%)]" />
    </>
  );
}

