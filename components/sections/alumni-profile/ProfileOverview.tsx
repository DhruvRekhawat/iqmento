import { ExternalLink } from "lucide-react";

import { Container } from "@/components/shared/container";
import type { AlumniProfile } from "@/data/alumni-profiles";

interface ProfileOverviewProps {
  profile: AlumniProfile;
}

export function ProfileOverviewSection({ profile }: ProfileOverviewProps) {
  return (
    <section className="bg-white py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9093aa]">
            Overview
          </span>
          <h2 className="text-pretty text-4xl font-medium leading-tight tracking-[-0.045em] text-[#13162b] sm:text-[3rem]">
            Meet {profile.name}
          </h2>

          <div className="flex flex-col gap-4 text-base leading-relaxed text-[#565a6f] sm:text-lg">
            {profile.overview.map((paragraph) => (
              <p key={`overview-${profile.slug}-${paragraph.slice(0, 16)}`}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {profile.highlights.map((highlight) => (
              <span
                key={`${profile.slug}-${highlight.slice(0, 14)}`}
                className="inline-flex items-center gap-3 rounded-full border border-[#d8dcf2] bg-[#f4f6ff] px-5 py-2 text-sm font-medium text-[#30344a]"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#4f39f6]" />
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-8 rounded-[32px] border border-[#e1e4f2] bg-[#f7f7ff] p-8 shadow-[0_36px_120px_-90px_rgba(17,20,42,0.45)]">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#1b1d2f]">
              Areas of Depth
            </h3>
            <ul className="flex flex-col gap-4 text-sm leading-relaxed text-[#55586c]">
              {profile.focusAreas.map((area) => (
                <li key={`${profile.slug}-${area.title}`} className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-[#262a41]">{area.title}</span>
                  <span>{area.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-[#dadff5] bg-white px-6 py-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-[#787d93]">
              Resources
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              {profile.resources.map((resource) => (
                <li key={resource.label}>
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-full border border-[#dbdef3] bg-[#f4f6ff] px-4 py-2 text-[#353852] transition hover:border-[#b8bde4] hover:bg-white"
                  >
                    {resource.label}
                    <ExternalLink className="h-4 w-4 text-[#4f39f6] transition group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>
    </section>
  );
}


