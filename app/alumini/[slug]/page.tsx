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
import { getAlumniBySlug, getAlumni } from "@/lib/strapi";
import { mapStrapiAlumniToAlumniProfile } from "@/lib/strapi-mappers";

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export async function generateStaticParams() {
  try {
    const alumniResponse = await getAlumni({
      populate: ["profile"],
      filters: {
        publishedAt: { $notNull: true },
      },
      pagination: {
        pageSize: 100,
      },
    });

    return alumniResponse.data
      .map((alumni) => {
        const slug =
          alumni.slug ||
          (alumni.name
            ? alumni.name.toLowerCase().replace(/\s+/g, "-")
            : alumni.almuniId?.toLowerCase() || null);
        return slug ? { slug } : null;
      })
      .filter((item): item is { slug: string } => item !== null);
  } catch (error) {
    console.error("Error generating static params for alumni:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const alumniResponse = await getAlumniBySlug(slug, {
    populate: ["profile", "heroImage"],
  });

  if (!alumniResponse) {
    return {};
  }

  const profile = mapStrapiAlumniToAlumniProfile(alumniResponse.data);

  const baseTitle = `${profile.name} — ${profile.headline} | IQMento Mentor`;
  const baseDescription = profile.focusAreas.length > 0
    ? `${profile.name} offers 1:1 sessions on ${profile.focusAreas
        .map((focus) => focus.title)
        .slice(0, 2)
        .join(", ")}. ${profile.heroTagline}`
    : `${profile.name} - ${profile.heroTagline}`;

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
  const alumniResponse = await getAlumniBySlug(slug, {
    populate: ["profile", "heroImage"],
  });

  if (!alumniResponse) {
    notFound();
  }

  const profile = mapStrapiAlumniToAlumniProfile(alumniResponse.data);

  // Fetch other alumni for the "Other Alumni" section
  const otherAlumniResponse = await getAlumni({
    populate: ["profile"],
    filters: {
      publishedAt: { $notNull: true },
    },
    pagination: {
      pageSize: 10,
    },
  });

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <AlumniProfileHero profile={profile} />
        <ProfileOverviewSection profile={profile} />
        <ProfileSessionsSection profile={profile} />
        <ProfileReviewsSection profile={profile} />
        <OtherAlumniSection 
          currentSlug={profile.slug} 
          otherAlumni={otherAlumniResponse.data}
        />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}


