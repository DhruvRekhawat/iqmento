import Image from "next/image";

import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

type AudienceCardConfig = {
  title: string;
  description: string;
  image: string;
  backgroundClass: string;
  headingClass: string;
  descriptionClass: string;
  cardClassName?: string;
  wrapperClass?: string;
  imageWrapperClass?: string;
  imageClassName?: string;
};

const AUDIENCE_CARDS: AudienceCardConfig[] = [
  {
    title: "Aspiring Students",
    description:
      "Confused about which college, course, or career to choose? Find alumni mentors who'll share the honest picture, beyond glossy brochures and coaching.",
    image: "/audience/aspiring-students.png",
    backgroundClass: "gradient-sky",
    headingClass: "text-[#235177]",
    descriptionClass: "text-[#4B5A6A]",
    cardClassName:
      "md:rotate-[8deg] md:shadow-[0_70px_140px_-50px_rgba(23,61,102,0.35)]",
    wrapperClass:
      "md:flex-none md:w-[360px] md:max-w-none md:-mr-20 md:translate-y-6 md:z-10",
    imageWrapperClass:
      "h-[180px] sm:h-[220px] md:h-[320px] md:w-[calc(100%+64px)] overflow-hidden",
    imageClassName:
      "scale-100 sm:scale-110 md:scale-[1.2] sm:-translate-y-[20px] md:-translate-y-12",
  },
  {
    title: "Current Students",
    description:
      "Already in college but need clarity on branch changes, transfers, exchange programs, or career paths? Talk to seniors who've been in your shoes.",
    image: "/audience/current-students.png",
    backgroundClass: "gradient-rose",
    headingClass: "text-[#78352C]",
    descriptionClass: "text-[#2A1A19]",
    cardClassName:
      "md:-rotate-[3deg] md:shadow-[0_80px_150px_-50px_rgba(156,68,95,0.35)]",
    wrapperClass:
      "md:flex-none md:w-[380px] md:max-w-none md:z-20 md:translate-y-8",
    imageWrapperClass:
      "h-[180px] sm:h-[220px] md:h-[360px] md:w-[calc(100%+48px)] overflow-hidden",
    imageClassName:
      "scale-100 sm:scale-110 md:scale-[1.2] sm:-translate-y-[20px] md:-translate-y-8",
  },
  {
    title: "Alumni Mentors",
    description:
      "Turn your college journey into someone else's roadmap. Share real experiences, guide the next generation, and earn while giving back.",
    image: "/audience/alumni-mentors.png",
    backgroundClass: "gradient-violet",
    headingClass: "text-[#54278E]",
    descriptionClass: "text-[#0F1322]",
    cardClassName:
      "md:rotate-[6deg] md:shadow-[0_70px_140px_-50px_rgba(62,45,120,0.35)]",
    wrapperClass:
      "md:flex-none md:w-[360px] md:max-w-none md:-ml-20 md:-translate-y-4 md:z-30",
    imageWrapperClass:
      "h-[180px] sm:h-[220px] md:h-[320px] md:-ml-6 md:w-[calc(100%+68px)] overflow-hidden",
    imageClassName:
      "scale-100 sm:scale-110 md:scale-[1.2] sm:-translate-y-[20px] md:-translate-y-8",
  },
];

export function Audience() {
  return (
    <section
      id="audience"
      className="relative overflow-hidden min-h-[620px] bg-white py-16 sm:py-24 md:py-[96px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,185,255,0.58)_0%,rgba(255,255,255,1)_70%)]" />

      <Container bleed className="relative z-10">
        <div className="relative mx-auto flex flex-col gap-8 sm:gap-[48px] px-4 sm:px-10 md:px-16 md:pb-[320px]">
          
          {/* Header — desktop unchanged */}
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-[420px] text-balance text-[2.25rem] sm:text-[3.25rem] font-medium leading-[0.92] sm:leading-[0.88] tracking-[-0.03em]">
              Who&apos;s this for?
            </h2>
            <p className="max-w-[540px] text-base sm:text-lg leading-[1.45] text-[#535353]">
              College websites show glossy brochures. Coaching centers give
              generic advice. But what you need is honest, first-hand guidance
              from someone who&apos;s actually studied there.
            </p>
          </div>

          {/* Cards — stacked on mobile, overlapping fan on desktop */}
          <div className="flex w-full flex-col items-center gap-4 sm:gap-6 px-0 sm:px-6
                          md:absolute md:bottom-0 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:translate-y-[40%] md:px-0
                          md:flex-row md:items-end md:justify-center md:gap-16">
            {AUDIENCE_CARDS.map((card) => (
              <div
                key={card.title}
                className={cn(
                  "w-full transition-transform duration-500 ease-out md:flex-none",
                  card.wrapperClass,
                )}
              >
                <AudienceCard {...card} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

type AudienceCardProps = AudienceCardConfig;

function AudienceCard({
  title,
  description,
  image,
  backgroundClass,
  headingClass,
  descriptionClass,
  cardClassName,
  imageWrapperClass,
  imageClassName,
}: AudienceCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-visible rounded-[24px] border-[6px] border-white/90 shadow-soft transition-transform duration-500 ease-out hover:-translate-y-5 hover:shadow-card p-5 sm:p-6",
        backgroundClass,
        cardClassName,
      )}
    >
      <div className="flex h-full flex-col gap-0">
        <div>
          <h3
            className={cn(
              "text-[1.35rem] sm:text-[1.75rem] font-semibold leading-none tracking-[-0.01em]",
              headingClass,
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "mt-3 sm:mt-5 text-xs sm:text-sm leading-[1.45] text-balance",
              descriptionClass,
            )}
          >
            {description}
          </p>
        </div>

        <div
          className={cn(
            "relative mt-auto w-full overflow-visible",
            imageWrapperClass,
          )}
        >
          <Image
            src={image}
            alt={title}
            fill
            className={cn(
              "pointer-events-none select-none object-contain object-bottom drop-shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.3]",
              imageClassName,
            )}
          />
        </div>
      </div>
    </article>
  );
}