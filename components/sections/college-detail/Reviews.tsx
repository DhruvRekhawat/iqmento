import { Star } from "lucide-react";

import { Container } from "@/components/shared/container";
import type { CollegeProfile } from "@/data/college-profiles";

interface ReviewsSectionProps {
  reviews: CollegeProfile["reviews"];
  name: string;
}

export function ReviewsSection({ reviews, name }: ReviewsSectionProps) {
  const doubledReviews = [...reviews, ...reviews];

  return (
    <section className="relative isolate overflow-hidden bg-[#201e1e] py-24 text-white sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(151,71,255,0.18)_0%,rgba(32,30,30,0.95)_55%)]" />
      <Container className="relative z-10 flex flex-col gap-14">
        <header className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-pretty text-[2.75rem] font-medium leading-[0.92] tracking-[-0.04em] sm:text-[3.25rem] text-white">
            Student Reviews
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Hear how {name} aspirants use mentor insights, review breakdowns, and campus walkthroughs to prepare smarter.
          </p>
        </header>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#201e1e] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#201e1e] to-transparent" />

          <div className="marquee-mask overflow-hidden py-4">
            <div className="marquee-track gap-6">
              {doubledReviews.map((review, index) => (
                <ReviewCard key={`${review.name}-${index}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ReviewCard({ review }: { review: CollegeProfile["reviews"][number] }) {
  return (
    <article className="flex w-[340px] shrink-0 flex-col gap-6 rounded-[24px] border border-white/10 bg-white/10 p-8 text-left shadow-[0_35px_90px_-60px_rgba(0,0,0,0.75)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-2 sm:w-[360px]">
      <div className="flex items-center gap-2 text-[#b1adff]">
        {Array.from({ length: review.rating ?? 5 }).map((_, index) => (
          <Star key={index} className="h-5 w-5" fill="currentColor" stroke="none" />
        ))}
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
          {review.rating ?? 5}.0
        </span>
      </div>
      <p className="text-base leading-relaxed text-white/80">{review.quote}</p>
      <footer className="flex flex-col gap-1 text-sm font-medium">
        <span className="text-white">{review.name}</span>
        <span className="text-xs uppercase tracking-[0.26em] text-white/60">{review.role}</span>
      </footer>
    </article>
  );
}


