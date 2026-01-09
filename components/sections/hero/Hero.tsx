import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { TrialCallBookingDialog } from "@/components/trial-call-booking-dialog";

const HERO_DESCRIPTION =
  "Cut through the noise. Hear real stories, real advice, and real insider intel from students and alumni who've walked your path.";

export function Hero() {
  return (
    <Section id="hero" variant="hero" spacing="loose" bleed>
      <div className="relative mx-auto w-full h-full min-h-[720px]  overflow-hidden rounded-sm bg-white sm:px-4 md:py-16 pb-0">
        <HeroBackgroundSurface />
        <InnerFrameGlow />

        <div className="relative grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)] md:items-center">
          <div className="flex flex-col gap-8">
            <h1 className="text-balance text-[2.85rem] font-medium leading-[0.92] tracking-[-0.02em] text-[#0b0b0f] sm:text-[3.75rem] lg:text-[4rem]">
              Your College <span className="text-[#635bff]">Insider</span>{" "}
              Advantage.
            </h1>
            <p className="max-w-xl text-lg tracking-[-0.01em] text-[#55596d] sm:text-xl">
              {HERO_DESCRIPTION}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                variant="primary"
                size="lg"
                className="h-14 px-9 text-sm text-black shadow-[0_22px_60px_rgba(12,12,24,0.14)]"
                asChild
              >
                <Link href="/alumni">Find Your Mentor</Link>
              </Button>
              <TrialCallBookingDialog />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function HeroBackgroundSurface() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.9]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_-10%,rgba(226,229,255,0.85)_0%,rgba(255,255,255,0.4)_40%,rgba(255,255,255,0)_75%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(223,227,243,0.28)_1px,transparent_1px),linear-gradient(180deg,rgba(223,227,243,0.28)_1px,transparent_1px)] bg-size-[92px_92px]" />
    </div>
  );
}

function InnerFrameGlow() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full ">
      <div className="absolute bottom-0 -right-6 z-20 flex justify-end items-end">
        <Image
          src="/hero/desktop.svg"
          alt="Student smiling"
          width={900}
          height={560}
          priority
          className="h-auto w-full object-cover scale-105"
        />
      </div>
      <div className="absolute  -bottom-16  left-1/2 -translate-x-1/2  w-full px-4 py-6 z-10 scale-y-75 ">
        <Image
          src="/hero/Frame 17.svg"
          alt=""
          width={900}
          height={460}
          priority
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

