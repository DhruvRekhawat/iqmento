# Strapi Schema Documentation

This document provides comprehensive documentation for all Strapi content types used in the IQMento application.

## Overview

The application uses two main content types:
1. **Alumni** - Alumni mentor profiles
2. **College** - College/university profiles

## Content Types

### 1. Alumni (`api::alumni.alumni`)

**Collection Type**: `alumnis`

**Description**: Stores alumni mentor profiles with their professional information, session offerings, and reviews.

#### Fields

##### Basic Information
- `almuniId` (string, required, unique) - Unique identifier for the alumni
- `name` (string, required) - Full name of the alumni
- `slug` (uid, required, unique) - URL-friendly identifier generated from name
- `headline` (text) - Professional headline (e.g., "Lead Product Designer · Google")
- `bio` (richtext) - Full biography/description
- `location` (string) - Current location
- `jobLocation` (string) - Work location
- `currentCompany` (string) - Current employer
- `currentJobRole` (string) - Current job title/role
- `course` (string) - Course/degree studied
- `graduationYear` (integer) - Year of graduation
- `mobileNumber` (string) - Contact number
- `mail` (email) - Email address

##### Media
- `profile` (media, single image) - Profile picture
- `heroImage` (media, single image) - Hero/banner image for profile page

##### Flags
- `isBookable` (boolean, default: false) - Whether the alumni is available for booking
- `isFeatured` (boolean, default: false) - Whether to feature this alumni prominently

##### Content Sections
- `heroTagline` (text) - Main tagline for hero section
- `heroSummary` (json) - Array of strings for hero summary section
  ```json
  ["Summary paragraph 1", "Summary paragraph 2"]
  ```
- `overview` (json) - Array of strings for overview section
  ```json
  ["Overview paragraph 1", "Overview paragraph 2"]
  ```
- `availability` (string) - Availability description (e.g., "2 sessions available this week")
- `stats` (json) - Array of stat objects
  ```json
  [
    { "label": "Experience", "value": "8+ years" },
    { "label": "Previous Roles", "value": "Apple, IDEO, Google" }
  ]
  ```
- `focusAreas` (json) - Array of focus area objects
  ```json
  [
    {
      "title": "Design Systems & Tooling",
      "description": "Ship resilient design systems..."
    }
  ]
  ```
- `sessions` (json) - Array of session offering objects
  ```json
  [
    {
      "title": "Portfolio & Case Study Review",
      "description": "60-minute deep dive...",
      "duration": "60 min",
      "format": "1:1 on Zoom · Recording shared",
      "price": "₹4,500 / $55"
    }
  ]
  ```
- `highlights` (json) - Array of highlight strings
  ```json
  ["Highlight 1", "Highlight 2", "Highlight 3"]
  ```
- `resources` (json) - Array of resource objects
  ```json
  [
    { "label": "Design System Guide", "href": "https://example.com/guide" }
  ]
  ```
- `reviews` (json) - Array of review objects
  ```json
  [
    {
      "quote": "Great mentor!",
      "name": "John Doe",
      "role": "Student",
      "rating": 5
    }
  ]
  ```
- `featuredQuote` (text) - Featured testimonial quote
- `bookingUrl` (string) - URL for booking sessions
- `questionUrl` (string) - URL for asking questions

##### Relations
- `college` (relation, manyToOne) - The college/university this alumni attended
  - Target: `api::college.college`
  - Inverse: `alumni` (oneToMany on College)
- `userId` (relation, oneToOne, optional) - Link to user account if alumni has login access
  - Target: `plugin::users-permissions.user`
  - Mapped by: `alumniId` on User model

#### Usage Examples

**Filter by featured alumni:**
```javascript
const featuredAlumni = await getAlumni({
  filters: { isFeatured: true }
});
```

**Filter by bookable alumni:**
```javascript
const bookableAlumni = await getAlumni({
  filters: { isBookable: true }
});
```

**Get alumni with college relation:**
```javascript
const alumniWithCollege = await getAlumni({
  populate: ["college", "profile"]
});
```

---

### 2. College (`api::college.college`)

**Collection Type**: `colleges`

**Description**: Stores college/university profiles with courses, admission info, recruiters, and related alumni.

#### Fields

