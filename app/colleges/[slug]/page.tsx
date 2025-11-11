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
import {
  collegeProfiles,
  getCollegeProfile,
} from "@/data/college-profiles";

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export function generateStaticParams() {
  return collegeProfiles.map((college) => ({
    slug: college.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getCollegeProfile(slug);

  if (!profile) {
    return {};
  }

  return profile.metadata;
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getCollegeProfile(slug);

  if (!profile) {
    notFound();
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
        <AlumniShowcase alumni={profile.alumni} />
        <FaqsSection faqs={profile.faqs} name={profile.shortName ?? profile.name} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}


