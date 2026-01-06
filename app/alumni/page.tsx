import type { Metadata } from "next";

import { Navigation } from "@/components/sections/navigation";
import {
  AlumniDirectoryHero,
  FeaturedMentorsSection,
  AlumniValuePropsSection,
} from "@/components/sections/alumni-directory";
import { Testimonials } from "@/components/sections/testimonials";
import type { Testimonial } from "@/components/sections/testimonials/Testimonials";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { getAlumni, getColleges } from "@/lib/strapi";
import { extractTestimonialsFromAlumni } from "@/lib/testimonials-utils";

export const metadata: Metadata = {
  title: "All Alumni Mentors — Book 1:1 Sessions | IQMento",
  description:
    "Browse verified alumni mentors from IITs, NIDs, IIMs, global universities, and breakout startups. Book 1:1 sessions for portfolio reviews, interview prep, and career guidance.",
  openGraph: {
    title: "All Alumni Mentors — Book 1:1 Sessions | IQMento",
    description:
      "Browse verified alumni mentors from IITs, NIDs, IIMs, global universities, and breakout startups. Book 1:1 sessions for portfolio reviews, interview prep, and career guidance.",
    url: "https://iqmento.com/alumni",
    siteName: "IQMento",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Alumni Mentors — Book 1:1 Sessions | IQMento",
    description:
      "Get honest, 1:1 guidance from mentors who have already navigated the journey you're starting.",
  },
};

export default async function AlumniDirectoryPage() {
  const alumniResponse = await getAlumni({
    populate: ["profile", "heroImage", "reviews"],
    filters: {
      publishedAt: { $notNull: true },
    },
    pagination: {
      pageSize: 100,
    },
  });

  // Get colleges data for search
  const collegesResponse = await getColleges({
    populate: ["heroImage"],
    filters: {
      publishedAt: { $notNull: true },
    },
    pagination: {
      pageSize: 50,
    },
  });

  // Extract testimonials from alumni reviews
  let testimonials: Testimonial[];
  try {
    testimonials = extractTestimonialsFromAlumni(alumniResponse.data);
  } catch (error) {
    console.error("Error extracting testimonials:", error);
    testimonials = [];
  }

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <AlumniDirectoryHero alumni={alumniResponse.data} colleges={collegesResponse.data} />
        <FeaturedMentorsSection alumni={alumniResponse.data} />
        <AlumniValuePropsSection />
        <Testimonials testimonials={testimonials} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}


