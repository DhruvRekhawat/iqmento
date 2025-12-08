# Search & Filter Implementation Guide

## Current Status

### ✅ What's Ready
1. **Strapi Schemas** - All filter fields are defined:
   - `collegeType` (enumeration)
   - `collegeTier` (enumeration)
   - `rating` (decimal)
   - Relations: `college` (Alumni → College)

2. **TypeScript Types** - All filter fields are typed correctly

3. **API Functions** - Updated to support filtering:
   - `getAlumni()` - Supports filtering by college, search terms
   - `getColleges()` - Supports filtering by type, tier, rating, search terms

### ⚠️ What Needs Implementation
1. **Search Bars** - Currently just UI, need to add functionality
2. **Filter Pills** - Currently just UI, need to add functionality
3. **Client-Side State** - Need to manage search/filter state
4. **URL Parameters** - Optionally sync filters with URL for shareable links

---

## 1. Getting Alumni by College

### ✅ YES - This is fully supported!

You can get alumni specific to a college in multiple ways:

#### Method 1: Using the College Relation (Recommended)

```typescript
// Get college with its alumni
const collegeResponse = await getCollegeBySlug("nid-ahmedabad", {
  populate: ["alumni", "alumni.profile", "alumni.heroImage"]
});

// The alumni are already in the response
const alumni = collegeResponse.data.alumni?.data || [];
```

#### Method 2: Filter Alumni by College

```typescript
// Get alumni filtered by college slug
const alumniResponse = await getAlumni({
  populate: ["profile", "college"],
  filters: {
    college: {
      slug: "nid-ahmedabad"
    },
    publishedAt: { $notNull: true }
  }
});

const collegeAlumni = alumniResponse.data;
```

#### Method 3: Filter Alumni by College ID

```typescript
// If you have the college ID
const alumniResponse = await getAlumni({
  populate: ["profile", "college"],
  filters: {
    college: {
      id: 1  // College ID
    },
    publishedAt: { $notNull: true }
  }
});
```

### Current Implementation

The college detail page (`app/colleges/[slug]/page.tsx`) already tries to do this:

```typescript
const collegeResponse = await getCollegeBySlug(slug, {
  populate: ["heroImage", "alumni"],  // ✅ Populates alumni relation
});
```

**This will work once you:**
1. Link alumni to colleges in Strapi (set the `college` field on alumni)
2. The mapper will automatically convert the relation to `AlumniDetail[]` format

---

## 2. Search Functionality

### Current State
- Search bars exist in UI but don't do anything
- Need to add client-side or server-side search

### Implementation Options

#### Option A: Client-Side Search (Simple, Fast for Small Datasets)

```typescript
// In a client component
'use client';

import { useState, useMemo } from 'react';

export function SearchableAlumniList({ initialAlumni }: { initialAlumni: StrapiAlumni[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlumni = useMemo(() => {
    if (!searchTerm) return initialAlumni;
    
    const term = searchTerm.toLowerCase();
    return initialAlumni.filter(alum => 
      alum.name?.toLowerCase().includes(term) ||
      alum.headline?.toLowerCase().includes(term) ||
      alum.currentCompany?.toLowerCase().includes(term) ||
      alum.location?.toLowerCase().includes(term) ||
      alum.course?.toLowerCase().includes(term)
    );
  }, [searchTerm, initialAlumni]);

  return (
    <>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search colleges or mentors…"
      />
      {/* Render filteredAlumni */}
    </>
  );
}
```

#### Option B: Server-Side Search (Better for Large Datasets)

Update the page to accept search params:

```typescript
// app/alumini/page.tsx
export default async function AlumniDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  
  const alumniResponse = await getAlumni({
    populate: ["profile", "heroImage"],
    filters: {
      ...(search && {
        $or: [
          { name: { $containsi: search } },
          { headline: { $containsi: search } },
          { currentCompany: { $containsi: search } },
          { location: { $containsi: search } },
          { course: { $containsi: search } },
        ],
      }),
      publishedAt: { $notNull: true },
    },
    pagination: { pageSize: 100 },
  });

  // ... rest of component
}
```

Then update the search form to submit:

