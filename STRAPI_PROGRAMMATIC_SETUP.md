# Programmatic Strapi Schema Setup

This guide shows how to set up Strapi content types programmatically using schema JSON files.

## Step 1: Create Strapi Project

```bash
npx create-strapi-app@latest iqmento-backend --quickstart
cd iqmento-backend
```

## Step 2: Copy Schema Files

Copy the schema files from `strapi-schemas/` to your Strapi project:

```bash
# From your Next.js project root
cp strapi-schemas/alumni.schema.json ../iqmento-strapi/src/api/alumni/content-types/alumni/schema.json
cp strapi-schemas/college.schema.json ../iqmento-strapi/src/api/college/content-types/college/schema.json
```

Or manually:
1. In your Strapi project, navigate to `src/api/`
2. Create directories: `alumni/content-types/alumni/` and `college/content-types/college/`
3. Copy the schema files to their respective directories

## Step 3: Fix User-Alumni Relation (if needed)

If you're getting the error about `userId` not found, you have two options:

### Option A: Add userId to Alumni (if you want User-Alumni relation)

The schema already includes the `userId` relation field. Make sure your User model has the corresponding `alumniId` field configured.

### Option B: Remove User-Alumni Relation (if you don't need it)

If you don't need to link Alumni to Users, remove the `userId` field from the alumni schema:

```json
// Remove this from alumni.schema.json:
"userId": {
  "type": "relation",
  "relation": "oneToOne",
  "target": "plugin::users-permissions.user",
  "mappedBy": "alumniId"
},
```

And also remove the `alumniId` relation from the User model in:
`src/plugins/users-permissions/server/content-types/user/schema.json`

## Step 4: Restart Strapi

After copying the schemas:

```bash
npm run develop
```

Strapi will automatically:
- Load the schema files
- Create the database tables
- Set up the content types

## Step 5: Configure Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Enable `find` and `findOne` for:
   - **Alumni**
   - **College**
3. Click **Save**

## Step 6: Create API Token

1. Go to **Settings** → **API Tokens**
2. Create a new token with **Full access** or **Read-only**
3. Copy the token to your Next.js `.env` file

## Troubleshooting

### Schema Not Loading

- Make sure the file is named exactly `schema.json`
- Check the directory structure matches: `src/api/{content-type}/content-types/{content-type}/schema.json`
- Verify JSON syntax is valid

### Relation Errors

- If you get relation errors, check both sides of the relation exist
- For User-Alumni relation, ensure both `userId` (in Alumni) and `alumniId` (in User) are defined
- Or remove the relation entirely if not needed

### Field Type Errors

- Make sure field types match Strapi's supported types
- JSON fields are used for complex nested structures
- Media fields must specify `allowedTypes`

## Schema File Locations

```
iqmento-backend/
├── src/
│   └── api/
│       ├── alumni/
│       │   └── content-types/
│       │       └── alumni/
│       │           └── schema.json  ← Copy here
│       └── college/
│           └── content-types/
│               └── college/
│                   └── schema.json  ← Copy here
```

## Alternative: Use Strapi Migrations

For more advanced setups, you can use Strapi migrations:

```bash
npm install strapi-plugin-migrations
```

Then create migration files to programmatically set up your content types.

