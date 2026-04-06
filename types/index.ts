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

// Re-export component types
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
  CollegeBadgeIcon,
} from "@/data/college-profiles";
