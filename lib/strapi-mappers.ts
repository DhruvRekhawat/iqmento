import type { StrapiAlumni } from "@/types/alumni";
import type { StrapiCollege } from "@/types/college";
import type { AlumniProfile } from "@/data/alumni-profiles";
import type { CollegeProfile } from "@/data/college-profiles";

/**
 * Get media URL from Strapi media object
 */
function getMediaUrl(media: { url: string } | null | undefined): string {
  if (!media) {
    return "/alumini-placeholder.png";
  }

  // If URL is already absolute, return as is
  if (media.url.startsWith("http://") || media.url.startsWith("https://")) {
    return media.url;
  }

  // Otherwise, prepend Strapi API URL
  const baseUrl = process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
  if (baseUrl && !media.url.startsWith("/")) {
    return `${baseUrl}${media.url}`;
  }

  return media.url.startsWith("/") ? media.url : `/${media.url}`;
}

/**
 * Map Strapi Alumni to AlumniProfile
 */
export function mapStrapiAlumniToAlumniProfile(
  strapiAlumni: StrapiAlumni
): AlumniProfile {
  // Extract role and company from headline if available
  const headline = strapiAlumni.headline || "";
  const [role, company] = headline
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  // Build stats from available data
  const stats: Array<{ label: string; value: string }> = [];
  if (strapiAlumni.graduationYear) {
    stats.push({
      label: "Graduation Year",
      value: String(strapiAlumni.graduationYear),
    });
  }
  if (strapiAlumni.currentCompany) {
    stats.push({
      label: "Current Company",
      value: strapiAlumni.currentCompany,
    });
  }

  // Transform stats if it's an object
  let transformedStats = stats;
  if (strapiAlumni.stats && !Array.isArray(strapiAlumni.stats)) {
    const statsObj = strapiAlumni.stats as { sessions?: number; students?: number; rating?: number; experience?: string };
    transformedStats = [];
    if (statsObj.sessions !== undefined) {
      transformedStats.push({ label: "Sessions", value: String(statsObj.sessions) });
    }
    if (statsObj.students !== undefined) {
      transformedStats.push({ label: "Students", value: String(statsObj.students) });
    }
    if (statsObj.rating !== undefined) {
      transformedStats.push({ label: "Rating", value: String(statsObj.rating) });
    }
    if (statsObj.experience) {
      transformedStats.push({ label: "Experience", value: statsObj.experience });
    }
  } else if (Array.isArray(strapiAlumni.stats)) {
    transformedStats = strapiAlumni.stats;
  }

  // Transform heroSummary
  let heroSummary: string[] = [];
  if (Array.isArray(strapiAlumni.heroSummary)) {
    heroSummary = strapiAlumni.heroSummary;
  } else if (strapiAlumni.heroSummary && typeof strapiAlumni.heroSummary === 'object') {
    const summaryObj = strapiAlumni.heroSummary as { title?: string; subtitle?: string; highlights?: string[] };
    if (summaryObj.title) heroSummary.push(summaryObj.title);
    if (summaryObj.subtitle) heroSummary.push(summaryObj.subtitle);
    if (summaryObj.highlights) heroSummary.push(...summaryObj.highlights);
  }
  if (heroSummary.length === 0) {
    heroSummary = [strapiAlumni.bio || "Experienced professional"];
  }

  // Transform overview
  let overview: string[] = [];
  if (Array.isArray(strapiAlumni.overview)) {
    overview = strapiAlumni.overview;
  } else if (strapiAlumni.overview && typeof strapiAlumni.overview === 'object') {
    const overviewObj = strapiAlumni.overview as { experience?: string; expertise?: string[]; achievements?: string[] };
    if (overviewObj.experience) overview.push(`Experience: ${overviewObj.experience}`);
    if (overviewObj.expertise) overview.push(`Expertise: ${overviewObj.expertise.join(", ")}`);
    if (overviewObj.achievements) overview.push(...overviewObj.achievements.map(a => `• ${a}`));
  }
  if (overview.length === 0) {
    overview = [strapiAlumni.bio || "Alumni profile information"];
  }

  // Transform focusAreas (name -> title)
  const focusAreas = (strapiAlumni.focusAreas || []).map(fa => ({
    title: fa.title || fa.name || "Focus Area",
    description: fa.description || "",
  }));

  // Transform sessions (add format if missing)
  const sessions = (strapiAlumni.sessions || []).map(s => ({
    title: s.title,
    description: s.description || "",
    duration: s.duration,
    format: s.format || "1-on-1",
    price: s.price,
  }));

  // Transform resources (title/url -> label/href)
  const resources = (strapiAlumni.resources || []).map(r => ({
    label: r.label || r.title || "Resource",
    href: r.href || r.url || "#",
  }));

  // Transform reviews (comment/author -> quote/name/role)
  const reviews = (strapiAlumni.reviews || []).map(r => ({
    quote: r.quote || r.comment || "",
    name: r.name || r.author || "Anonymous",
    role: r.role || "Student",
    rating: r.rating,
  }));

  // Build slug from name or almuniId
  const slug =
    strapiAlumni.slug ||
    (strapiAlumni.name
      ? strapiAlumni.name.toLowerCase().replace(/\s+/g, "-")
      : strapiAlumni.almuniId?.toLowerCase() || "unknown");

  return {
    slug,
    name: strapiAlumni.name || "Unknown",
    headline:
      strapiAlumni.headline ||
      [role || strapiAlumni.currentJobRole, company || strapiAlumni.currentCompany]
        .filter(Boolean)
        .join(" · ") ||
      "Alumni",
    location: strapiAlumni.location || strapiAlumni.jobLocation || "",
    heroTagline: strapiAlumni.heroTagline || strapiAlumni.bio || "",
    heroSummary,
    overview,
    image: getMediaUrl(strapiAlumni.profile),
    heroImage: getMediaUrl(strapiAlumni.heroImage || strapiAlumni.profile),
    availability: strapiAlumni.availability || "Available for sessions",
    stats: transformedStats,
    focusAreas,
    sessions,
    highlights: strapiAlumni.highlights || [],
    resources,
    reviews,
    featuredQuote: strapiAlumni.featuredQuote || "",
    bookingUrl: strapiAlumni.bookingUrl || `https://iqmento.com/book/${slug}`,
    questionUrl: strapiAlumni.questionUrl || `https://iqmento.com/message/${slug}`,
  };
}

