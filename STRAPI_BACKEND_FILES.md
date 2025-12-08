# Files to Provide to Cursor Agent for Strapi Backend

## 📦 Complete File List

Provide your Cursor agent with these files in this order:

---

## 1. Core Schema Files (REQUIRED)

### `strapi-schemas/alumni.schema.json`
- **Purpose**: Alumni content type schema
- **Location in Strapi**: `src/api/alumni/content-types/alumni/schema.json`
- **Contains**: All alumni fields, relations, media, JSON structures

### `strapi-schemas/college.schema.json`
- **Purpose**: College content type schema
- **Location in Strapi**: `src/api/college/content-types/college/schema.json`
- **Contains**: All college fields, relations, filter fields, JSON structures

---

## 2. Documentation Files (HIGHLY RECOMMENDED)

### `strapi-schemas/SCHEMA_DOCUMENTATION.md`
- **Purpose**: Complete schema documentation
- **Contains**: 
  - Field descriptions
  - JSON structure examples
  - Relation explanations
  - Usage examples
  - API endpoint documentation

### `strapi-schemas/SCHEMA_VERIFICATION_SUMMARY.md`
- **Purpose**: Verification summary
- **Contains**: What was verified, what changed, migration notes

### `strapi-schemas/QUICK_REFERENCE.md`
- **Purpose**: Quick reference guide
- **Contains**: Common queries, file locations, key changes

### `strapi-schemas/FIX_RELATION_ERROR.md`
- **Purpose**: User-Alumni relation fix guide
- **Contains**: How to handle optional user relations

---

## 3. Setup Instructions (OPTIONAL BUT HELPFUL)

### `STRAPI_SETUP.md` (if exists)
- **Purpose**: General Strapi setup instructions

### `STRAPI_PROGRAMMATIC_SETUP.md` (if exists)
- **Purpose**: Programmatic setup guide

---

## 📋 Instructions for Cursor Agent

Copy and paste this prompt to your Cursor agent:

```
I need you to set up a complete Strapi backend for my application. Here are the schema files and documentation.

TASKS:
1. Create the Alumni content type using alumni.schema.json
2. Create the College content type using college.schema.json
3. Set up the relations between Alumni and College
4. Ensure all JSON field structures match the documentation
5. Set up draft & publish workflow
6. Configure media library for images

FILES PROVIDED:
- strapi-schemas/alumni.schema.json
- strapi-schemas/college.schema.json
- strapi-schemas/SCHEMA_DOCUMENTATION.md (for reference)
- strapi-schemas/SCHEMA_VERIFICATION_SUMMARY.md (for reference)

IMPORTANT NOTES:
- Use Strapi 5 structure
- Place schemas in: src/api/{content-type}/content-types/{content-type}/schema.json
- The college-alumni relation is manyToOne (alumni → college) and oneToMany (college → alumni)
- All JSON fields should match the structures documented in SCHEMA_DOCUMENTATION.md
- The userId relation in Alumni is optional (for user authentication)
```

---

## 🗂️ File Structure in Strapi Project

After setup, your Strapi project should have:

```
strapi-backend/
├── src/
│   └── api/
│       ├── alumni/
│       │   └── content-types/
│       │       └── alumni/
│       │           └── schema.json  ← Copy from strapi-schemas/alumni.schema.json
│       └── college/
│           └── content-types/
│               └── college/
│                   └── schema.json  ← Copy from strapi-schemas/college.schema.json
```

---

## ✅ Verification Checklist

After the agent sets up the backend, verify:

- [ ] Alumni schema file exists at correct location
- [ ] College schema file exists at correct location
- [ ] Relations are properly configured (alumni.college ↔ college.alumni)
- [ ] All JSON fields are set to type "json"
- [ ] Media fields (profile, heroImage) are set to type "media"
- [ ] Filter fields (collegeType, collegeTier, rating) are in College schema
- [ ] Draft & publish is enabled (draftAndPublish: true)
- [ ] Slug fields use UID type with targetField
- [ ] Required fields are marked as required
- [ ] Unique fields are marked as unique

---

## 🚀 Quick Start Commands

If the agent needs to create a new Strapi project:

```bash
# Create new Strapi project
npx create-strapi-app@latest strapi-backend --quickstart

# Or if project exists, just copy schema files
cp strapi-schemas/alumni.schema.json src/api/alumni/content-types/alumni/schema.json
cp strapi-schemas/college.schema.json src/api/college/content-types/college/schema.json

# Restart Strapi
npm run develop
```

---

## 📝 Additional Context (Optional)

If you want to provide more context, also include:

1. **TypeScript Types** (for reference):
   - `types/alumni.ts`
   - `types/college.ts`
   - `types/strapi.ts`

2. **Mapper Functions** (for reference):
   - `lib/strapi-mappers.ts`

3. **API Functions** (for reference):
   - `lib/strapi.ts`

These help the agent understand the expected data structures, but aren't strictly necessary for backend setup.

---

## 🎯 Minimum Required Files

**Absolute minimum** (if you want to keep it simple):
1. `strapi-schemas/alumni.schema.json`
2. `strapi-schemas/college.schema.json`
3. `strapi-schemas/SCHEMA_DOCUMENTATION.md`

**Recommended** (for best results):
- All files listed in sections 1 and 2 above

---

## ⚠️ Important Notes

1. **Strapi Version**: These schemas are for Strapi 5. If using Strapi 4, some adjustments may be needed.

2. **Relations**: The relations are bidirectional:
   - Alumni has `college` (manyToOne)
   - College has `alumni` (oneToMany)
   - Make sure both are set up correctly

3. **JSON Fields**: All JSON fields should be set to type "json" in Strapi. The actual structure is validated by your application code.

4. **Media Fields**: Profile and heroImage fields should allow only images.

5. **User Relation**: The `userId` relation in Alumni is optional. If you don't need user authentication for alumni, you can remove it.

---

## 📞 After Setup

Once the backend is set up:

1. Start Strapi: `npm run develop`
2. Create admin user (first time only)
3. Create test colleges
4. Create test alumni
5. Link alumni to colleges (set the `college` field)
6. Test API endpoints:
   - `GET /api/alumnis`
   - `GET /api/colleges`
   - `GET /api/colleges?populate=alumni`

---

**That's it!** Provide these files to your Cursor agent and it should be able to set up the complete backend.

