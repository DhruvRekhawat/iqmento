import { Container } from "@/components/shared/container";

const TESTIMONIALS = [
  {
    quote:
      "Talking to an NID alumnus helped me rebuild my portfolio from scratch—and land the admit I’d always wanted.",
    name: "Aarushi, Delhi",
    context: "Admitted to NID B.Des 2024",
  },
  {
    quote:
      "My mentor broke down the IIT Kanpur experience from hostels to research labs. It felt like I’d already been there.",
    name: "Pranav, Bengaluru",
    context: "AIR 142 · IIT Kanpur (CSE)",
  },
  {
    quote:
      "The alumni network gave me a realistic picture of studying abroad—costs, co-ops, everything. I applied with confidence.",
    name: "Nikita, Mumbai",
    context: "MS Data Science, University of Toronto",
  },
  {
    quote:
      "Mock interviews with two IIM alumni made all the difference. Their feedback was blunt, accurate, and actionable.",
    name: "Yash, Ahmedabad",
    context: "Converted IIM Bangalore PGP 2025",
  },
  {
    quote:
      "I was stuck between design and architecture. Speaking to mentors from both fields helped me choose what fit me best.",
    name: "Heena, Jaipur",
    context: "Product Design, Parsons School of Design",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-white py-24 sm:py-32"
    >
      <Container>
        <div className="flex flex-col gap-14">
          <header className="flex flex-col items-center gap-5 text-center">
            <h2 className="text-4xl font-medium leading-tight tracking-tight text-foreground-strong sm:text-5xl">
              Why Students Trust Us
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
              Because we connect you with people who’ve lived it—not just talked
              about it.
            </p>
          </header>

          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-8">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, idx) => (
                <TestimonialCard key={`${testimonial.name}-${idx}`} {...testimonial} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

interface TestimonialCardProps {
  quote: string;
  name: string;
  context: string;
}

function TestimonialCard({ quote, name, context }: TestimonialCardProps) {
  return (
    <blockquote className="flex w-[320px] shrink-0 flex-col gap-6 rounded-3xl border border-[rgba(16,19,34,0.08)] bg-gradient-to-br from-[#f6f3ff] via-white to-white p-8 text-left shadow-soft transition-transform duration-300 hover:-translate-y-2 hover:shadow-card">
      <span className="text-[2.5rem] leading-none text-[#4f39f6]">“</span>
      <p className="text-base leading-relaxed text-foreground-soft">{quote}</p>
      <footer className="mt-2 flex flex-col gap-1 text-sm font-medium text-foreground-strong">
        {name}
        <span className="text-xs font-normal uppercase tracking-[0.22em] text-foreground-muted">
          {context}
        </span>
      </footer>
    </blockquote>
  );
}

