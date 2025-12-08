# Cursor Agent Prompt for Strapi Backend Setup

Copy and paste this entire prompt to your Cursor agent:

---

## Task: Set Up Complete Strapi Backend for IQMento Application

I need you to create a complete Strapi backend with two content types: Alumni and College. I'm providing the schema files and documentation.

### Your Tasks:

1. **Create Alumni Content Type**
   - Use `strapi-schemas/alumni.schema.json` as the schema
   - Place at: `src/api/alumni/content-types/alumni/schema.json`
   - Ensure all fields, relations, and configurations match exactly

2. **Create College Content Type**
   - Use `strapi-schemas/college.schema.json` as the schema
   - Place at: `src/api/college/content-types/college/schema.json`
   - Ensure all fields, relations, and configurations match exactly

3. **Set Up Relations**
   - Alumni → College: manyToOne relation (field: `college`)
   - College → Alumni: oneToMany relation (field: `alumni`)
   - Ensure relations are bidirectional and properly configured

4. **Verify JSON Fields**
   - All JSON fields should be type "json" in Strapi
   - Reference `SCHEMA_DOCUMENTATION.md` for expected structures

5. **Configure Media Fields**
   - `profile` and `heroImage` in Alumni: type "media", single image, images only
   - `heroImage` in College: type "media", single image, images only

6. **Set Up Draft & Publish**
   - Both content types should have `draftAndPublish: true`

### Files I'm Providing:

1. `strapi-schemas/alumni.schema.json` - Alumni schema
2. `strapi-schemas/college.schema.json` - College schema
3. `strapi-schemas/SCHEMA_DOCUMENTATION.md` - Complete documentation
4. `strapi-schemas/SCHEMA_VERIFICATION_SUMMARY.md` - Verification details
5. `strapi-schemas/QUICK_REFERENCE.md` - Quick reference

### Important Notes:

- **Strapi Version**: Use Strapi 5 structure
- **Relations**: Must be bidirectional (alumni.college ↔ college.alumni)
- **Filter Fields**: College schema includes `collegeType`, `collegeTier`, and `rating` for filtering
- **User Relation**: The `userId` field in Alumni is optional (for user authentication)
- **JSON Fields**: All JSON fields should be type "json" - structures are validated by application code
- **Slug Fields**: Use UID type with `targetField` set to "name"

### Expected File Structure:

```
src/api/
├── alumni/
│   └── content-types/
│       └── alumni/
│           └── schema.json
└── college/
    └── content-types/
        └── college/
            └── schema.json
```

### Verification:

After setup, please verify:
- [ ] Both schema files are in correct locations
- [ ] Relations are properly configured
- [ ] All field types match the schemas
- [ ] Media fields are configured correctly
- [ ] Draft & publish is enabled
- [ ] Filter fields (collegeType, collegeTier, rating) are in College schema

### Questions to Answer:

1. Are you creating a new Strapi project or adding to existing?
2. What Strapi version are you using?
3. Do you need help with initial data seeding?

Please proceed with the setup and let me know if you encounter any issues or need clarification on any part of the schemas.

---

**End of Prompt**

