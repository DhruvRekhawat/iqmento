import { Section } from "@/components/shared/section";

const WHAT_WE_DO = [
  {
    number: "1.",
    description:
      "Connect students and mentors 1:1 for personalized guidance.",
  },
  {
    number: "2.",
    description:
      "Verify every mentor’s background to ensure credibility and trust.",
  },
  {
    number: "3.",
    description:
      "Offer both free and deep-dive paid sessions depending on your need.",
  },
  {
    number: "4.",
    description:
      "Build a growing alumni network across colleges, courses, and careers.",
  },
];

export function WhatWeDo() {
  return (
    <Section
      id="what-we-do"
      className="bg-[radial-gradient(circle_at_50%_100%,rgba(227,205,255,0.6)_0%,#ffffff_68%)]"
    >
      <div className="flex flex-col items-center gap-16">
        <header className="flex max-w-3xl flex-col items-center gap-5 text-center">
          <p className="text-[clamp(2.5rem,2.2vw+1.8rem,4.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-[#0b0b0f]">
            What We Do
          </p>
          <p className="text-lg leading-[1.6] text-[#535353] sm:text-xl">
            Because we connect you with people who’ve lived it — not just talked
            about it.
          </p>
        </header>

        <div className="grid w-full gap-6 lg:grid-cols-4">
          {WHAT_WE_DO.map((item) => (
            <article
              key={item.number}
              className="flex h-full flex-col gap-6 rounded-[28px] border border-[#d9d9d9]/60 bg-white/85 p-10 shadow-[0_30px_80px_-48px_rgba(39,16,105,0.35)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-3 hover:shadow-[0_40px_120px_-48px_rgba(39,16,105,0.45)]"
            >
              <div className="relative flex h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-[22px] border border-black/10 bg-[linear-gradient(221deg,#4f39f6_0%,#2e2190_100%)] text-white shadow-[0_18px_46px_rgba(79,57,246,0.35)]">
                <span className="text-[2.25rem] font-medium tracking-[-0.02em]">
                  {item.number}
                </span>
                <div className="pointer-events-none absolute inset-1 rounded-[18px] border border-white/20" />
              </div>
              <p className="text-left text-lg font-medium leading-[1.4] tracking-[-0.01em] text-[#2d2d2d]">
                {item.description}
              </p>
              <button className="mt-auto w-fit text-sm font-semibold uppercase tracking-[0.22em] text-[#4f39f6] transition-colors hover:text-[#2f23a8]">
                Learn More
              </button>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}