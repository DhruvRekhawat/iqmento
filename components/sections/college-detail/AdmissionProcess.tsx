import { Container } from "@/components/shared/container";
import type { CollegeProfile } from "@/data/college-profiles";

interface AdmissionProcessSectionProps {
  admission: CollegeProfile["admission"];
}

export function AdmissionProcessSection({ admission }: AdmissionProcessSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(91,112,255,0.28)_0%,rgba(5,5,5,0)_55%),linear-gradient(180deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,1)_100%)]" />
      <Container className="relative z-10 flex flex-col gap-16">
        <header className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-balance text-5xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-[3.2rem] text-white">
            {admission.title}
          </h2>
          <p className="max-w-2xl text-lg text-white/65">{admission.subtitle}</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {admission.steps.map((step, index) => (
            <ProcessCard key={step.title} step={step} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProcessCard({
  step,
  index,
}: {
  step: CollegeProfile["admission"]["steps"][number];
  index: number;
}) {
  return (
    <article
      className={`relative flex h-full flex-col gap-5 rounded-3xl border p-7 transition-transform duration-300 hover:-translate-y-2 ${
        step.highlight
          ? "border-[#5c85ff]/60 bg-[linear-gradient(44deg,#231a67_0%,#4f39f6_100%)] shadow-[0_34px_120px_-60px_rgba(79,57,246,0.75)]"
          : "border-white/10 bg-[#141316] shadow-[0_32px_90px_-60px_rgba(8,8,20,0.85)]"
      }`}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-semibold text-white/80 backdrop-blur-md">
        {(index + 1).toString().padStart(2, "0")}
      </span>
      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
      <p className="text-sm leading-relaxed text-white/70">{step.description}</p>
    </article>
  );
}