/**
 * Map Strapi College to CollegeProfile
 */
export function mapStrapiCollegeToCollegeProfile(
  strapiCollege: StrapiCollege
): CollegeProfile {
  const slug = strapiCollege.slug || "unknown-college";

  // Transform hero (title/subtitle -> tagline)
  let hero = strapiCollege.hero;
  if (hero && (hero.title || hero.subtitle)) {
    hero = {
      tagline: hero.tagline || hero.title || hero.subtitle || "Explore this college",
      description: hero.description || "",
      badges: hero.badges || [],
      primaryAction: hero.primaryAction || {
        label: "Learn More",
        href: "#",
      },
      secondaryAction: hero.secondaryAction || {
        label: "Download Brochure",
        href: "#",
      },
    };
  } else {
    hero = hero || {
      tagline: "Explore this college",
      description: "Learn more about this institution",
      badges: [],
      primaryAction: {
        label: "Learn More",
        href: "#",
      },
      secondaryAction: {
        label: "Download Brochure",
        href: "#",
      },
    };
  }

  // Transform about (object -> string[])
  let about: string[] = [];
  if (Array.isArray(strapiCollege.about)) {
    about = strapiCollege.about;
  } else if (strapiCollege.about && typeof strapiCollege.about === 'object') {
    const aboutObj = strapiCollege.about as { description?: string; established?: number; campus?: string; totalStudents?: number; faculty?: number };
    if (aboutObj.description) about.push(aboutObj.description);
    if (aboutObj.established) about.push(`Established: ${aboutObj.established}`);
    if (aboutObj.campus) about.push(`Campus: ${aboutObj.campus}`);
    if (aboutObj.totalStudents) about.push(`Total Students: ${aboutObj.totalStudents}`);
    if (aboutObj.faculty) about.push(`Faculty: ${aboutObj.faculty}`);
  }

  // Transform courses (add missing fields)
  const courses = (strapiCollege.courses || []).map(c => ({
    name: c.name,
    fees: c.fees || "Contact for details",
    duration: c.duration,
    studyMode: c.studyMode || "Full-time",
    coursesOffered: c.coursesOffered || [c.name],
    eligibility: c.eligibility || "Check official website",
    brochureUrl: c.brochureUrl || "#",
    expertsUrl: c.expertsUrl || "#",
  }));

  // Transform admission (process/exam/fees -> title/subtitle/steps)
  let admission = strapiCollege.admission;
  if (admission && (admission.process || admission.exam)) {
    const steps: Array<{ title: string; description: string; highlight?: boolean }> = [];
    if (admission.exam) {
      steps.push({ title: "Entrance Exam", description: admission.exam, highlight: true });
    }
    if (admission.process) {
      steps.push({ title: "Application Process", description: admission.process });
    }
    if (admission.applicationDeadline) {
      steps.push({ title: "Application Deadline", description: admission.applicationDeadline });
    }
    admission = {
      title: admission.title || "Admission Process",
      subtitle: admission.subtitle || "Learn about the admission requirements",
      steps: steps.length > 0 ? steps : admission.steps || [],
    };
  } else {
    admission = admission || {
      title: "Admission Process",
      subtitle: "Learn about the admission requirements",
      steps: [],
    };
  }

  // Transform recruiters (string[] -> object)
  let recruiters = strapiCollege.recruiters;
  if (Array.isArray(recruiters)) {
    recruiters = {
      title: "Top Recruiters",
      logos: recruiters,
      cutoff: [],
      placements: [],
    };
  } else if (!recruiters) {
    recruiters = {
      title: "Top Recruiters",
      logos: [],
      cutoff: [],
      placements: [],
    };
  }

  // Transform reviews (comment/author -> quote/name/role)
  const reviews = (strapiCollege.reviews || []).map(r => ({
    quote: r.quote || r.comment || "",
    name: r.name || r.author || "Anonymous",
    role: r.role || "Student",
    rating: r.rating,
  }));

  return {
    slug,
    name: strapiCollege.name || "Unknown College",
    shortName: strapiCollege.shortName || undefined,
    location: strapiCollege.location || "",
    heroImage: getMediaUrl(strapiCollege.heroImage),
    hero,
    about,
    courses,
    admission,
    recruiters,
    reviews,
    alumni: (() => {
      // Handle relation format ({ data: StrapiAlumni[] })
      if (strapiCollege.alumni && 'data' in strapiCollege.alumni && Array.isArray(strapiCollege.alumni.data)) {
        // It's a relation - map from StrapiAlumni objects
        return strapiCollege.alumni.data
          .map((alum) => {
            const mapped = mapStrapiAlumniToMentorCard(alum);
            return {
              name: mapped.name,
              role: mapped.role,
              company: mapped.company || "",
              image: mapped.image,
            };
          })
          .filter((alum) => alum.name !== "Unknown");
      }
      // Fallback to legacy JSON format (if alumniLegacy exists)
      if (strapiCollege.alumniLegacy) {
        return strapiCollege.alumniLegacy.map((alum) => ({
          name: alum.name,
          role: alum.role,
          company: alum.company,
          image: alum.image,
        }));
      }
      // Return empty array if no alumni data
      return [];
    })(),
    faqs: strapiCollege.faqs || [],
    metadata: strapiCollege.metadata || {
      title: `${strapiCollege.name} | IQMento`,
      description: `Learn about ${strapiCollege.name}`,
      openGraph: {
        title: `${strapiCollege.name} | IQMento`,
        description: `Learn about ${strapiCollege.name}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${strapiCollege.name} | IQMento`,
        description: `Learn about ${strapiCollege.name}`,
      },
    },
  };
}

