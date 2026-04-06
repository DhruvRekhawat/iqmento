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
import { getColleges, getAlumni } from "@/lib/cms";
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
  let collegesData: Awaited<ReturnType<typeof getColleges>>["data"] = [];
  let alumniForSearch: { slug: string; name: string; location: string; headline: string; image: string }[] = [];
  let testimonials: Testimonial[] = [];

  try {
    const [collegesResponse, alumniResponse] = await Promise.all([
      getColleges({ pagination: { pageSize: 100 } }).catch((err) => {
        console.error("Error fetching colleges:", err);
        return { data: [] as Awaited<ReturnType<typeof getColleges>>["data"], meta: { total: 0, page: 1, pageSize: 100 } };
      }),
      getAlumni({ pagination: { pageSize: 50 } }).catch((err) => {
        console.error("Error fetching alumni:", err);
        return { data: [] as Awaited<ReturnType<typeof getAlumni>>["data"], meta: { total: 0, page: 1, pageSize: 50 } };
      }),
    ]);

    collegesData = collegesResponse.data;

    alumniForSearch = alumniResponse.data.map((alum) => ({
      slug: alum.slug,
      name: alum.name,
      location: alum.location,
      headline: alum.headline,
      image: alum.image,
    }));

    try {
      testimonials = extractTestimonialsFromAlumni(alumniResponse.data);
    } catch (error) {
      console.error("Error extracting testimonials:", error);
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
