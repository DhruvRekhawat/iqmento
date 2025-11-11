import { Star } from "lucide-react";

import { Container } from "@/components/shared/container";
import type { AlumniProfile } from "@/data/alumni-profiles";

interface ProfileReviewsProps {
  profile: AlumniProfile;
}

export function ProfileReviewsSection({ profile }: ProfileReviewsProps) {
  const doubled = [...profile.reviews, ...profile.reviews];

  return (
    <section className="relative isolate overflow-hidden bg-[#1b1919] py-24 text-white sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(148,126,255,0.28)_0%,rgba(27,25,25,0.95)_55%)]" />
      <Container className="relative z-10 flex flex-col gap-14">
        <header className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-pretty text-[2.8rem] font-medium leading-[0.94] tracking-[-0.045em] sm:text-[3.1rem] text-white">
            What mentees say about {profile.name}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Every session ends with clear next steps, honest takeaways, and momentum.
          </p>
        </header>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1b1919] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#1b1919] to-transparent" />

          <div className="marquee-mask overflow-hidden py-4">
            <div className="marquee-track gap-6">
              {doubled.map((review, index) => (
                <article
                  key={`${profile.slug}-review-${index}`}
                  className="flex w-[340px] shrink-0 flex-col gap-6 rounded-[26px] border border-white/10 bg-white/10 p-8 text-left shadow-[0_40px_110px_-80px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center gap-2 text-[#c3beff]">
                    {Array.from({ length: review.rating ?? 5 }).map((_, i) => (
                      <Star key={`${review.name}-${i}`} className="h-5 w-5" fill="currentColor" stroke="none" />
                    ))}
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                      {review.rating ?? 5}.0
                    </span>
                  </div>
                  <p className="text-base leading-relaxed text-white/80">{review.quote}</p>
                  <footer className="flex flex-col gap-1 text-sm font-medium">
                    <span className="text-white">{review.name}</span>
                    <span className="text-xs uppercase tracking-[0.26em] text-white/60">{review.role}</span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