/**
 * Map Strapi Alumni to simplified mentor card format
 */
export function mapStrapiAlumniToMentorCard(strapiAlumni: StrapiAlumni): {
  slug: string;
  name: string;
  role: string;
  experience?: string;
  company?: string;
  image: string;
} {
  const headline = strapiAlumni.headline || "";
  const [role, company] = headline
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  const slug =
    strapiAlumni.slug ||
    (strapiAlumni.name
      ? strapiAlumni.name.toLowerCase().replace(/\s+/g, "-")
      : strapiAlumni.almuniId?.toLowerCase() || "unknown");

  // Handle stats - can be array or object
  let experience: string | undefined;
  if (strapiAlumni.stats) {
    if (Array.isArray(strapiAlumni.stats)) {
      // Stats is an array: [{label: "Experience", value: "8 years"}]
      experience = strapiAlumni.stats.find((stat) =>
        stat.label?.toLowerCase().includes("experience")
      )?.value;
    } else if (typeof strapiAlumni.stats === 'object') {
      // Stats is an object: {experience: "8 years", sessions: 150, ...}
      const statsObj = strapiAlumni.stats as { experience?: string; [key: string]: unknown };
      experience = statsObj.experience;
    }
  }

  return {
    slug,
    name: strapiAlumni.name || "Unknown",
    role: role || strapiAlumni.currentJobRole || "Alumni",
    experience,
    company: company || strapiAlumni.currentCompany || undefined,
    image: getMediaUrl(strapiAlumni.profile),
  };
}

