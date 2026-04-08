import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/json-helpers";
import type { Metadata } from "next";
import type {
  CollegeProfile,
  CollegeHeroContent,
  CourseDetail,
  AdmissionStep,
  PlacementHighlight,
  ReviewDetail,
  FaqDetail,
} from "@/data/college-profiles";
import type {
  AlumniProfile,
  MentorSummary,
  FocusArea,
  SessionOffering,
  AlumniReview,
} from "@/data/alumni-profiles";

// Extended type for college listing pages (includes filter fields)
export type CollegeProfileWithMeta = CollegeProfile & {
  collegeType?: string | null;
  collegeTier?: string | null;
  rating?: number | null;
};

// Re-export types for convenience
export type { CollegeProfile, AlumniProfile };

// ---------- College helpers ----------

const defaultHero: CollegeHeroContent = {
  tagline: "Explore this college",
  description: "Learn more about this institution",
  badges: [],
  primaryAction: { label: "Learn More", href: "#" },
  secondaryAction: { label: "Download Brochure", href: "#" },
};

type DbCollege = NonNullable<Awaited<ReturnType<typeof prisma.college.findFirst>>>;
type DbAlumni = NonNullable<Awaited<ReturnType<typeof prisma.alumni.findFirst>>>;

function mapDbCollegeToProfile(c: DbCollege & { alumni?: DbAlumni[] }): CollegeProfileWithMeta {
  const collegeName = c.name || "College";
  return {
    collegeType: c.collegeType,
    collegeTier: c.collegeTier,
    rating: c.rating,
    slug: c.slug,
    name: c.name,
    shortName: c.shortName || undefined,
    location: c.location,
    heroImage: c.heroImageUrl || "/colleges/hero.png",
    hero: (() => {
      const parsed = parseJson<CollegeHeroContent>(c.hero, defaultHero);
      return {
        ...defaultHero,
        ...parsed,
        badges: parsed.badges ?? defaultHero.badges,
        primaryAction: parsed.primaryAction ?? defaultHero.primaryAction,
        secondaryAction: parsed.secondaryAction ?? defaultHero.secondaryAction,
      };
    })(),
    about: parseJson<string[]>(c.about, []),
    courses: parseJson<CourseDetail[]>(c.courses, []).map((course) => ({
      ...course,
      coursesOffered: course.coursesOffered ?? [],
    })),
    admission: (() => {
      const parsed = parseJson<{ title: string; subtitle: string; steps: AdmissionStep[] }>(
        c.admission,
        { title: "Admission Process", subtitle: "Learn about the admission requirements", steps: [] }
      );
      return { title: parsed.title || "Admission Process", subtitle: parsed.subtitle || "Learn about the admission requirements", steps: parsed.steps ?? [] };
    })(),
    recruiters: (() => {
      const parsed = parseJson<{
        title: string;
        logos: string[];
        cutoff: string[];
        placements: PlacementHighlight[];
      }>(c.recruiters, { title: "Top Recruiters", logos: [], cutoff: [], placements: [] });
      return { title: parsed.title || "Top Recruiters", logos: parsed.logos ?? [], cutoff: parsed.cutoff ?? [], placements: parsed.placements ?? [] };
    })(),
    reviews: parseJson<ReviewDetail[]>(c.reviews, []),
    alumni: (c.alumni || []).map((a) => ({
      name: a.name,
      role: a.currentJobRole || "Alumni",
      company: a.currentCompany || "",
      image: a.profileImageUrl || "/alumini-placeholder.png",
    })),
    faqs: parseJson<FaqDetail[]>(c.faqs, []),
    metadata: (() => {
      if (c.metaTitle || c.metaDescription) {
        const m: Metadata = {};
        if (c.metaTitle) m.title = c.metaTitle;
        if (c.metaDescription) m.description = c.metaDescription;
        if (c.metaTitle || c.metaDescription) {
          m.openGraph = {
            title: c.metaTitle || `${collegeName} | IQMento`,
            description: c.metaDescription || `Learn about ${collegeName}`,
          };
          m.twitter = {
            title: c.metaTitle || `${collegeName} | IQMento`,
            description: c.metaDescription || `Learn about ${collegeName}`,
          };
        }
        return m;
      }
      return {
        title: `${collegeName} | IQMento`,
        description: `Learn about ${collegeName}`,
        openGraph: { title: `${collegeName} | IQMento`, description: `Learn about ${collegeName}` },
        twitter: { title: `${collegeName} | IQMento`, description: `Learn about ${collegeName}` },
      };
    })(),
  };
}

