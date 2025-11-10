import type { Metadata } from "next";

import { Navigation } from "@/components/sections/navigation";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import {
  AboutHero,
  OurMission,
  OurStory,
  WhatWeBelieve,
  WhatWeDo,
} from "@/components/sections/about";

export const metadata: Metadata = {
  title: "About IQMento — The Story Behind the College Insider",
  description:
    "Learn how IQMento connects students with alumni mentors to provide transparent, insider guidance for every college decision.",
  openGraph: {
    title: "About IQMento — The Story Behind the College Insider",
    description:
      "Learn how IQMento connects students with alumni mentors to provide transparent, insider guidance for every college decision.",
    url: "https://iqmento.com/about-us",
    siteName: "IQMento",
  },
  twitter: {
    card: "summary_large_image",
    title: "About IQMento — The Story Behind the College Insider",
    description:
      "Learn how IQMento connects students with alumni mentors to provide transparent, insider guidance for every college decision.",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <AboutHero />
        <OurStory />
        <OurMission />
        <WhatWeDo />
        <WhatWeBelieve />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}


