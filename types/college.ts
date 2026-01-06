import type { StrapiEntityAttributes, StrapiMedia } from "./strapi";
import type { StrapiAlumni } from "./alumni";

/**
 * College badge icon type
 */
export type CollegeBadgeIcon = "award" | "shield" | "sparkles" | "trophy" | "users";

/**
 * College content type from Strapi
 */
export interface StrapiCollege extends StrapiEntityAttributes {
  slug: string | null;
  name: string | null;
  shortName?: string | null;
  location: string | null;
  heroImage: StrapiMedia | null;
  // API may return {title, subtitle, description} or {tagline, description, badges, primaryAction, secondaryAction}
  hero?: {
    tagline?: string | null;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    badges?: Array<{ label: string; icon: CollegeBadgeIcon }> | null;
    primaryAction?: { label: string; href: string } | null;
    secondaryAction?: { label: string; href: string } | null;
  } | null;
  // API may return object {description, established, campus, totalStudents, faculty} or string[]
  about?: string[] | { description?: string; established?: number; campus?: string; totalStudents?: number; faculty?: number } | null;
  // API may return {name, duration, seats} or full structure
  courses?: Array<{
    name: string;
    fees?: string;
    duration: string;
    studyMode?: string;
    coursesOffered?: string[];
    eligibility?: string;
    brochureUrl?: string;
    expertsUrl?: string;
    seats?: number;
  }> | null;
  // API may return {process, exam, applicationDeadline, fees} or {title, subtitle, steps}
  admission?: {
    title?: string | null;
    subtitle?: string | null;
    steps?: Array<{
      title: string;
      description: string;
      highlight?: boolean;
    }> | null;
    process?: string | null;
    exam?: string | null;
    applicationDeadline?: string | null;
    fees?: { bachelors?: string; masters?: string } | null;
  } | null;
  // API may return string[] or {title, logos, cutoff, placements}
  recruiters?: string[] | {
    title?: string | null;
    logos?: string[] | null;
    cutoff?: string[] | null;
    placements?: Array<{ label: string; value: string }> | null;
  } | null;
  // API returns {rating, comment, author}, mapper transforms to {quote, name, role, rating}
  reviews?: Array<{
    quote?: string;
    comment?: string;
    name?: string;
    author?: string;
    role?: string;
    rating?: number;
  }> | null;
  // Alumni relation (oneToMany) - when populated, returns { data: StrapiAlumni[] }
  alumni?: { data: StrapiAlumni[] } | null;
  // Legacy: Alumni as JSON array (for backward compatibility during migration)
  alumniLegacy?: Array<{
    name: string;
    role: string;
    company: string;
    image: string;
  }> | null;
  faqs?: Array<{
    question: string;
    answer: string;
  }> | null;
  // Filter fields
  collegeType?: "IIT" | "NIT" | "IIM" | "NID" | "Medical" | "Law" | "Arts" | "Commerce" | "Engineering" | "Design" | "Business" | "Other" | null;
  collegeTier?: "Tier 1" | "Tier 2" | "Tier 3" | null;
  rating?: number | null;
  metadata?: {
    title?: string | null;
    description?: string | null;
    openGraph?: {
      title?: string | null;
      description?: string | null;
    } | null;
    twitter?: {
      card?: string | null;
      title?: string | null;
      description?: string | null;
    } | null;
  } | null;
}

/**
 * College response from Strapi API
 */
export type StrapiCollegeResponse = StrapiCollege;
export type StrapiCollegeCollectionResponse = StrapiCollege[];