##### Basic Information
- `slug` (uid, required, unique) - URL-friendly identifier generated from name
- `name` (string, required) - Full name of the college
- `shortName` (string) - Abbreviated name (e.g., "NID Ahmedabad")
- `location` (string, required) - Location (e.g., "Ahmedabad, Gujarat")
- `heroImage` (media, single image) - Hero/banner image

##### Filter Fields
- `collegeType` (enumeration) - Type of college
  - Options: `IIT`, `NIT`, `IIM`, `NID`, `Medical`, `Law`, `Arts`, `Commerce`, `Engineering`, `Design`, `Business`, `Other`
- `collegeTier` (enumeration) - Tier classification
  - Options: `Tier 1`, `Tier 2`, `Tier 3`
- `rating` (decimal, 0-5) - Average rating

##### Content Sections
- `hero` (json) - Hero section content
  ```json
  {
    "tagline": "Craft the future of Indian design...",
    "description": "From legendary workshops...",
    "badges": [
      { "label": "Institute of National Importance", "icon": "trophy" },
      { "label": "UGC Recognized", "icon": "shield" }
    ],
    "primaryAction": {
      "label": "Learn More",
      "href": "#"
    },
    "secondaryAction": {
      "label": "Download Brochure",
      "href": "#"
    }
  }
  ```
  Icon options: `award`, `shield`, `sparkles`, `trophy`, `users`

- `about` (json) - Array of strings for about section
  ```json
  ["About paragraph 1", "About paragraph 2"]
  ```

- `courses` (json) - Array of course objects
  ```json
  [
    {
      "name": "Bachelor of Design",
      "fees": "₹2,50,000/year",
      "duration": "4 years",
      "studyMode": "Full-time",
      "coursesOffered": ["Product Design", "Communication Design"],
      "eligibility": "10+2 with 50% marks",
      "brochureUrl": "https://example.com/brochure",
      "expertsUrl": "https://example.com/experts"
    }
  ]
  ```

- `admission` (json) - Admission process information
  ```json
  {
    "title": "Admission Process",
    "subtitle": "Learn about the admission requirements",
    "steps": [
      {
        "title": "Step 1: Application",
        "description": "Submit online application...",
        "highlight": true
      }
    ]
  }
  ```

- `recruiters` (json) - Recruiters and placement information
  ```json
  {
    "title": "Top Recruiters",
    "logos": ["/logos/company1.png", "/logos/company2.png"],
    "cutoff": ["JEE Main: 95%", "CAT: 98 percentile"],
    "placements": [
      { "label": "Average Package", "value": "₹15 LPA" },
      { "label": "Highest Package", "value": "₹45 LPA" }
    ]
  }
  ```

- `reviews` (json) - Array of review objects
  ```json
  [
    {
      "quote": "Great college experience!",
      "name": "Jane Doe",
      "role": "Alumni · Class of 2020",
      "rating": 5
    }
  ]
  ```

- `faqs` (json) - Array of FAQ objects
  ```json
  [
    {
      "question": "What is the admission process?",
      "answer": "The admission process includes..."
    }
  ]
  ```

- `metadata` (json) - SEO metadata
  ```json
  {
    "title": "College Name | IQMento",
    "description": "Learn about College Name",
    "openGraph": {
      "title": "College Name | IQMento",
      "description": "Learn about College Name"
    },
    "twitter": {
      "card": "summary_large_image",
      "title": "College Name | IQMento",
      "description": "Learn about College Name"
    }
  }
  ```

##### Relations
- `alumni` (relation, oneToMany) - Alumni who attended this college
  - Target: `api::alumni.alumni`
  - Mapped by: `college` (manyToOne on Alumni)

#### Usage Examples

**Filter by college type:**
```javascript
const iits = await getColleges({
  filters: { collegeType: "IIT" }
});
```

**Filter by tier:**
```javascript
const tier1Colleges = await getColleges({
  filters: { collegeTier: "Tier 1" }
});
```

**Get college with alumni:**
```javascript
const collegeWithAlumni = await getCollegeBySlug("nid-ahmedabad", {
  populate: ["alumni", "alumni.profile", "heroImage"]
});
```

**Search by location:**
```javascript
const collegesInCity = await getColleges({
  filters: {
    location: { $contains: "Ahmedabad" }
  }
});
```

