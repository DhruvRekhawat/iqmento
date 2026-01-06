import type { StrapiAlumni } from "@/types/alumni";
import type { Testimonial } from "@/components/sections/testimonials/Testimonials";

/**
 * Extract and transform reviews from alumni data into testimonials format
 */
export function extractTestimonialsFromAlumni(
  alumni: StrapiAlumni[]
): Testimonial[] {
  // Extract reviews from all alumni
  const testimonialsWithRating: Array<Testimonial & { rating?: number }> = [];

  for (const alum of alumni) {
    if (!alum.reviews || !Array.isArray(alum.reviews)) {
      continue;
    }

    for (const review of alum.reviews) {
      // Only include reviews that have a quote/comment
      const quote = review.quote || review.comment;
      if (!quote || quote.trim().length === 0) {
        continue;
      }

      // Extract name and role/context
      const name = review.name || review.author || "Anonymous";
      const role = review.role || "Student";
      
      // Build context - combine name location if available, otherwise use role
      let context = role;
      if (alum.location) {
        // Try to extract city from location (e.g., "Bangalore, India" -> "Bangalore")
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
    // First sort by rating if available
    if (a.rating !== undefined && b.rating !== undefined) {
      return b.rating - a.rating;
    }
    if (a.rating !== undefined) return -1;
    if (b.rating !== undefined) return 1;
    // If no rating, sort by quote length (more detailed first)
    return b.quote.length - a.quote.length;
  });

  // Limit to top 10 testimonials and remove rating from output
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return testimonialsWithRating.slice(0, 10).map(({ rating, ...testimonial }) => testimonial);
}

