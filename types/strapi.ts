/**
 * Base Strapi response types
 * Based on Strapi 5 API response structure
 */

/**
 * Strapi media/image type
 */
export interface StrapiMedia {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path?: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

/**
 * Strapi pagination metadata
 */
export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

/**
 * Strapi response metadata
 */
export interface StrapiMeta {
  pagination?: StrapiPagination;
}

/**
 * Single entity Strapi response
 */
export interface StrapiResponse<T> {
  data: T;
  meta?: StrapiMeta;
}

/**
 * Collection Strapi response with pagination
 */
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

/**
 * Base Strapi entity attributes (common fields)
 */
export interface StrapiEntityAttributes {
  id: number;
  documentId?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

/**
 * Helper type for populated relations
 */
export type Populated<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] extends (infer U)[] | null
    ? StrapiResponse<U>[]
    : T[P] extends infer U | null
    ? StrapiResponse<U>
    : T[P];
};