---

## Relations

### Alumni ↔ College

- **Alumni → College**: Many-to-One
  - Each alumni can belong to one college
  - Field: `alumni.college`
  
- **College → Alumni**: One-to-Many
  - Each college can have many alumni
  - Field: `college.alumni`

### Alumni ↔ User (Optional)

- **Alumni → User**: One-to-One (optional)
  - Links alumni profile to user account for authentication
  - Field: `alumni.userId`
  - Inverse: `user.alumniId`

---

## Filtering & Search

### Alumni Filters

- `isFeatured` (boolean) - Filter featured alumni
- `isBookable` (boolean) - Filter bookable alumni
- `publishedAt` (notNull) - Filter published content
- `college` (relation) - Filter by college

### College Filters

- `collegeType` (enumeration) - Filter by type (IIT, NID, etc.)
- `collegeTier` (enumeration) - Filter by tier (Tier 1, 2, 3)
- `rating` (decimal) - Filter by rating (can use $gte, $lte)
- `location` (string) - Filter by location (use $contains for partial match)
- `publishedAt` (notNull) - Filter published content

### Search Fields

The application supports searching by:
- **Alumni**: Name, headline, company, location, course
- **Colleges**: Name, location, course names

Search is typically implemented client-side or via Strapi's search plugin.

---

## Important Notes

### Mapper Updates Required

⚠️ **Important**: The `lib/strapi-mappers.ts` file currently expects `college.alumni` to be a JSON array, but the schema now uses a relation. You'll need to update the mapper to handle the relation format:

**Current (expects JSON):**
```typescript
alumni: strapiCollege.alumni?.map((alum) => ({
  name: alum.name,
  role: alum.role,
  company: alum.company,
  image: alum.image,
})) || []
```

**Should be (handles relation):**
```typescript
alumni: strapiCollege.alumni?.data?.map((alum) => {
  const mapped = mapStrapiAlumniToMentorCard(alum);
  return {
    name: mapped.name,
    role: mapped.role,
    company: mapped.company || "",
    image: mapped.image,
  };
}) || []
```

Or fetch alumni separately when the relation is not populated:
```typescript
// In college detail page
const collegeWithAlumni = await getCollegeBySlug(slug, {
  populate: ["alumni", "alumni.profile"]
});

// Then map the relation data
const alumniForShowcase = collegeWithAlumni.data.alumni?.data || [];
```

### JSON Field Structures

All JSON fields should match the structures documented above. When creating content in Strapi, ensure:
1. Arrays are properly formatted
2. Objects have the correct keys
3. Types match (strings, numbers, booleans)

### Draft & Publish

Both content types use `draftAndPublish: true`, which means:
- Content must be published to appear in API responses
- Use `filters: { publishedAt: { $notNull: true } }` to filter published content
- Draft content is only visible in Strapi admin

---

## API Endpoints

### Alumni
- `GET /api/alumnis` - List all alumni
- `GET /api/alumnis/:id` - Get single alumni by ID
- `GET /api/alumnis?filters[slug][$eq]=alumni-slug` - Get by slug

### Colleges
- `GET /api/colleges` - List all colleges
- `GET /api/colleges/:id` - Get single college by ID
- `GET /api/colleges?filters[slug][$eq]=college-slug` - Get by slug

### Populating Relations
- `GET /api/alumnis?populate=college` - Include college data
- `GET /api/colleges?populate=alumni` - Include alumni data
- `GET /api/colleges?populate[alumni][populate]=profile` - Include alumni with profile images

---

## Migration Notes

If you're migrating from the old schema:

1. **College.alumni field**: The JSON `alumni` field has been removed in favor of the relation. If you had data in the JSON field, you'll need to:
   - Create Alumni entries for each alumni in the JSON array
   - Link them to the College using the `college` relation field

2. **User-Alumni relation**: If you don't need user authentication for alumni, you can remove the `userId` field from the Alumni schema and the `alumniId` field from the User model.

---

## Schema Files

- `alumni.schema.json` - Alumni content type schema
- `college.schema.json` - College content type schema

Both schemas should be placed in your Strapi project at:
- `src/api/alumni/content-types/alumni/schema.json`
- `src/api/college/content-types/college/schema.json`

