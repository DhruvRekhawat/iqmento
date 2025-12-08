import type {
  StrapiCollectionResponse,
  StrapiResponse,
} from "@/types/strapi";
import type { StrapiAlumni } from "@/types/alumni";
import type { StrapiCollege } from "@/types/college";

/**
 * Strapi API configuration
 */
export const STRAPI_API_URL =
  process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
export const STRAPI_API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";
export const PAGE_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_PAGE_LIMIT || "25",
  10
);

if (!STRAPI_API_URL) {
  console.warn("BACKEND_BASE_URL or NEXT_PUBLIC_STRAPI_API_URL is not set");
}

/**
 * Build Strapi API URL
 */
function buildApiUrl(endpoint: string, params?: URLSearchParams): string {
  if (!STRAPI_API_URL) {
    throw new Error(
      "BACKEND_BASE_URL or NEXT_PUBLIC_STRAPI_API_URL environment variable is not set. " +
      "Please set it to your Strapi API URL (e.g., http://localhost:1337)"
    );
  }
  
  const url = new URL(endpoint, STRAPI_API_URL);
  if (params) {
    params.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
}

/**
 * Generic fetch function for Strapi API
 */
async function fetchStrapi<T>(
  endpoint: string,
  options?: {
    params?: URLSearchParams;
    populate?: string | string[];
    filters?: Record<string, unknown>;
    pagination?: {
      page?: number;
      pageSize?: number;
    };
    sort?: string | string[];
  }
): Promise<T> {
  const params = new URLSearchParams();

  // Add populate parameter
  // Strapi 5 syntax:
  // - Single field: populate=field
  // - All fields: populate=*
  // - For multiple specific fields, use populate=* to avoid media field relation errors
  //   (Media fields like profile/heroImage are auto-populated with populate=*)
  if (options?.populate) {
    if (Array.isArray(options.populate)) {
      if (options.populate.length === 0) {
        // Empty array, skip
      } else if (options.populate.length === 1) {
        // Single field in array
        const field = options.populate[0];
        if (field === "*") {
          params.append("populate", "*");
        } else {
          params.append("populate", field);
        }
      } else {
        // Multiple fields: use populate=* to get all fields including media
        // This avoids the profile.related error when using bracket notation
        // Media fields (profile, heroImage) are included automatically
        params.append("populate", "*");
      }
    } else {
      // Single field as string
      if (options.populate === "*") {
        params.append("populate", "*");
      } else {
        params.append("populate", options.populate);
      }
    }
  }

  // Add filters (handle nested objects and arrays)
  if (options?.filters) {
    const addFilter = (prefix: string, filterValue: unknown) => {
      if (filterValue === undefined || filterValue === null) return;
      
      if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
        // Handle nested objects (e.g., { $notNull: true }, { slug: "..." })
        Object.entries(filterValue).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue !== undefined && nestedValue !== null) {
            if (typeof nestedValue === 'object' && !Array.isArray(nestedValue)) {
              // Recursively handle deeply nested objects (e.g., college: { slug: "..." })
              Object.entries(nestedValue).forEach(([deepKey, deepValue]) => {
                params.append(`filters[${prefix}][${nestedKey}][${deepKey}]`, String(deepValue));
              });
            } else {
              params.append(`filters[${prefix}][${nestedKey}]`, String(nestedValue));
            }
          }
        });
      } else if (Array.isArray(filterValue)) {
        // Handle arrays (e.g., $or)
        filterValue.forEach((item, index) => {
          if (typeof item === 'object') {
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              if (itemValue !== undefined && itemValue !== null && typeof itemValue === 'object') {
                Object.entries(itemValue as Record<string, unknown>).forEach(([opKey, opValue]) => {
                  params.append(`filters[${prefix}][${index}][${itemKey}][${opKey}]`, String(opValue));
                });
              }
            });
          }
        });
      } else {
        // Simple value - use $eq operator for exact match
        params.append(`filters[${prefix}][$eq]`, String(filterValue));
      }
    };

    Object.entries(options.filters).forEach(([key, value]) => {
      addFilter(key, value);
    });
  }

  // Add pagination
  if (options?.pagination) {
    if (options.pagination.page !== undefined) {
      params.append("pagination[page]", String(options.pagination.page));
    }
    if (options.pagination.pageSize !== undefined) {
      params.append(
        "pagination[pageSize]",
        String(options.pagination.pageSize)
      );
    }
  } else {
    // Default pagination
    params.append("pagination[pageSize]", String(PAGE_LIMIT));
  }

  // Add sort
  if (options?.sort) {
    if (Array.isArray(options.sort)) {
      params.append("sort", options.sort.join(","));
    } else {
      params.append("sort", options.sort);
    }
  }

  // Merge with existing params
  if (options?.params) {
    options.params.forEach((value, key) => {
      params.append(key, value);
    });
  }

  const url = buildApiUrl(endpoint, params);

  // Log URL in development for debugging
  if (process.env.NODE_ENV === 'development' && !STRAPI_API_URL) {
    console.warn("STRAPI_API_URL is not set. API calls will fail.");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unable to read error response');
    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText}. URL: ${url}. Error: ${errorText}`
    );
  }

  return response.json();
}

/**
 * Get all alumni
 */
export async function getAlumni(options?: {
  populate?: string | string[];
  filters?: {
    isFeatured?: boolean;
    isBookable?: boolean;
    publishedAt?: { $notNull?: boolean };
    // Search by name, headline, company, location
    $or?: Array<{
      name?: { $containsi?: string };
      headline?: { $containsi?: string };
      currentCompany?: { $containsi?: string };
      location?: { $containsi?: string };
      course?: { $containsi?: string };
    }>;
    // Filter by college (relation)
    college?: {
      slug?: string;
      id?: number;
      name?: { $containsi?: string };
    };
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string | string[];
}): Promise<StrapiCollectionResponse<StrapiAlumni>> {
  return fetchStrapi<StrapiCollectionResponse<StrapiAlumni>>(
    "/api/alumni",
    options
  );
}

/**
 * Get single alumni by ID or documentId
 */
export async function getAlumniById(
  id: string | number,
  options?: {
    populate?: string | string[];
  }
): Promise<StrapiResponse<StrapiAlumni>> {
  return fetchStrapi<StrapiResponse<StrapiAlumni>>(
    `/api/alumni/${id}`,
    {
      ...options,
      populate: options?.populate || "*",
    }
  );
}

/**
 * Get single alumni by slug
 */
export async function getAlumniBySlug(
  slug: string,
  options?: {
    populate?: string | string[];
  }
): Promise<StrapiResponse<StrapiAlumni> | null> {
  const response = await getAlumni({
    ...options,
    filters: {
      slug,
      publishedAt: { $notNull: true },
    },
    populate: options?.populate || "*",
  });

  if (response.data.length === 0) {
    return null;
  }

  return {
    data: response.data[0],
    meta: response.meta,
  };
}

/**
 * Get all colleges
 */
export async function getColleges(options?: {
  populate?: string | string[];
  filters?: {
    publishedAt?: { $notNull?: boolean };
    // Filter by college type
    collegeType?: "IIT" | "NIT" | "IIM" | "NID" | "Medical" | "Law" | "Arts" | "Commerce" | "Engineering" | "Design" | "Business" | "Other";
    // Filter by tier
    collegeTier?: "Tier 1" | "Tier 2" | "Tier 3";
    // Filter by rating
    rating?: {
      $gte?: number;
      $lte?: number;
    };
    // Search by name, location, course names
    $or?: Array<{
      name?: { $containsi?: string };
      location?: { $containsi?: string };
      shortName?: { $containsi?: string };
    }>;
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string | string[];
}): Promise<StrapiCollectionResponse<StrapiCollege>> {
  return fetchStrapi<StrapiCollectionResponse<StrapiCollege>>(
    "/api/colleges",
    options
  );
}

/**
 * Get single college by ID or documentId
 */
export async function getCollegeById(
  id: string | number,
  options?: {
    populate?: string | string[];
  }
): Promise<StrapiResponse<StrapiCollege>> {
  return fetchStrapi<StrapiResponse<StrapiCollege>>(
    `/api/colleges/${id}`,
    {
      ...options,
      populate: options?.populate || "*",
    }
  );
}

/**
 * Get single college by slug
 */
export async function getCollegeBySlug(
  slug: string,
  options?: {
    populate?: string | string[];
  }
): Promise<StrapiResponse<StrapiCollege> | null> {
  const response = await getColleges({
    ...options,
    filters: {
      slug,
      publishedAt: { $notNull: true },
    },
    populate: options?.populate || "*",
  });

  if (response.data.length === 0) {
    return null;
  }

  return {
    data: response.data[0],
    meta: response.meta,
  };
}

