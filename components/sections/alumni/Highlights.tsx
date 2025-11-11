import { AlarmClock, BadgeCheck, BriefcaseBusiness, UsersRound } from "lucide-react";

import { Container } from "@/components/shared/container";

const HIGHLIGHTS = [
  {
    title: "Real Mentors, Real Stories",
    icon: UsersRound,
    color: "bg-[#dbe8ff]",
  },
  {
    title: "Honest, Unfiltered Insights",
    icon: AlarmClock,
    color: "bg-[#ffe1e4]",
  },
  {
    title: "Personalized, Not Generic",
    icon: BriefcaseBusiness,
    color: "bg-[#ffeebd]",
  },
  {
    title: "Verified Profiles & Reviews",
    icon: BadgeCheck,
    color: "bg-[#e0d9ff]",
  },
];

export function AlumniHighlights() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {HIGHLIGHTS.map(({ title, icon: Icon, color }) => (
          <article
            key={title}
            className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-none border border-[rgba(0,0,0,0.08)] bg-white px-8 py-5 text-[#414141] transition-transform duration-300 hover:-translate-y-0.5 sm:px-9 sm:py-4"
          >
            <div className="relative flex flex-col gap-6">
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-[4px] ${color}`}
              >
                <Icon className="h-5 w-5 text-black" strokeWidth={1.6} />
              </span>
              <h3 className="text-lg font-medium leading-snug tracking-[-0.01em]">
                {title}
              </h3>
            </div>
          </article>
        ))}
      </Container>
    </section>
  );
}