```typescript
// components/sections/alumni-directory/Hero.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function AlumniDirectoryHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    router.push(`/alumini?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search colleges or mentors…"
      />
    </form>
  );
}
```

---

## 3. Filter Functionality

### Current State
- Filter pills exist in UI but don't do anything
- Need to add filter state management

### Implementation

#### For Colleges Page

```typescript
// app/colleges/page.tsx
export default async function AllCollegesPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    tier?: string;
    minRating?: string;
    location?: string;
  }>;
}) {
  const params = await searchParams;
  
  const collegesResponse = await getColleges({
    populate: ["heroImage"],
    filters: {
      ...(params.type && { collegeType: params.type }),
      ...(params.tier && { collegeTier: params.tier }),
      ...(params.minRating && { rating: { $gte: parseFloat(params.minRating) } }),
      ...(params.location && { location: { $containsi: params.location } }),
      publishedAt: { $notNull: true },
    },
    pagination: { pageSize: 100 },
  });

  // ... rest
}
```

#### Filter Component

```typescript
// components/sections/colleges/CollegesExplorer.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function CollegesExplorer({ colleges }: CollegesExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeType = searchParams.get('type');
  const activeTier = searchParams.get('tier');

  const handleFilterClick = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(filterType) === value) {
      params.delete(filterType);
    } else {
      params.set(filterType, value);
    }
    router.push(`/colleges?${params.toString()}`);
  };

  return (
    <>
      {/* Filter pills */}
      <button onClick={() => handleFilterClick('type', 'IIT')}>
        IIT
      </button>
      {/* ... */}
    </>
  );
}
```

---

## 4. Complete Example: College Detail with Alumni

Here's how the college detail page should work:

```typescript
// app/colleges/[slug]/page.tsx
export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Get college with alumni relation populated
  const collegeResponse = await getCollegeBySlug(slug, {
    populate: [
      "heroImage",
      "alumni",           // ✅ Get alumni relation
      "alumni.profile",   // ✅ Get alumni profile images
      "alumni.heroImage"  // ✅ Get alumni hero images
    ],
  });

  if (!collegeResponse) {
    notFound();
  }

  const profile = mapStrapiCollegeToCollegeProfile(collegeResponse.data);
  
  // ✅ Alumni are already mapped from the relation!
  // profile.alumni contains AlumniDetail[] from the relation
  // No need for fallback query

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <CollegeHero profile={profile} />
        {/* ... other sections ... */}
        <AlumniShowcase alumni={profile.alumni} /> {/* ✅ Uses relation data */}
        {/* ... */}
      </main>
    </>
  );
}
```

---

## 5. Summary

### ✅ What Works Now

1. **Get Alumni by College** - ✅ Fully supported
   - Use `populate: ["alumni"]` when fetching college
   - Or filter alumni with `filters: { college: { slug: "..." } }`

2. **Filter Fields** - ✅ Schema and types ready
   - `collegeType`, `collegeTier`, `rating` available in Strapi
   - API functions support filtering by these fields

3. **Search Capability** - ✅ API supports it
   - Can search by name, headline, company, location, course
   - Uses Strapi's `$containsi` operator for case-insensitive search

### ⚠️ What Needs Implementation

1. **Search Bars** - Add form submission and URL params
2. **Filter Pills** - Add click handlers and URL params
3. **Client Components** - Convert search/filter components to client components
4. **State Management** - Manage filter state (URL params or React state)

### 🎯 Quick Wins

1. **College-Alumni Relation**: Already works! Just populate the relation when fetching colleges.

2. **Basic Search**: Add URL params and server-side filtering (30 minutes)

3. **Basic Filters**: Add filter buttons that update URL params (1 hour)

---

## 6. Testing Checklist

Once implemented, test:

- [ ] Search by alumni name works
- [ ] Search by college name works
- [ ] Filter colleges by type (IIT, NID, etc.)
- [ ] Filter colleges by tier
- [ ] Filter colleges by rating
- [ ] Get alumni for a specific college (via relation)
- [ ] Get alumni filtered by college slug
- [ ] Search and filters work together
- [ ] URL params persist on page refresh
- [ ] Filters clear correctly

---

**Answer to your questions:**

1. **Will I be able to search/filter?** 
   - ✅ **YES** - The API supports it, you just need to wire up the UI components (search bars and filter pills) to actually use the filters.

2. **Will I be able to get alumni specific to a college?**
   - ✅ **YES** - This already works! Just populate the `alumni` relation when fetching a college, or filter alumni by `college.slug`.

