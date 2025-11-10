import type { ReactNode } from "react";
import Image from "next/image";
import { MapPin, Award, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import type { CollegeProfile, CollegeBadgeIcon } from "@/data/college-profiles";

const iconMap: Record<CollegeBadgeIcon, ReactNode> = {
  award: <Award className="h-5 w-5" />,
  shield: <ShieldCheck className="h-5 w-5" />,
  sparkles: <Sparkles className="h-5 w-5" />,
  trophy: <Trophy className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
};

interface CollegeHeroProps {
  profile: CollegeProfile;
}

export function CollegeHero({ profile }: CollegeHeroProps) {
  const { hero, name, location, heroImage } = profile;

  return (
    <section className="relative isolate overflow-hidden bg-[#f1f4ff] py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(121,131,254,0.18)_0%,rgba(241,244,255,0)_55%),linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(241,244,255,1)_52%,rgba(245,247,255,1)_100%)]" />
      <Container className="relative z-10">
        <div className="grid gap-14 rounded-[24px] border border-black/5 bg-white/80 p-10 shadow-[0_60px_120px_-80px_rgba(22,28,45,0.55)] backdrop-blur-3xl md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.9fr)] md:p-14">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-3">
              {hero.badges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d3d7f5] bg-[#f5f6ff] px-4 py-2 text-sm font-medium tracking-tight text-[#4f39f6] shadow-[0_10px_30px_rgba(79,57,246,0.08)]"
                >
                  <span className="text-[#4f39f6]">{iconMap[badge.icon]}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <h1 className="text-pretty text-[2.6rem] font-medium leading-[0.95] tracking-[-0.06em] text-[#0a0a0f] sm:text-[3.4rem] lg:text-[3.75rem]">
                {name}
              </h1>
              <div className="flex items-center gap-3 text-lg font-medium text-[#6b6e7d]">
                <MapPin className="h-5 w-5 text-[#4f39f6]" />
                <span>{location}</span>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-[#5a5f72] sm:text-xl">
                {hero.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                asChild
                variant="accent"
                size="lg"
                className="h-[52px] min-w-[160px] rounded-full px-10 text-sm font-semibold shadow-[0_28px_55px_rgba(79,57,246,0.35)]"
              >
                <a href={hero.primaryAction.href} target="_blank" rel="noopener noreferrer">
                  {hero.primaryAction.label}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-[52px] min-w-[160px] rounded-full border-[#d9dcf0] bg-white px-10 text-sm font-semibold text-[#1a1d2b] shadow-[0_20px_40px_rgba(15,18,40,0.08)] hover:border-[#bfc3da]"
              >
                <a href={hero.secondaryAction.href} target="_blank" rel="noopener noreferrer">
                  {hero.secondaryAction.label}
                </a>
              </Button>
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-[24px] border border-[#e0e3fa] bg-gradient-to-br from-white via-[#f7f7ff] to-[#ebf0ff] shadow-[0_40px_120px_-80px_rgba(79,57,246,0.45)] md:block">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(79,57,246,0.18)_0%,rgba(79,57,246,0)_60%)]" />
            <Image
              src={heroImage}
              alt={`${name} campus`}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-x-6 bottom-6 rounded-[18px] border border-white/40 bg-white/55 p-5 text-sm font-medium text-[#3a3d50] backdrop-blur-xl shadow-[0_25px_50px_-30px_rgba(23,27,50,0.65)]">
              {hero.tagline}
            </div>
          </div>

          <div className="relative block overflow-hidden rounded-[24px] border border-[#e0e3fa] bg-gradient-to-br from-white via-[#f7f7ff] to-[#ebf0ff] shadow-[0_40px_120px_-80px_rgba(79,57,246,0.45)] md:hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(79,57,246,0.18)_0%,rgba(79,57,246,0)_60%)]" />
            <Image
              src={heroImage}
              alt={`${name} campus`}
              width={800}
              height={600}
              className="h-full w-full object-cover object-center"
              priority
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/40 bg-white/70 p-4 text-sm font-medium text-[#3a3d50] backdrop-blur-lg shadow-[0_20px_40px_-24px_rgba(23,27,50,0.55)]">
              {hero.tagline}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


