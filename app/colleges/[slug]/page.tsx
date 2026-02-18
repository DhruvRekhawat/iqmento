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
import { getCollegeBySlug, getColleges, getAlumni } from "@/lib/strapi";
import { mapStrapiCollegeToCollegeProfile, mapStrapiAlumniToMentorCard } from "@/lib/strapi-mappers";

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export async function generateStaticParams() {
  try {
    const collegesResponse = await getColleges({
      populate: ["heroImage"],
      filters: {
        publishedAt: { $notNull: true },
      },
      pagination: {
        pageSize: 100,
      },
    });

    if (!collegesResponse || !collegesResponse.data) {
      console.warn("No colleges data returned from Strapi for static params");
      return [];
    }

    return collegesResponse.data
      .map((college) => {
        const slug = college.slug;
        return slug ? { slug } : null;
      })
      .filter((item): item is { slug: string } => item !== null);
  } catch (error) {
    console.error("Error generating static params for colleges:", error);
    // Return empty array to allow build to continue, pages will be generated on-demand if not static
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collegeResponse = await getCollegeBySlug(slug, {
    populate: ["heroImage"],
  });

  if (!collegeResponse) {
    return {};
  }

  const profile = mapStrapiCollegeToCollegeProfile(collegeResponse.data);
  return profile.metadata;
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const collegeResponse = await getCollegeBySlug(slug, {
    populate: ["heroImage", "alumni"],
  });

  if (!collegeResponse) {
    notFound();
  }

  const profile = mapStrapiCollegeToCollegeProfile(collegeResponse.data);

  // Fetch alumni for the showcase if not already populated
  let alumniForShowcase = profile.alumni;
  if (alumniForShowcase.length === 0) {
    try {
      const alumniResponse = await getAlumni({
        populate: ["profile"],
        filters: {
          publishedAt: { $notNull: true },
        },
        pagination: {
          pageSize: 10,
        },
        sort: ["isFeatured:desc"],
      });

      alumniForShowcase = alumniResponse.data.slice(0, 5).map((alum) => {
        const mapped = mapStrapiAlumniToMentorCard(alum);
        return {
          name: mapped.name,
          role: mapped.role,
          company: mapped.company || "",
          image: mapped.image,
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


