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
      "Get honest, 1:1 guidance from mentors who have already navigated the journey you’re starting.",
  },
};

export default function AlumniDirectoryPage() {
  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <AlumniDirectoryHero />
        <FeaturedMentorsSection />
        <AlumniValuePropsSection />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}


