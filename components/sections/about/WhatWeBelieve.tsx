import { Section } from "@/components/shared/section";

const BELIEFS = [
  {
    copy: [
      "Experience is the best teacher.",
      "That’s why we bring you mentors who’ve lived your journey.",
    ],
    background:
      "gradient-sky border-none shadow-[0_35px_90px_-48px_rgba(52,119,149,0.4)]",
    textClass: "text-[#17466a]",
  },
  {
    copy: [
      "Honest conversations > glossy marketing.",
      "",
      "You deserve real insights, not rehearsed sales pitches.",
    ],
    background:
      "gradient-rose border-none shadow-[0_35px_90px_-52px_rgba(202,70,110,0.45)]",
    textClass: "text-[#611d4a]",
  },
  {
    copy: [
      "Accessiblity to Guidance.",
      "Whatever you’re aiming for, someone out there can guide you better than any search engine.",
    ],
    background:
      "gradient-sunrise border-none shadow-[0_35px_90px_-52px_rgba(197,149,38,0.45)]",
    textClass: "text-[#5e4707]",
  },
];

export function WhatWeBelieve() {
  return (
    <Section id="what-we-believe" className="bg-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-sm flex-col gap-6">
          <h2 className="text-pretty text-[clamp(2.75rem,3vw+1.6rem,4rem)] font-medium leading-[0.9] tracking-[-0.05em] text-[#0b0b0f]">
            What We Believe
          </h2>
        </div>

        <div className="mt-6 lg:mt-0 grid flex-1 gap-6 lg:grid-cols-3">
          {BELIEFS.map((belief) => (
            <article
              key={belief.copy.join("-")}
              className={`flex h-full flex-col gap-4 rounded-[16px] border border-[#dbe2f0]/40 bg-white/90 p-6 backdrop-blur-sm ${belief.background}`}
            >
              {/* Bold first line, smaller + normal subsequent lines */}
              {belief.copy.map((line, idx) =>
                line ? (
                  idx === 0 ? (
                    <p
                      key={`bold-${line}`}
                      className={`text-lg font-bold leading-normal tracking-[-0.01em] ${belief.textClass}`}
                    >
                      {line}
                    </p>
                  ) : (
                    <p
                      key={`normal-${line}`}
                      className={`text-base font-normal leading-normal tracking-[-0.01em] ${belief.textClass}`}
                    >
                      {line}
                    </p>
                  )
                ) : (
                  <span key={`spacer-${idx}`} aria-hidden className="h-2" />
                )
              )}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}