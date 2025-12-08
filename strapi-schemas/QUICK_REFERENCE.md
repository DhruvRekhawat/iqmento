# Strapi Schema Quick Reference

## File Locations

Copy these schemas to your Strapi backend:

```
src/api/alumni/content-types/alumni/schema.json    ← alumni.schema.json
src/api/college/content-types/college/schema.json  ← college.schema.json
```

## Key Changes Summary

### Alumni Schema
- ✅ Added `college` relation (manyToOne) - Links alumni to their college

### College Schema  
- ✅ Added `alumni` relation (oneToMany) - Links college to its alumni
- ✅ Added `collegeType` (enum) - For filtering by type
- ✅ Added `collegeTier` (enum) - For filtering by tier  
- ✅ Added `rating` (decimal) - For rating-based filtering
- ⚠️ Removed JSON `alumni` field - Now using relation instead

## Common Queries

### Get Featured Alumni
```typescript
const featured = await getAlumni({
  filters: { isFeatured: true },
  populate: ["profile", "college"]
});
```

### Get Alumni by College
```typescript
const collegeAlumni = await getAlumni({
  filters: { college: { slug: "nid-ahmedabad" } },
  populate: ["profile", "college"]
});
```

### Get College with Alumni
```typescript
const college = await getCollegeBySlug("nid-ahmedabad", {
  populate: ["alumni", "alumni.profile", "heroImage"]
});
```

### Filter Colleges by Type
```typescript
const iits = await getColleges({
  filters: { collegeType: "IIT" },
  populate: ["heroImage"]
});
```

### Filter Colleges by Tier
```typescript
const tier1 = await getColleges({
  filters: { collegeTier: "Tier 1" },
  populate: ["heroImage"]
});
```

## ⚠️ Required Update

Update `lib/strapi-mappers.ts` to handle the new relation format for `college.alumni`.

See `SCHEMA_DOCUMENTATION.md` for detailed migration instructions.