function mapDbAlumniToProfile(a: DbAlumni): AlumniProfile {
  const slug = a.slug;
  return {
    slug,
    name: a.name,
    headline:
      a.headline ||
      [a.currentJobRole, a.currentCompany].filter(Boolean).join(" · ") ||
      "Alumni",
    location: a.location || a.jobLocation || "",
    heroTagline: a.heroTagline || a.bio || "",
    heroSummary: parseJson<string[]>(a.heroSummary, [a.bio || "Experienced professional"]),
    overview: parseJson<string[]>(a.overview, [a.bio || "Alumni profile information"]),
    image: a.profileImageUrl || "/alumini-placeholder.png",
    heroImage: a.heroImageUrl || a.profileImageUrl || "/alumini-placeholder.png",
    availability: a.availability || "Available for sessions",
    stats: parseJson<MentorSummary[]>(a.stats, []),
    focusAreas: parseJson<FocusArea[]>(a.focusAreas, []),
    sessions: parseJson<SessionOffering[]>(a.sessions, []),
    highlights: parseJson<string[]>(a.highlights, []),
    resources: parseJson<{ label: string; href: string }[]>(a.resources, []),
    reviews: parseJson<AlumniReview[]>(a.reviews, []),
    featuredQuote: a.featuredQuote || "",
    bookingUrl: a.bookingUrl || `https://iqmento.com/book/${slug}`,
    questionUrl: a.questionUrl || `https://iqmento.com/message/${slug}`,
  };
}

/**
 * Map DB alumni to simplified mentor card format (used by college pages, marquees)
 */
export function mapDbAlumniToMentorCard(a: DbAlumni): {
  slug: string;
  name: string;
  role: string;
  experience?: string;
  company?: string;
  image: string;
  location?: string;
  headline?: string;
  focusAreas?: string[];
} {
  const stats = parseJson<MentorSummary[]>(a.stats, []);
  const experience = stats.find((s) => s.label?.toLowerCase().includes("experience"))?.value;
  const focusAreas = parseJson<FocusArea[]>(a.focusAreas, []).map((fa) => fa.title);

  return {
    slug: a.slug,
    name: a.name,
    role: a.currentJobRole || "Alumni",
    experience,
    company: a.currentCompany || undefined,
    image: a.profileImageUrl || "/alumini-placeholder.png",
    location: a.location || a.jobLocation || undefined,
    headline: a.headline || undefined,
    focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
  };
}

// ---------- Public query functions ----------

export async function getColleges(options?: {
  filters?: {
    collegeType?: string;
    collegeTier?: string;
    search?: string;
    published?: boolean;
  };
  pagination?: { page?: number; pageSize?: number };
  sort?: string;
}): Promise<{ data: CollegeProfileWithMeta[]; meta: { total: number; page: number; pageSize: number } }> {
  const page = options?.pagination?.page || 1;
  const pageSize = options?.pagination?.pageSize || 25;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};

  // Default to published only
  where.published = options?.filters?.published !== undefined ? options.filters.published : true;

  if (options?.filters?.collegeType) {
    where.collegeType = options.filters.collegeType;
  }
  if (options?.filters?.collegeTier) {
    where.collegeTier = options.filters.collegeTier;
  }
  if (options?.filters?.search) {
    const search = options.filters.search;
    where.OR = [
      { name: { contains: search } },
      { location: { contains: search } },
      { shortName: { contains: search } },
    ];
  }

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: options?.sort
        ? { [options.sort.replace("-", "")]: options.sort.startsWith("-") ? "desc" : "asc" }
        : { createdAt: "desc" },
      include: { alumni: true },
    }),
    prisma.college.count({ where }),
  ]);

  return {
    data: colleges.map((c) => mapDbCollegeToProfile(c)),
    meta: { total, page, pageSize },
  };
}

