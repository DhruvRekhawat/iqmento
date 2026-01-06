/**
 * Unified type exports
 * Import all types from this file to ensure consistency across the application
 */

// Topmate-style frontend app types (frontend-only)
export type { UserRole, User } from "./auth";
export type { Service } from "./services";
export type { AvailabilitySlot } from "./availability";
export type { Alumni, College, Booking, AlumniStats } from "./bookings";
export type { Meeting } from "./meetings";

// Base Strapi types
export type {
  StrapiMedia,
  StrapiMediaFormat,
  StrapiPagination,
  StrapiMeta,
  StrapiResponse,
  StrapiCollectionResponse,
  StrapiEntityAttributes,
  Populated,
} from "./strapi";

// Alumni types
export type {
  StrapiAlumni,
  StrapiAlumniResponse,
  StrapiAlumniCollectionResponse,
} from "./alumni";

// College types
export type {
  StrapiCollege,
  StrapiCollegeResponse,
  StrapiCollegeCollectionResponse,
  CollegeBadgeIcon,
} from "./college";

// Re-export existing component types for compatibility
export type {
  AlumniProfile,
  MentorSummary,
  FocusArea,
  SessionOffering,
  AlumniReview,
} from "@/data/alumni-profiles";

export type {
  CollegeProfile,
  CollegeHeroContent,
  CourseDetail,
  AdmissionStep,
  PlacementHighlight,
  ReviewDetail,
  AlumniDetail,
  FaqDetail,
} from "@/data/college-profiles";

