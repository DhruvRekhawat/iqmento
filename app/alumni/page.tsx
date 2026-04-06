import type { Metadata } from "next";

import { Navigation } from "@/components/sections/navigation";
import {
  AlumniDirectoryHero,
  FeaturedMentorsSection,
  AlumniValuePropsSection,
  AllAlumniGrid,
} from "@/components/sections/alumni-directory";
import { Testimonials } from "@/components/sections/testimonials";
import type { Testimonial } from "@/components/sections/testimonials/Testimonials";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { getAlumni, getColleges } from "@/lib/cms";
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
  let alumniData: Awaited<ReturnType<typeof getAlumni>>["data"] = [];
  let collegesData: Awaited<ReturnType<typeof getColleges>>["data"] = [];
  let testimonials: Testimonial[] = [];

  try {
    const [alumniResponse, collegesResponse] = await Promise.all([
      getAlumni({ pagination: { pageSize: 100 } }).catch((err) => {
        console.error("Error fetching alumni:", err);
        return { data: [] as Awaited<ReturnType<typeof getAlumni>>["data"], meta: { total: 0, page: 1, pageSize: 100 } };
      }),
      getColleges({ pagination: { pageSize: 50 } }).catch((err) => {
        console.error("Error fetching colleges:", err);
        return { data: [] as Awaited<ReturnType<typeof getColleges>>["data"], meta: { total: 0, page: 1, pageSize: 50 } };
      }),
    ]);

    alumniData = alumniResponse.data;
    collegesData = collegesResponse.data;

    try {
      testimonials = extractTestimonialsFromAlumni(alumniData);
    } catch (error) {
      console.error("Error extracting testimonials:", error);
    }
  } catch (error) {
    console.error("Critical error in AlumniDirectoryPage:", error);
  }

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <AlumniDirectoryHero alumni={alumniData} colleges={collegesData} />
        <FeaturedMentorsSection alumni={alumniData} />
        <AllAlumniGrid alumni={alumniData} />
        <AlumniValuePropsSection />
        <Testimonials testimonials={testimonials} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
