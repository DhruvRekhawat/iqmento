# API Endpoints Documentation

This document describes all available API endpoints for the Strapi backend after seeding mock data.

## Base URL

By default, Strapi runs on:
```
http://localhost:1337
```

All API endpoints are prefixed with `/api`:
```
http://localhost:1337/api
```

---

## Colleges API

### Get All Colleges
```http
GET /api/colleges
```

**Query Parameters:**
- `populate` - Populate relations (e.g., `populate=alumni`)
- `filters` - Filter results (e.g., `filters[collegeType][$eq]=IIT`)
- `sort` - Sort results (e.g., `sort=name:asc`)
- `pagination[page]` - Page number
- `pagination[pageSize]` - Items per page
- `fields` - Select specific fields

**Example Requests:**
```bash
# Get all colleges
curl http://localhost:1337/api/colleges

# Get colleges with alumni populated
curl http://localhost:1337/api/colleges?populate=alumni

# Filter by college type
curl "http://localhost:1337/api/colleges?filters[collegeType][$eq]=IIT"

# Filter by tier
curl "http://localhost:1337/api/colleges?filters[collegeTier][$eq]=Tier%201"

# Filter by rating (greater than 4.5)
curl "http://localhost:1337/api/colleges?filters[rating][$gt]=4.5"

# Sort by rating (descending)
curl http://localhost:1337/api/colleges?sort=rating:desc

# Get specific fields only
curl "http://localhost:1337/api/colleges?fields[0]=name&fields[1]=location&fields[2]=collegeType"

# Pagination
curl "http://localhost:1337/api/colleges?pagination[page]=1&pagination[pageSize]=10"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "NID Ahmedabad",
        "slug": "nid-ahmedabad",
        "shortName": "NID-A",
        "location": "Ahmedabad, Gujarat",
        "collegeType": "NID",
        "collegeTier": "Tier 1",
        "rating": 4.8,
        "hero": { ... },
        "about": { ... },
        "courses": [ ... ],
        "admission": { ... },
        "recruiters": [ ... ],
        "reviews": [ ... ],
        "faqs": [ ... ],
        "metadata": { ... },
        "heroImage": { ... },
        "alumni": { ... },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "publishedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 5
    }
  }
}
```

### Get Single College
```http
GET /api/colleges/:id
GET /api/colleges?filters[slug][$eq]=:slug
```

**Example Requests:**
```bash
# Get by ID
curl http://localhost:1337/api/colleges/1

# Get by slug
curl "http://localhost:1337/api/colleges?filters[slug][$eq]=nid-ahmedabad"

# Get with alumni populated
curl "http://localhost:1337/api/colleges/1?populate=alumni"

# Get with all relations and media
curl "http://localhost:1337/api/colleges/1?populate=*"
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "NID Ahmedabad",
      ...
    }
  },
  "meta": {}
}
```

### Create College (Requires Authentication)
```http
POST /api/colleges
Content-Type: application/json
Authorization: Bearer <token>
```

**Example Request:**
```bash
curl -X POST http://localhost:1337/api/colleges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "data": {
      "name": "New College",
      "location": "City, State",
      "collegeType": "IIT",
      "collegeTier": "Tier 1",
      "rating": 4.5
    }
  }'
```

### Update College (Requires Authentication)
```http
PUT /api/colleges/:id
Content-Type: application/json
Authorization: Bearer <token>
```

### Delete College (Requires Authentication)
```http
DELETE /api/colleges/:id
Authorization: Bearer <token>
```

---

## Alumni API

### Get All Alumni
```http
GET /api/alumni
```

**Query Parameters:**
- `populate` - Populate relations (e.g., `populate=college`)
- `filters` - Filter results
- `sort` - Sort results
- `pagination[page]` - Page number
- `pagination[pageSize]` - Items per page
- `fields` - Select specific fields

**Example Requests:**
```bash
# Get all alumni
curl http://localhost:1337/api/alumni

# Get alumni with college populated
curl http://localhost:1337/api/alumni?populate=college

# Filter featured alumni
curl "http://localhost:1337/api/alumni?filters[isFeatured][$eq]=true"

# Filter bookable alumni
curl "http://localhost:1337/api/alumni?filters[isBookable][$eq]=true"

# Filter by college
curl "http://localhost:1337/api/alumni?filters[college][id][$eq]=1"

# Filter by graduation year
curl "http://localhost:1337/api/alumni?filters[graduationYear][$gte]=2015"

# Filter by company
curl "http://localhost:1337/api/alumni?filters[currentCompany][$eq]=Google"

# Sort by name
curl http://localhost:1337/api/alumni?sort=name:asc

# Get specific fields
curl "http://localhost:1337/api/alumni?fields[0]=name&fields[1]=headline&fields[2]=currentCompany"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "almuniId": "AL001",
        "name": "Rajesh Kumar",
        "slug": "rajesh-kumar",
        "headline": "Senior Product Designer at Google",
        "bio": "...",
        "location": "Bangalore, India",
        "currentCompany": "Google",
        "currentJobRole": "Senior Product Designer",
        "isFeatured": true,
        "isBookable": true,
        "heroSummary": { ... },
        "overview": { ... },
        "stats": { ... },
        "sessions": [ ... ],
        "college": { ... },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "publishedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 8
    }
  }
}
```

### Get Single Alumnus
```http
GET /api/alumni/:id
GET /api/alumni?filters[slug][$eq]=:slug
GET /api/alumni?filters[almuniId][$eq]=:almuniId
```

