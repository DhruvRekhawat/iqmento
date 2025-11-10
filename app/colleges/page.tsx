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

export default function AllCollegesPage() {
  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <CollegesHero />
        <CollegesExplorer />
        <FeaturedColleges />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}

