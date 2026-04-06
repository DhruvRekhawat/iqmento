import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Navigation } from "@/components/sections/navigation";
import {
  AlumniShowcase,
  CollegeHero,
  FaqsSection,
  OverviewAndCoursesSection,
  AdmissionProcessSection,
  RecruitersSection,
  ReviewsSection,
} from "@/components/sections/college-detail";
import { CallToAction } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { getCollegeBySlug, getAllCollegeSlugs, getAlumniRaw, mapDbAlumniToMentorCard } from "@/lib/cms";

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getAllCollegeSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Error generating static params for colleges:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getCollegeBySlug(slug);
  if (!profile) return {};
  return profile.metadata;
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getCollegeBySlug(slug);

  if (!profile) {
    notFound();
  }

  // Fetch alumni for the showcase if not already populated from relation
  let alumniForShowcase = profile.alumni;
  if (alumniForShowcase.length === 0) {
    try {
      const rawAlumni = await getAlumniRaw({
        pagination: { pageSize: 5 },
      });
      alumniForShowcase = rawAlumni.slice(0, 5).map((alum) => {
        const card = mapDbAlumniToMentorCard(alum);
        return {
          name: card.name,
          role: card.role,
          company: card.company || "",
          image: card.image,
        };
      });
    } catch (error) {
      console.error("Error fetching alumni for showcase:", error);
    }
  }

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <CollegeHero profile={profile} />
        <OverviewAndCoursesSection about={profile.about} courses={profile.courses} />
        <AdmissionProcessSection admission={profile.admission} />
        <RecruitersSection recruiters={profile.recruiters} />
        <ReviewsSection reviews={profile.reviews} name={profile.shortName ?? profile.name} />
        <AlumniShowcase alumni={alumniForShowcase} />
        <FaqsSection faqs={profile.faqs} name={profile.shortName ?? profile.name} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
