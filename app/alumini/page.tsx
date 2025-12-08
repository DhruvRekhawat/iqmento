import type { Metadata } from "next";

import { Navigation } from "@/components/sections/navigation";
import {
  AlumniDirectoryHero,
  FeaturedMentorsSection,
  AlumniValuePropsSection,
} from "@/components/sections/alumni-directory";
import { Testimonials } from "@/components/sections/testimonials";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { getAlumni, getColleges } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "All Alumni Mentors — Book 1:1 Sessions | IQMento",
  description:
    "Browse verified alumni mentors from IITs, NIDs, IIMs, global universities, and breakout startups. Book 1:1 sessions for portfolio reviews, interview prep, and career guidance.",
  openGraph: {
    title: "All Alumni Mentors — Book 1:1 Sessions | IQMento",
    description:
      "Browse verified alumni mentors from IITs, NIDs, IIMs, global universities, and breakout startups. Book 1:1 sessions for portfolio reviews, interview prep, and career guidance.",
    url: "https://iqmento.com/alumini",
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
    populate: ["profile", "heroImage"],
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

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <AlumniDirectoryHero alumni={alumniResponse.data} colleges={collegesResponse.data} />
        <FeaturedMentorsSection alumni={alumniResponse.data} />
        <AlumniValuePropsSection />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}


