import type { SVGProps } from "react";
import Image from "next/image";

import { Section } from "@/components/shared/section";

export function CollegesHero() {
  return (
    <Section
      id="colleges-hero"
      bleed
      spacing="loose"
      className="bg-black py-4 text-white sm:py-4"
    >
      <div className="flex justify-center">
        <div className="relative w-full max-w-[1180px] overflow-hidden rounded-[38px] border border-white/20 bg-[#0f1010] ">
          <Image
            src="/colleges/hero.png"
            alt="Modern college buildings with clear sky"
            width={1600}
            height={900}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-black/10" />
          <div className="relative z-10 flex flex-col gap-10 px-6 py-16 text-center sm:px-12 md:px-16 lg:px-24 lg:pb-48">
            <div className="flex flex-col items-center gap-6 text-center">
              <h1 className="text-pretty text-[clamp(3rem,4vw+2rem,6rem)] leading-[0.92] tracking-[-0.06em] text-white">
                <span>Explore Colleges.</span>
                <br />
                <span className="text-[#9a3bff]">
                  Discover
                </span>{" "}
                Real Insights <ArrowIcon className="h-10 w-10 lg:h-14 lg:w-14 text-white inline-flex" />
              </h1>
              <p className="max-w-2xl text-base leading-[1.7] text-white/80 sm:text-md">
                Find your dream college—and connect with students or alumni who&apos;ve studied there. Get honest
                reviews, admission tips, and insider perspectives before you apply.
              </p>
            </div>

            <form
              className="mx-auto flex w-full max-w-[520px] items-center gap-3 rounded-full bg-white/95 px-6 py-4 text-left shadow-[0_28px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              role="search"
            >
              <SearchIcon className="h-5 w-5 text-[#9ca3af]" />
              <input
                type="search"
                placeholder="Search by College, City, or Course"
                className="flex-1 bg-transparent text-sm text-[#404957] placeholder:text-[#9ca3af] focus:outline-none"
              />
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 27 27 9M13.5 9H27v13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

