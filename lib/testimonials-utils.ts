import type { AlumniProfile } from "@/data/alumni-profiles";
import type { Testimonial } from "@/components/sections/testimonials/Testimonials";

/**
 * Extract and transform reviews from alumni data into testimonials format
 */
export function extractTestimonialsFromAlumni(
  alumni: AlumniProfile[]
): Testimonial[] {
  const testimonialsWithRating: Array<Testimonial & { rating?: number }> = [];

  for (const alum of alumni) {
    if (!alum.reviews || alum.reviews.length === 0) {
      continue;
    }

    for (const review of alum.reviews) {
      const quote = review.quote;
      if (!quote || quote.trim().length === 0) {
        continue;
      }

      const name = review.name || "Anonymous";
      const role = review.role || "Student";

      // Build context - combine city from location if available
      let context = role;
      if (alum.location) {
        const city = alum.location.split(",")[0]?.trim();
        if (city) {
          context = `${city}${role !== "Student" ? ` · ${role}` : ""}`;
        }
      }

      testimonialsWithRating.push({
        quote: quote.trim(),
        name,
        context,
        rating: review.rating,
      });
    }
  }

  // Sort by rating (highest first) if available, then by length (more detailed first)
  testimonialsWithRating.sort((a, b) => {
    if (a.rating !== undefined && b.rating !== undefined) {
      return b.rating - a.rating;
    }
    if (a.rating !== undefined) return -1;
    if (b.rating !== undefined) return 1;
    return b.quote.length - a.quote.length;
  });

  // Limit to top 10 testimonials and remove rating from output
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return testimonialsWithRating.slice(0, 10).map(({ rating, ...testimonial }) => testimonial);
}
