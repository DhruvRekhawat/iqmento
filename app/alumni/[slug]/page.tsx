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
import { extractTestimonialsFromAlumni } from "@/lib/testimonials-utils";
import type { Testimonial } from "@/components/sections/testimonials/Testimonials";

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

    if (!alumniResponse || !alumniResponse.data) {
      console.warn("No alumni data returned from Strapi for static params");
      return [];
    }

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
    // Return empty array to allow build to continue, pages will be generated on-demand if not static
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

  // Fetch services from database for this educator
  let services: Array<{ id: string; title: string; description: string | null; durationMinutes: number; price: number; active: boolean; createdAt: Date; updatedAt: Date; educatorId: string }> = [];
  try {
    const { prisma } = await import("@/lib/prisma");
    const educator = await prisma.user.findUnique({
      where: { educatorSlug: slug },
      select: { id: true },
    });
    
    if (educator) {
      const dbServices = await prisma.service.findMany({
        where: {
          educatorId: educator.id,
          active: true,
        },
        orderBy: { createdAt: "desc" },
      });
      services = dbServices;
    }
  } catch (error) {
    console.error("Error fetching services from DB:", error);
    // Fallback to profile sessions if DB fetch fails
  }

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

  // Fetch testimonials from alumni reviews
  let testimonials: Testimonial[];
  try {
    const testimonialsResponse = await getAlumni({
      populate: "*",
      filters: {
        publishedAt: { $notNull: true },
      },
      pagination: {
        pageSize: 100,
      },
    });
    testimonials = extractTestimonialsFromAlumni(testimonialsResponse.data);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    testimonials = [];
  }

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <AlumniProfileHero profile={profile} />
        <ProfileOverviewSection profile={profile} />
        <ProfileSessionsSection profile={profile} services={services} />
        <ProfileReviewsSection profile={profile} />
        <OtherAlumniSection 
          currentSlug={profile.slug} 
          otherAlumni={otherAlumniResponse.data}
        />
        <Testimonials testimonials={testimonials} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}


