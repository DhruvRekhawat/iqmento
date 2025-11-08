import { Navigation } from "@/components/sections/navigation";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Roadmap } from "@/components/sections/roadmap";
import { Audience } from "@/components/sections/audience";
import { Alumni, AlumniHighlights } from "@/components/sections/alumni";
import { FeaturedColleges } from "@/components/sections/colleges";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <Hero />
        <Features />
        <Roadmap />
        <Audience />
        <Alumni />
        <AlumniHighlights />
        <FeaturedColleges />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
