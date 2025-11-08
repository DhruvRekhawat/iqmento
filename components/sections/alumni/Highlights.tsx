import { NotebookPen, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

import { Container } from "@/components/shared/container";

const HIGHLIGHTS = [
  {
    title: "Real Mentors, Real Stories",
    icon: UsersRound,
  },
  {
    title: "Honest, Unfiltered Insights",
    icon: NotebookPen,
  },
  {
    title: "Personalized, Not Generic",
    icon: Sparkles,
  },
  {
    title: "Verified Profiles & Reviews",
    icon: ShieldCheck,
  },
];

export function AlumniHighlights() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {HIGHLIGHTS.map(({ title, icon: Icon }) => (
            <div
              key={title}
              className="flex h-full flex-col gap-5 rounded-3xl border border-[rgba(16,19,34,0.08)] bg-white/80 p-8 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-primary shadow-soft">
                <Icon className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em] text-foreground-strong">
                {title}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

