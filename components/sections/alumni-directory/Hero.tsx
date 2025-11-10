import Image from "next/image";
import { Search } from "lucide-react";

import { Container } from "@/components/shared/container";

export function AlumniDirectoryHero() {
  return (
    <section className="relative isolate overflow-hidden bg-black py-16 text-white sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.28)_0%,rgba(0,0,0,0)_62%)]" />
      <Container className="relative z-10">
        <div className="grid items-center gap-16 rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_60px_160px_-90px_rgba(21,21,35,0.85)] backdrop-blur-[24px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.05fr)] lg:p-14">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h1 className="text-balance text-[3rem] font-medium leading-[0.9] tracking-[-0.05em] sm:text-[3.25rem] lg:text-[3.75rem]">
                Find Your Alumni Mentor
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
                Get honest, 1:1 guidance from people who’ve been exactly where you want to go.
              </p>
            </div>

            <form className="group flex max-w-xl items-center gap-3 rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm text-white/70 shadow-[0_28px_80px_-60px_rgba(79,57,246,0.75)] transition focus-within:border-white/35">
              <Search className="h-5 w-5 text-white/60 transition group-focus-within:text-white" />
              <input
                type="search"
                placeholder="Search colleges or mentors…"
                className="w-full bg-transparent text-base text-white placeholder:text-white/50 focus-visible:outline-none"
              />
            </form>

            <div className="flex flex-wrap gap-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#7e7bff]" />
                Product & Design
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#ff9c6f]" />
                AI & Data
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#60d394]" />
                Growth & Marketing
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#67c6ff]" />
                Founders
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative flex w-full max-w-[540px] items-center justify-center">
              <Image
                src="/alumunus/hero-one.png"
                alt="Alumni mentors at IQMento"
                width={800}
                height={720}
                className="relative z-20 h-auto w-full object-cover"
                priority
              />

              <Image
                src="/alumunus/hero-frame.png"
                alt=""
                width={820}
                height={760}
                className="absolute inset-0 z-10 h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


