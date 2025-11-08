import { Container } from "@/components/shared/container";

const FAQ_ITEMS = [
  {
    question: "How do you vet alumni mentors?",
    answer:
      "Every mentor completes a profile verification, alumni proof, and a trial session review before going live. Only mentors rated 4.5+ stay active on the platform.",
  },
  {
    question: "Can I talk to more than one mentor?",
    answer:
      "Absolutely. Shortlist mentors by college, course, or career track and book trial calls with as many as you like before committing to a deeper engagement.",
  },
  {
    question: "What happens after a trial call?",
    answer:
      "You’ll receive a call summary, curated resources, and a recommended next session format—whether that’s interview prep, SOP review, or career planning.",
  },
  {
    question: "Do you support international applicants?",
    answer:
      "Yes. Our global alumni pool covers top universities in the US, UK, Europe, Canada, and Asia—along with guidance on visas, scholarships, and internships.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-surface py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 text-left">
            <h2 className="text-4xl font-medium leading-tight tracking-tight text-foreground-strong sm:text-[3rem]">
              Frequently asked questions
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
              Everything you need to know about IQMento’s alumni mentorship—how
              it works, who it’s for, and what happens after you book a call.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.question}
                className="rounded-3xl border border-[rgba(16,19,34,0.08)] bg-white/90 p-8 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <h3 className="text-lg font-semibold leading-snug tracking-[-0.01em] text-foreground-strong">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

