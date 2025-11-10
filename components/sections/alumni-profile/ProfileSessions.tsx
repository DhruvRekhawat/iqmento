import { Clock, MonitorSmartphone } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import type { AlumniProfile } from "@/data/alumni-profiles";

interface ProfileSessionsProps {
  profile: AlumniProfile;
}

export function ProfileSessionsSection({ profile }: ProfileSessionsProps) {
  return (
    <section className="bg-[#0f101c] py-24 text-white sm:py-32">
      <Container className="flex flex-col gap-14">
        <header className="flex flex-col gap-6 text-left">
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/60">
            Signature Sessions
          </span>
          <div className="flex flex-col gap-3">
            <h2 className="text-pretty text-[2.75rem] font-medium leading-[0.95] tracking-[-0.045em] sm:text-[3rem]">
              Book a session with {profile.name}
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Designed to give you clarity in one meeting and momentum afterward. Each session includes
              personalised notes and resources.
            </p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {profile.sessions.map((session) => (
            <article
              key={`${profile.slug}-${session.title}`}
              className="flex h-full flex-col gap-6 rounded-[28px] border border-white/8 bg-white/[0.06] p-8 shadow-[0_42px_120px_-80px_rgba(12,12,28,0.85)] backdrop-blur-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">{session.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-white/70">{session.description}</p>

              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Clock className="h-4 w-4 text-[#9ca5ff]" />
                  {session.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <MonitorSmartphone className="h-4 w-4 text-[#9ca5ff]" />
                  {session.format}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <span className="text-sm font-semibold text-white/80">{session.price}</span>
                <Button
                  asChild
                  variant="accent"
                  size="sm"
                  className="h-10 rounded-full px-5 text-xs font-semibold shadow-[0_16px_35px_rgba(79,57,246,0.45)]"
                >
                  <a href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">
                    Book Now
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}


