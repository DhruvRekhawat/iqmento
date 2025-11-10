import type { SVGProps } from "react";
import Image from "next/image";

import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";

export function CollegesHero() {
  return (
    <Section
      id="colleges-hero"
      bleed
      spacing="loose"
      className="bg-black py-24 text-white sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white px-6 py-16 text-black shadow-[0_40px_120px_-48px_rgba(0,0,0,0.65)] sm:px-12 md:px-20 lg:py-24">
          <HeroBackdrop />

          <div className="relative grid gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div className="flex flex-col items-center gap-10 text-center lg:items-start lg:text-left">
              <h1 className="text-pretty text-[clamp(3rem,4vw+2rem,5.75rem)] font-medium leading-[0.88] tracking-[-0.07em] text-[#050505]">
                Explore Colleges. Discover Real Insights.
              </h1>
              <p className="max-w-2xl text-lg leading-[1.6] text-[#535353] sm:text-xl">
                Find your dream college—and connect with students or alumni who’ve
                studied there. Get honest reviews, admission tips, and insider
                perspectives before you apply.
              </p>

              <form
                className="flex w-full max-w-xl items-center gap-3 rounded-[40px] border border-[#e0e0e0] bg-[#f2f2f2] px-5 py-3 text-left shadow-[0_18px_45px_-30px_rgba(0,0,0,0.35)]"
                role="search"
              >
                <SearchIcon className="h-5 w-5 text-[#9ca3af]" />
                <input
                  type="search"
                  placeholder="Search by College, City, or Course"
                  className="flex-1 bg-transparent text-sm text-[#637188] placeholder:text-[#9ca3af] focus:outline-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="accent"
                  className="h-10 rounded-full px-6 text-xs uppercase tracking-[0.18em]"
                >
                  Search
                </Button>
              </form>
            </div>

            <div className="relative flex w-full justify-center lg:justify-end">
              <div className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] bg-[#f3f3f3]">
                <Image
                  src="/colleges/hero.png"
                  alt="Students exploring colleges together"
                  width={520}
                  height={520}
                  className="h-full w-full object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-black/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function HeroBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_15%,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(226,226,226,0.45)_1px,transparent_1px),linear-gradient(180deg,rgba(226,226,226,0.45)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>
      <div className="pointer-events-none absolute inset-x-10 inset-y-10 rounded-[26px] border border-black/5" />
    </>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.5 17a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m16.5 16.5-3.262-3.262"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