export async function getCollegeBySlug(slug: string): Promise<CollegeProfile | null> {
  const college = await prisma.college.findFirst({
    where: { slug, published: true },
    include: { alumni: true },
  });

  if (!college) return null;
  // Filter published alumni in application code (LibSQL adapter doesn't support nested where in include)
  const filteredCollege = {
    ...college,
    alumni: college.alumni.filter((a) => a.published),
  };
  return mapDbCollegeToProfile(filteredCollege);
}

export async function getAlumni(options?: {
  filters?: {
    isFeatured?: boolean;
    isBookable?: boolean;
    collegeSlug?: string;
    search?: string;
    published?: boolean;
  };
  pagination?: { page?: number; pageSize?: number };
  sort?: string;
}): Promise<{ data: AlumniProfile[]; meta: { total: number; page: number; pageSize: number } }> {
  const page = options?.pagination?.page || 1;
  const pageSize = options?.pagination?.pageSize || 25;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};

  where.published = options?.filters?.published !== undefined ? options.filters.published : true;

  if (options?.filters?.isFeatured !== undefined) {
    where.isFeatured = options.filters.isFeatured;
  }
  if (options?.filters?.isBookable !== undefined) {
    where.isBookable = options.filters.isBookable;
  }
  if (options?.filters?.collegeSlug) {
    // Resolve college slug to ID (LibSQL adapter doesn't support nested relation filters)
    const college = await prisma.college.findFirst({
      where: { slug: options.filters.collegeSlug },
      select: { id: true },
    });
    where.collegeId = college?.id ?? "___none___";
  }
  if (options?.filters?.search) {
    const search = options.filters.search;
    where.OR = [
      { name: { contains: search } },
      { headline: { contains: search } },
      { currentCompany: { contains: search } },
      { location: { contains: search } },
      { course: { contains: search } },
    ];
  }

  const [alumni, total] = await Promise.all([
    prisma.alumni.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: options?.sort
        ? { [options.sort.replace("-", "")]: options.sort.startsWith("-") ? "desc" : "asc" }
        : { createdAt: "desc" },
    }),
    prisma.alumni.count({ where }),
  ]);

  return {
    data: alumni.map(mapDbAlumniToProfile),
    meta: { total, page, pageSize },
  };
}

export async function getAlumniBySlug(slug: string): Promise<AlumniProfile | null> {
  const alumni = await prisma.alumni.findFirst({
    where: { slug, published: true },
  });

  if (!alumni) return null;
  return mapDbAlumniToProfile(alumni);
}

/**
 * Get raw alumni records (for mentor cards, testimonials extraction, etc.)
 */
export async function getAlumniRaw(options?: {
  filters?: {
    isFeatured?: boolean;
    published?: boolean;
    collegeId?: string;
  };
  pagination?: { page?: number; pageSize?: number };
}) {
  const page = options?.pagination?.page || 1;
  const pageSize = options?.pagination?.pageSize || 25;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  where.published = options?.filters?.published !== undefined ? options.filters.published : true;

  if (options?.filters?.isFeatured !== undefined) {
    where.isFeatured = options.filters.isFeatured;
  }
  if (options?.filters?.collegeId) {
    where.collegeId = options.filters.collegeId;
  }

  const alumni = await prisma.alumni.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  return alumni;
}

/**
 * Get all college slugs (for static generation)
 */
export async function getAllCollegeSlugs(): Promise<string[]> {
  const colleges = await prisma.college.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return colleges.map((c) => c.slug);
}

/**
 * Get all alumni slugs (for static generation)
 */
export async function getAllAlumniSlugs(): Promise<string[]> {
  const alumni = await prisma.alumni.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return alumni.map((a) => a.slug);
}
