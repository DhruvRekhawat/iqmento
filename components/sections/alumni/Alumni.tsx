import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

const MENTORS = [
  {
    name: "Jiyesh Shah",
    role: "Software Engineer · 8 years of experience",
    company: "Google",
    image: "/alumini-placeholder.png",
  },
  {
    name: "Aanya Rao",
    role: "Product Manager · IIM Ahmedabad ‘18",
    company: "Notion",
    image: "/alumini-placeholder.png",
  },
  {
    name: "Karthik Menon",
    role: "Data Scientist · MIT Sloan ‘19",
    company: "Airbnb",
    image: "/alumini-placeholder.png",
  },
  {
    name: "Misbah Ali",
    role: "Consultant · ISB Hyderabad ‘17",
    company: "McKinsey",
    image: "/alumini-placeholder.png",
  },
  {
    name: "Rhea Patel",
    role: "UX Researcher · NID ‘16",
    company: "Spotify",
    image: "/alumini-placeholder.png",
  },
];

export function Alumni() {
  return (
    <section
      id="alumni"
      className="relative overflow-hidden bg-black py-24 text-white sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(151,71,255,0.6)_0%,rgba(0,0,0,0.9)_65%)]" />

      <Container className="relative z-10 bg-white">
        <div className="flex flex-col gap-12">
          <header className="flex flex-col items-start gap-6 text-left">
            <h2 className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-[3.5rem] max-w-md text-center">
              Your Alumnus all at one place
            </h2>

          </header>

          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-6">
              {[...MENTORS, ...MENTORS].map((mentor, idx) => (
                <MentorCard key={`${mentor.name}-${idx}`} {...mentor} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

interface MentorCardProps {
  name: string;
  role: string;
  company: string;
  image: string;
}

function MentorCard({ name, role, company, image }: MentorCardProps) {
  return (
    <article className="relative flex w-[300px] shrink-0 flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-2">
      <div className="relative h-40 overflow-hidden rounded-2xl border border-white/20 bg-white/10">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
            {name}
          </h3>
          <p className="text-sm leading-relaxed text-white/70">{role}</p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.28em] text-white/60">
          <span className="inline-flex h-2 w-2 rounded-full bg-accent-lime" />
          {company}
        </div>

        <Button
          variant="accent"
          size="md"
          className="mt-2 h-12 w-full rounded-full text-sm font-semibold"
        >
          Talk to Alumni
        </Button>
      </div>
    </article>
  );
}

