import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export function CallToAction() {
  return (
    <section
      id="cta"
      className="pb-24 pt-12 sm:pb-32"
    >
      <Container>
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-tr from-black via-[#23194a] to-[#4f39f6] px-10 py-16 text-white shadow-[0_35px_80px_rgba(15,15,15,0.45)] sm:px-16 sm:py-20">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16)_0%,transparent_65%)] lg:block" />
          <div className="relative z-10 flex flex-col gap-10 lg:max-w-[620px]">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                Your Dream College Journey Starts Here
              </h2>
              <p className="text-lg leading-relaxed text-white/70">
                Don’t waste time guessing. Talk to someone who’s lived it.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                className="h-14 px-10 text-sm text-black"
              >
                Find Your Mentor
              </Button>
              <Button
                variant="accent"
                size="lg"
                className="h-14 px-10 text-sm"
              >
                Book Free Trial Call
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

