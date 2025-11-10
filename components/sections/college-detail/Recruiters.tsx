import { Container } from "@/components/shared/container";
import type { CollegeProfile } from "@/data/college-profiles";

interface RecruitersSectionProps {
  recruiters: CollegeProfile["recruiters"];
}

export function RecruitersSection({ recruiters }: RecruitersSectionProps) {
  return (
    <section className="bg-white py-24 sm:py-32">
      <Container className="flex flex-col gap-16">
        <div className="flex flex-col items-center gap-8 rounded-[32px] border border-[#e2e5f5] bg-[#f7f7ff] px-10 py-12 text-center shadow-[0_26px_90px_-70px_rgba(15,23,42,0.55)]">
          <h2 className="text-pretty text-4xl font-medium leading-tight tracking-[-0.04em] text-[#11121b] sm:text-[2.75rem]">
            {recruiters.title}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold uppercase tracking-[0.32em] text-[#4f39f6]">
            {recruiters.logos.map((logo) => (
              <span
                key={logo}
                className="inline-flex items-center rounded-full border border-[#d6d9f2] bg-white px-5 py-2 text-[#2f3140] shadow-[0_14px_40px_-30px_rgba(79,57,246,0.45)]"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)]">
          <article className="flex h-full flex-col gap-6 rounded-[28px] border border-[#e4e6f3] bg-[#f8f8ff] p-8 shadow-[0_32px_100px_-70px_rgba(15,23,42,0.5)]">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#1b1e2f]">
              Cutoff / Eligibility
            </h3>
            <ul className="flex flex-col gap-4 text-sm leading-relaxed text-[#5b5e70]">
              {recruiters.cutoff.map((item) => (
                <li
                  key={item.slice(0, 28)}
                  className="rounded-2xl border border-[#e0e2ef] bg-white px-5 py-4 shadow-[0_18px_35px_-30px_rgba(15,23,42,0.35)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="flex h-full flex-col gap-8 rounded-[28px] border border-[#e4e6f3] bg-white p-8 shadow-[0_32px_100px_-70px_rgba(15,23,42,0.5)]">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#1b1e2f]">
              Placements at a glance
            </h3>
            <div className="flex flex-wrap gap-4">
              {recruiters.placements.map((placement) => (
                <div
                  key={placement.label}
                  className="flex flex-1 min-w-[180px] flex-col gap-2 rounded-2xl border border-[#e2e4f1] bg-[#f6f7ff] px-6 py-6 text-left text-sm text-[#55586c] shadow-[0_16px_45px_-32px_rgba(15,23,42,0.4)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8d90a6]">
                    {placement.label}
                  </span>
                  <span className="text-3xl font-semibold tracking-[-0.04em] text-[#171a2b]">
                    {placement.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-[26px] border border-dashed border-[#d0d3e8] bg-[#f9f9ff] px-6 py-5 text-sm leading-relaxed text-[#616377]">
              Alumni-led portfolio reviews, placement mentorship, and studio simulations are part of IQMento’s guided journeys for NID aspirants.
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}


