import type { StrapiEntityAttributes, StrapiMedia, StrapiResponse } from "./strapi";
import type { StrapiCollege } from "./college";

/**
 * Alumni content type from Strapi
 * Based on actual API response structure
 */
export interface StrapiAlumni extends StrapiEntityAttributes {
  almuniId: string | null;
  bio: string | null;
  course: string | null;
  graduationYear: number | null;
  currentCompany: string | null;
  currentJobRole: string | null;
  jobLocation: string | null;
  mobileNumber: string | null;
  mail: string | null;
  profile: StrapiMedia | null;
  isBookable: boolean | null;
  isFeatured: boolean | null;
  // Additional fields that might exist in Strapi
  slug?: string | null;
  name?: string | null;
  headline?: string | null;
  location?: string | null;
  heroTagline?: string | null;
  // API returns object, but mapper transforms to string[]
  heroSummary?: string[] | { title?: string; subtitle?: string; highlights?: string[] } | null;
  // API returns object, but mapper transforms to string[]
  overview?: string[] | { experience?: string; expertise?: string[]; achievements?: string[] } | null;
  heroImage?: StrapiMedia | null;
  availability?: string | null;
  // API returns object, but mapper transforms to Array<{label, value}>
  stats?: Array<{ label: string; value: string }> | { sessions?: number; students?: number; rating?: number; experience?: string } | null;
  // API returns {name, description}, mapper transforms to {title, description}
  focusAreas?: Array<{ title?: string; name?: string; description: string }> | null;
  // API returns {title, duration, price, description}, mapper may need to add format
  sessions?: Array<{
    title: string;
    description?: string;
    duration: string;
    format?: string;
    price: string;
  }> | null;
  highlights?: string[] | null;
  // API returns {title, url}, mapper transforms to {label, href}
  resources?: Array<{ label?: string; title?: string; href?: string; url?: string }> | null;
  // API returns {rating, comment, author}, mapper transforms to {quote, name, role, rating}
  reviews?: Array<{
    quote?: string;
    comment?: string;
    name?: string;
    author?: string;
    role?: string;
    rating?: number;
  }> | null;
  featuredQuote?: string | null;
  bookingUrl?: string | null;
  questionUrl?: string | null;
  // Relations
  college?: StrapiResponse<StrapiCollege> | null;
}

/**
 * Alumni response from Strapi API
 */
export type StrapiAlumniResponse = StrapiAlumni;
export type StrapiAlumniCollectionResponse = StrapiAlumni[];
