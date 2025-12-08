import type { Metadata } from "next";

import { Navigation } from "@/components/sections/navigation";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Testimonials } from "@/components/sections/testimonials";
import {
  CollegesExplorer,
  CollegesHero,
  FeaturedColleges,
} from "@/components/sections/colleges";
import { getColleges, getAlumni } from "@/lib/strapi";

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

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <CollegesHero colleges={collegesResponse.data} alumni={alumniResponse.data} />
        <CollegesExplorer colleges={collegesResponse.data} />
        <FeaturedColleges colleges={collegesResponse.data} />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}

