import type { Metadata } from "next";

import { Navigation } from "@/components/sections/navigation";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Testimonials } from "@/components/sections/testimonials";
import type { Testimonial } from "@/components/sections/testimonials/Testimonials";
import {
  CollegesExplorer,
  CollegesHero,
  FeaturedColleges,
} from "@/components/sections/colleges";
import { getColleges, getAlumni } from "@/lib/strapi";
import { mapStrapiAlumniToAlumniProfile } from "@/lib/strapi-mappers";
import { extractTestimonialsFromAlumni } from "@/lib/testimonials-utils";

export const metadata: Metadata = {
  title: "All Colleges — Explore Mentors by Campus | IQMento",
  description:
    "Browse India and global colleges, filter by interests, and connect with verified mentors who share honest campus insights before you commit.",
  openGraph: {
    title: "All Colleges — Explore Mentors by Campus | IQMento",
    description:
      "Browse India and global colleges, filter by interests, and connect with verified mentors who share honest campus insights before you commit.",
    url: "https://iqmento.com/all-colleges",
    siteName: "IQMento",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Colleges — Explore Mentors by Campus | IQMento",
    description:
      "Browse India and global colleges, filter by interests, and connect with verified mentors who share honest campus insights before you commit.",
  },
};

export default async function AllCollegesPage() {
  const collegesResponse = await getColleges({
    populate: ["heroImage"],
    filters: {
      publishedAt: { $notNull: true },
    },
    pagination: {
      pageSize: 100,
    },
  });

  // Get alumni data for search
  const alumniResponse = await getAlumni({
    populate: ["profile"],
    filters: {
      publishedAt: { $notNull: true },
    },
    pagination: {
      pageSize: 50,
    },
  });

  // Transform alumni data for search (ensure slug is always a string)
  const alumniForSearch = alumniResponse.data.map((alum) => {
    const profile = mapStrapiAlumniToAlumniProfile(alum);
    return {
      slug: profile.slug,
      name: profile.name,
      location: profile.location,
      headline: profile.headline,
      image: profile.image,
    };
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
        <CollegesHero colleges={collegesResponse.data} alumni={alumniForSearch} />
        <CollegesExplorer colleges={collegesResponse.data} />
        <FeaturedColleges colleges={collegesResponse.data} />
        <Testimonials testimonials={testimonials} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}

