import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { TrialCallBookingDialog } from "@/components/trial-call-booking-dialog";

export function CallToAction() {
  return (
    <section id="cta" className="pb-20 pt-12 sm:pb-28">
      <Container className="flex justify-center px-4 sm:px-6">
        <div className="relative flex w-full items-center justify-between overflow-hidden rounded-[16px] border border-white/15 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(18,16,44,0.95)_0%,rgba(20,18,56,0.88)_45%,rgba(59,22,124,0.88)_75%,rgba(136,36,180,0.85)_100%)] px-6 py-10 text-white shadow-[0_45px_120px_rgba(18,18,36,0.55)] sm:px-16 sm:py-16">
          
          {/* Image — hidden on mobile, visible on sm+ (unchanged) */}
          <div className="absolute inset-y-0 right-0 w-[43%] min-w-[320px] max-w-[420px] hidden sm:block">
            <Image
              src="/features/3.svg"
              alt="Students smiling"
              fill
              priority
              className="h-full w-full object-cover"
            />
          </div>

          {/* Content — full width on mobile, partial width on sm+ */}
          <div className="relative z-10 flex w-full flex-col gap-6 sm:gap-8 pr-0 sm:pr-[min(24vw,360px)]">
            <div className="flex flex-col gap-3">
              <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[2.9rem] md:text-[3rem]">
                Your Dream College Journey Starts Here
              </h2>
              <p className="text-sm leading-relaxed text-white/65 sm:text-lg">
                Don&apos;t waste time guessing. Talk to someone who&apos;s lived it.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Button
                size="lg"
                className="h-12 w-full sm:w-auto sm:min-w-[170px] rounded-[12px] border border-white/25 bg-white text-sm font-semibold text-[#171628] shadow-[0_18px_45px_rgba(12,12,24,0.25)] hover:bg-white/95"
                asChild
              >
                <Link href="/alumni">Find Your Mentor</Link>
              </Button>
              <TrialCallBookingDialog
                triggerSize="lg"
                triggerClassName="h-12 w-full sm:w-auto sm:min-w-[180px] rounded-[12px] bg-[linear-gradient(125deg,#516BFF,#6C53FF,#B53BFF)] text-sm font-semibold shadow-[0_26px_70px_rgba(99,88,255,0.55)] hover:shadow-[0_32px_85px_rgba(99,88,255,0.65)] border-none"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}