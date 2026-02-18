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
  let collegesData: any[] = [];
  let alumniForSearch: any[] = [];
  let testimonials: Testimonial[] = [];

  try {
    const [collegesResponse, alumniResponse] = await Promise.all([
      getColleges({
        populate: ["heroImage"],
        filters: {
          publishedAt: { $notNull: true },
        },
        pagination: {
          pageSize: 100,
        },
      }).catch(err => {
        console.error("Error fetching colleges:", err);
        return { data: [], meta: {} };
      }),
      getAlumni({
        populate: ["profile"],
        filters: {
          publishedAt: { $notNull: true },
        },
        pagination: {
          pageSize: 50,
        },
      }).catch(err => {
        console.error("Error fetching alumni for college search:", err);
        return { data: [], meta: {} };
      })
    ]);

    collegesData = collegesResponse.data || [];
    
    // Transform alumni data for search (ensure slug is always a string)
    alumniForSearch = (alumniResponse.data || []).map((alum: any) => {
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
    try {
      const testimonialsResponse = await getAlumni({
        populate: "*",
        filters: {
          publishedAt: { $notNull: true },
        },
        pagination: {
          pageSize: 100,
        },
      }).catch(() => ({ data: [], meta: {} }));
      
      testimonials = extractTestimonialsFromAlumni(testimonialsResponse.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  } catch (error) {
    console.error("Critical error in AllCollegesPage:", error);
  }

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <CollegesHero colleges={collegesData} alumni={alumniForSearch} />
        <CollegesExplorer colleges={collegesData} />
        <FeaturedColleges colleges={collegesData} />
        <Testimonials testimonials={testimonials} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}