**Example Requests:**
```bash
# Get by ID
curl http://localhost:1337/api/alumni/1

# Get by slug
curl "http://localhost:1337/api/alumni?filters[slug][$eq]=rajesh-kumar"

# Get by alumni ID
curl "http://localhost:1337/api/alumni?filters[almuniId][$eq]=AL001"

# Get with college populated
curl "http://localhost:1337/api/alumni/1?populate=college"

# Get with all relations and media
curl "http://localhost:1337/api/alumni/1?populate=*"
```

### Create Alumnus (Requires Authentication)
```http
POST /api/alumni
Content-Type: application/json
Authorization: Bearer <token>
```

**Example Request:**
```bash
curl -X POST http://localhost:1337/api/alumni \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "data": {
      "almuniId": "AL009",
      "name": "New Alumnus",
      "headline": "Software Engineer",
      "college": 1
    }
  }'
```

### Update Alumnus (Requires Authentication)
```http
PUT /api/alumni/:id
Content-Type: application/json
Authorization: Bearer <token>
```

### Delete Alumnus (Requires Authentication)
```http
DELETE /api/alumni/:id
Authorization: Bearer <token>
```

---

## Advanced Query Examples

### Complex Filters

```bash
# Multiple filters (AND)
curl "http://localhost:1337/api/alumni?filters[isFeatured][$eq]=true&filters[isBookable][$eq]=true"

# OR conditions
curl "http://localhost:1337/api/colleges?filters[$or][0][collegeType][$eq]=IIT&filters[$or][1][collegeType][$eq]=NIT"

# Contains filter (for text fields)
curl "http://localhost:1337/api/alumni?filters[name][$contains]=Kumar"

# Greater than / Less than
curl "http://localhost:1337/api/colleges?filters[rating][$gte]=4.5"
curl "http://localhost:1337/api/alumni?filters[graduationYear][$lte]=2020"

# In array
curl "http://localhost:1337/api/colleges?filters[collegeType][$in][0]=IIT&filters[collegeType][$in][1]=NIT"
```

### Deep Population

```bash
# Populate nested relations
curl "http://localhost:1337/api/colleges?populate[alumni][populate]=*"

# Populate specific fields
curl "http://localhost:1337/api/colleges?populate[alumni][fields][0]=name&populate[alumni][fields][1]=headline"

# Populate media
curl "http://localhost:1337/api/alumni?populate[profile]=*&populate[heroImage]=*"
```

### Sorting

```bash
# Single field
curl http://localhost:1337/api/colleges?sort=rating:desc

# Multiple fields
curl "http://localhost:1337/api/alumni?sort[0]=graduationYear:desc&sort[1]=name:asc"
```

### Pagination

```bash
# Page 1, 10 items per page
curl "http://localhost:1337/api/colleges?pagination[page]=1&pagination[pageSize]=10"

# Start and limit
curl "http://localhost:1337/api/alumni?pagination[start]=0&pagination[limit]=5"
```

### Field Selection

```bash
# Select specific fields
curl "http://localhost:1337/api/colleges?fields[0]=name&fields[1]=location&fields[2]=rating"

# Exclude fields (not directly supported, use field selection instead)
```

---

## Common Use Cases

### Get Featured Alumni with Their Colleges
```bash
curl "http://localhost:1337/api/alumni?filters[isFeatured][$eq]=true&populate=college"
```

### Get All Colleges with Their Alumni Count
```bash
curl "http://localhost:1337/api/colleges?populate[alumni][fields][0]=id"
```

### Get Alumni by College Slug
```bash
# First get college by slug
COLLEGE_ID=$(curl -s "http://localhost:1337/api/colleges?filters[slug][$eq]=nid-ahmedabad" | jq -r '.data[0].id')

# Then get alumni for that college
curl "http://localhost:1337/api/alumni?filters[college][id][$eq]=$COLLEGE_ID&populate=college"
```

### Get Top Rated Colleges
```bash
curl "http://localhost:1337/api/colleges?sort=rating:desc&pagination[pageSize]=5"
```

### Search Alumni by Name or Company
```bash
curl "http://localhost:1337/api/alumni?filters[$or][0][name][$contains]=Rajesh&filters[$or][1][currentCompany][$contains]=Google"
```

---

## Authentication

Most endpoints require authentication for write operations (POST, PUT, DELETE). To authenticate:

1. **Get JWT Token:**
```bash
curl -X POST http://localhost:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "your-email@example.com",
    "password": "your-password"
  }'
```

2. **Use Token in Requests:**
```bash
curl -X POST http://localhost:1337/api/colleges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{ "data": { ... } }'
```

---

## Response Format

All responses follow Strapi's standard format:

**Success Response:**
```json
{
  "data": { ... },
  "meta": { ... }
}
```

**Error Response:**
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Not Found",
    "details": { ... }
  }
}
```

---

## Notes

1. **Published Content Only**: By default, only published content is returned. Draft content requires authentication.

2. **Relations**: Relations are not populated by default. Use the `populate` parameter to include related data.

3. **Media Fields**: Media fields return metadata. Use `populate=*` or specific population to get full media URLs.

4. **JSON Fields**: JSON fields (hero, about, courses, etc.) are returned as-is in the response.

5. **Slug vs ID**: You can query by either `id` or `slug`. Slugs are auto-generated from names.

---

## Testing with cURL

Here are some ready-to-use cURL commands:

```bash
# Get all colleges
curl http://localhost:1337/api/colleges

# Get all alumni
curl http://localhost:1337/api/alumni

# Get featured alumni with colleges
curl "http://localhost:1337/api/alumni?filters[isFeatured][$eq]=true&populate=college"

# Get IIT colleges
curl "http://localhost:1337/api/colleges?filters[collegeType][$eq]=IIT"

# Get alumni from NID Ahmedabad
curl "http://localhost:1337/api/alumni?filters[college][name][$eq]=NID%20Ahmedabad&populate=college"
```

---

For more information, refer to the [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest).

