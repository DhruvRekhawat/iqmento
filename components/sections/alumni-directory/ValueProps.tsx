import { Container } from "@/components/shared/container";

const VALUE_PROPS = [
  {
    number: "1.",
    title: "Insider Knowledge",
    description:
      "Learn what college websites don’t tell you — real placement stories, workload, culture, and faculty.",
  },
  {
    number: "2.",
    title: "Experience You Can Relate To",
    description:
      "These mentors once stood in your shoes — confused, ambitious, and figuring things out.",
  },
  {
    number: "3.",
    title: "Actionable Feedback",
    description:
      "Get concrete guidance on applications, portfolios, or interviews without fluff.",
  },
  {
    number: "4.",
    title: "Shortcuts to Clarity",
    description:
      "Skip the guesswork. Talk to someone who’s already done it and knows the shortcuts.",
  },
];

export function AlumniValuePropsSection() {
  return (
    <section className="bg-gradient-to-b from-[#f1e6ff] to-white py-24 sm:py-32">
      <Container className="flex flex-col gap-16">
        <header className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-pretty text-4xl font-medium leading-tight tracking-[-0.045em] text-[#12131c] sm:text-[2.9rem]">
            Why Connect With Our Alumni?
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#565c6f] sm:text-lg">
            Because they’ve lived your dream — and the reality that follows.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => (
            <article
              key={item.number}
              className="flex h-full flex-col gap-5 rounded-[28px] border border-white/40 bg-white/60 p-8 shadow-[0_36px_120px_-88px_rgba(79,57,246,0.6)] backdrop-blur-[10px]"
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_50%_50%,rgba(79,57,246,1)_0%,rgba(46,33,144,1)_100%)] text-2xl font-semibold text-white">
                {item.number}
              </span>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#16182c]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#54586c]">{item.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}


