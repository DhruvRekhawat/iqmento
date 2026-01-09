import { Navigation } from "@/components/sections/navigation";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Roadmap } from "@/components/sections/roadmap";
import { Audience } from "@/components/sections/audience";
import { Alumni, AlumniHighlights } from "@/components/sections/alumni";
import { FeaturedColleges } from "@/components/sections/colleges";
import { Testimonials } from "@/components/sections/testimonials";
import type { Testimonial } from "@/components/sections/testimonials/Testimonials";
import { FAQ } from "@/components/sections/faq";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { getColleges, getAlumni } from "@/lib/strapi";
import { extractTestimonialsFromAlumni } from "@/lib/testimonials-utils";

export default async function Home() {
  const collegesResponse = await getColleges({
    populate: ["heroImage"],
    filters: {
      publishedAt: { $notNull: true },
    },
    pagination: {
      pageSize: 6,
    },
  });

  // Fetch alumni with reviews for testimonials
  let testimonials: Testimonial[];
  try {
    const alumniResponse = await getAlumni({
      populate: "*",
      filters: {
        publishedAt: { $notNull: true },
      },
      pagination: {
        pageSize: 100,
      },
    });
    testimonials = extractTestimonialsFromAlumni(alumniResponse.data);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    testimonials = [];
  }

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
        <FeaturedColleges colleges={collegesResponse.data} />
        <Testimonials testimonials={testimonials} />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
