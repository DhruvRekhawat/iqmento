import Image from "next/image";

import { Section } from "@/components/shared/section";

export function OurStory() {
  return (
    <Section id="our-story" className="bg-white">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="flex flex-col gap-6">
          <h2 className="text-pretty text-[clamp(2.5rem,2.8vw+1.6rem,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[#0b0b0f]">
            Our Story
          </h2>
          <div className="flex flex-col gap-5 text-[1.1rem] leading-[1.65] text-[#535353]">
            <p>
              It started with a simple frustration:
              <br />
              <span className="italic">
                Why is getting into the right college so confusing — even in the
                age of information?
              </span>
            </p>
            <p>
              Our founders went through the same struggle — endless college
              websites, half-true coaching advice, and sleepless nights scrolling
              through forums that never really helped.
            </p>
            <p>
              So we built IQMento — a place where students could get the truth
              about colleges, straight from people who’ve actually been there. No
              ads. No hidden agendas. Just honest conversations that help you make
              smarter decisions.
            </p>
          </div>
        </div>

        <div className="relative flex w-full items-center justify-center">
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] bg-[#ddf187] p-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-white">
              <Image
                src="/aboutus/our-story.png"
                alt="IQMento mentors brainstorming together"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>

            {CALLOUTS.map((callout) => (
              <div
                key={callout.label}
                className={`absolute rounded-full border border-[#c7e763] bg-white px-6 py-3 text-sm font-semibold text-[#535353] shadow-[0_25px_60px_-32px_rgba(181,219,18,0.65)] ${callout.className}`}
              >
                {callout.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

const CALLOUTS = [
  {
    label: "Endless college websites?",
    className:
      "left-[30%] top-[14%] -translate-x-1/2 -rotate-[7deg] shadow-[0_18px_55px_-30px_rgba(0,0,0,0.25)]",
  },
  {
    label: "Half-true advice?",
    className:
      "left-[72%] top-[32%] -translate-x-1/2 rotate-[4deg] shadow-[0_18px_55px_-30px_rgba(0,0,0,0.25)]",
  },
  {
    label: "Lot of forums?",
    className:
      "left-[58%] bottom-[12%] -translate-x-1/2 rotate-[-9deg] shadow-[0_18px_55px_-30px_rgba(0,0,0,0.25)]",
  },
];