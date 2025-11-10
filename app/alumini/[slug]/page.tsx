import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Navigation } from "@/components/sections/navigation";
import {
  AlumniProfileHero,
  ProfileOverviewSection,
  ProfileSessionsSection,
  ProfileReviewsSection,
  OtherAlumniSection,
} from "@/components/sections/alumni-profile";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Testimonials } from "@/components/sections/testimonials";
import {
  alumniProfiles,
  getAlumniProfile,
} from "@/data/alumni-profiles";

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export function generateStaticParams() {
  return alumniProfiles.map((profile) => ({
    slug: profile.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getAlumniProfile(slug);

  if (!profile) {
    return {};
  }

  const baseTitle = `${profile.name} — ${profile.headline} | IQMento Mentor`;
  const baseDescription = `${profile.name} offers 1:1 sessions on ${profile.focusAreas
    .map((focus) => focus.title)
    .slice(0, 2)
    .join(", ")}. ${profile.heroTagline}`;

  return {
    title: baseTitle,
    description: baseDescription,
    openGraph: {
      title: baseTitle,
      description: baseDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description: baseDescription,
    },
  };
}

export default async function AlumniProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getAlumniProfile(slug);

  if (!profile) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <AlumniProfileHero profile={profile} />
        <ProfileOverviewSection profile={profile} />
        <ProfileSessionsSection profile={profile} />
        <ProfileReviewsSection profile={profile} />
        <OtherAlumniSection currentSlug={profile.slug} />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}


