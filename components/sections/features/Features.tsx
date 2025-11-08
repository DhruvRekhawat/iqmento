import Image from "next/image";

import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

const FEATURES_COPY = [
  {
    title: "Learn what life at the college is really like",
    image: "/features/1.svg",
    gradient: "gradient-sky",
    textClass: "text-[#235177]",
  },
  {
    title: "Get career and course-specific guidance.",
    image: "/features/2.svg",
    gradient: "gradient-rose",
    textClass: "text-[#78352C]",
  },
  {
    title: "Talk to alumni who’ve cracked the admissions",
    image: "/features/3.svg",
    gradient: "gradient-violet",
    textClass: "text-[#54278E]",
  },
  {
    title: "Save time, money, and uncertainty",
    image: "/features/4.svg",
    gradient: "gradient-sunrise",
    textClass: "text-[#988413]",
  },
];

export function Features() {
  return (
    <Section id="features" className="relative">
      <div className="absolute inset-0 -z-10 bg-white/65" />
      <SectionHeader

        direction="row"
        title="Admissions are confusing. We make it simple."
        description="College websites show glossy brochures. Coaching centers give generic advice. But what you need is honest, first-hand guidance from someone who’s actually studied there."
      />

      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES_COPY.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </Section>
  );
}

interface FeatureCardProps {
  title: string;
  image: string;
  gradient: string;
  textClass: string;
}

function FeatureCard({ title, image, gradient, textClass }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/40 px-0 py-6 pb-0 shadow-soft transition-transform duration-300 hover:-translate-y-2 hover:shadow-card",
        gradient
      )}
    >
      <div className="flex h-full flex-col px-4 pb-0">
        <h3
          className={cn(
            "max-w-[320px] text-xl font-semibold leading-snug tracking-[-0.02em]",
            textClass
          )}
        >
          {title}
        </h3>

        <div className="relative bottom-0 h-[320px] w-full ">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain object-bottom -translate-y-[48px] pb-0 transition-transform duration-500 group-hover:scale-135 scale-130"
          />
        </div>
      </div>
    </article>
  );
}

