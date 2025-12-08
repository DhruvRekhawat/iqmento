# Strapi Setup Guide for IQMento

This guide will help you set up a Strapi CMS instance with the content types needed for your Next.js application.

## Step 1: Create a New Strapi Project

### Option A: Using Strapi Cloud (Recommended for Production)

1. Go to [Strapi Cloud](https://cloud.strapi.io)
2. Sign up or log in
3. Click "Create new project"
4. Choose a plan (Free tier available)
5. Your Strapi instance will be deployed automatically

### Option B: Local Development

```bash
# Create a new Strapi project
npx create-strapi-app@latest iqmento-strapi --quickstart

# Or with specific options
npx create-strapi-app@latest iqmento-strapi
# Choose: Quickstart (recommended)
```

This will:
- Create a new directory `iqmento-strapi`
- Install dependencies
- Start the development server at `http://localhost:1337`

## Step 2: Initial Setup

1. **Create Admin Account**
   - When Strapi starts, you'll be prompted to create an admin account
   - Fill in your email, password, and username

2. **Access Admin Panel**
   - Go to `http://localhost:1337/admin` (or your Strapi Cloud URL)
   - Log in with your admin credentials

## Step 3: Create Content Types

### 3.1 Create "Alumni" Collection Type

1. Go to **Content-Type Builder** (left sidebar)
2. Click **"Create new collection type"**
3. Name it: `Alumni` (singular) - Strapi will pluralize to `alumnis`
4. Click **"Continue"**

#### Add Fields to Alumni:

**Basic Information:**
- `almuniId` - Text (Short text) - Required
- `name` - Text (Short text) - Required
- `slug` - UID (based on `name`) - Required, Unique
- `headline` - Text (Long text)
- `bio` - Text (Long text)
- `location` - Text (Short text)
- `jobLocation` - Text (Short text)

**Professional Details:**
- `currentCompany` - Text (Short text)
- `currentJobRole` - Text (Short text)
- `course` - Text (Short text)
- `graduationYear` - Number (Integer)
- `mobileNumber` - Text (Short text)
- `mail` - Email

**Media:**
- `profile` - Media (Single media) - Allowed types: Images
- `heroImage` - Media (Single media) - Allowed types: Images

**Flags:**
- `isBookable` - Boolean (Default: false)
- `isFeatured` - Boolean (Default: false)

**Content:**
- `heroTagline` - Text (Long text)
- `heroSummary` - JSON (for array of strings)
- `overview` - JSON (for array of strings)
- `availability` - Text (Short text)

**Structured Data (JSON fields):**
- `stats` - JSON (Array of objects: `{ label: string, value: string }`)
- `focusAreas` - JSON (Array of objects: `{ title: string, description: string }`)
- `sessions` - JSON (Array of objects: `{ title, description, duration, format, price }`)
- `highlights` - JSON (Array of strings)
- `resources` - JSON (Array of objects: `{ label: string, href: string }`)
- `reviews` - JSON (Array of objects: `{ quote, name, role, rating? }`)

**URLs:**
- `featuredQuote` - Text (Long text)
- `bookingUrl` - Text (Short text)
- `questionUrl` - Text (Short text)

5. Click **"Save"** and wait for Strapi to restart

### 3.2 Create "College" Collection Type

1. Go to **Content-Type Builder**
2. Click **"Create new collection type"**
3. Name it: `College` (singular) - Strapi will pluralize to `colleges`
4. Click **"Continue"**

#### Add Fields to College:

**Basic Information:**
- `slug` - UID (based on `name`) - Required, Unique
- `name` - Text (Short text) - Required
- `shortName` - Text (Short text)
- `location` - Text (Short text) - Required
- `heroImage` - Media (Single media) - Allowed types: Images

**Hero Section (JSON):**
- `hero` - JSON (Object: `{ tagline, description, badges[], primaryAction, secondaryAction }`)

**Content:**
- `about` - JSON (Array of strings)

**Courses (JSON):**
- `courses` - JSON (Array of objects: `{ name, fees, duration, studyMode, coursesOffered[], eligibility, brochureUrl, expertsUrl }`)

**Admission (JSON):**
- `admission` - JSON (Object: `{ title, subtitle, steps[] }`)

**Recruiters (JSON):**
- `recruiters` - JSON (Object: `{ title, logos[], cutoff[], placements[] }`)

**Reviews (JSON):**
- `reviews` - JSON (Array of objects: `{ quote, name, role, rating? }`)

**Alumni (JSON):**
- `alumni` - JSON (Array of objects: `{ name, role, company, image }`)

**FAQs (JSON):**
- `faqs` - JSON (Array of objects: `{ question, answer }`)

**Metadata (JSON):**
- `metadata` - JSON (Object: `{ title, description, openGraph, twitter }`)

5. Click **"Save"** and wait for Strapi to restart

## Step 4: Configure API Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Under **Permissions**, find your content types:
   - **Alumni**: Check `find` and `findOne`
   - **College**: Check `find` and `findOne`
3. Click **"Save"**

## Step 5: Create API Token

1. Go to **Settings** → **API Tokens**
2. Click **"Create new API Token"**
3. Configure:
   - **Name**: `Next.js Frontend`
   - **Token type**: `Full access` (or `Read-only` for production)
   - **Token duration**: `Unlimited` (or set expiration)
4. Click **"Save"**
5. **Copy the token** - you'll need it for your `.env` file

## Step 6: Configure CORS (if needed)

1. Go to **Settings** → **Users & Permissions Plugin** → **Advanced Settings**
2. Under **CORS**, add your Next.js app URL:
   - For local: `http://localhost:3000`
   - For production: your production domain
3. Click **"Save"**

## Step 7: Update Your .env File

Add these to your Next.js project's `.env` file:

```env
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
# Or for Strapi Cloud:
# NEXT_PUBLIC_STRAPI_API_URL=https://your-app.strapiapp.com

NEXT_PUBLIC_STRAPI_API_TOKEN=your-api-token-here
NEXT_PUBLIC_PAGE_LIMIT=25
```

## Step 8: Add Sample Data

### For Alumni:

1. Go to **Content Manager** → **Alumni**
2. Click **"Create new entry"**
3. Fill in the fields:
   - **almuniId**: `AL2025011100`
   - **name**: `John Doe`
   - **slug**: `john-doe` (auto-generated from name)
   - **headline**: `Senior Product Designer · Google`
   - **bio**: `Experienced designer with 8+ years...`
   - **currentCompany**: `Google`
   - **currentJobRole**: `Senior Product Designer`
   - **location**: `San Francisco, USA`
   - **isFeatured**: `true`
   - **isBookable**: `true`
   - Upload a **profile** image
   - Add JSON fields as needed

4. Click **"Save"** then **"Publish"**

### For College:

1. Go to **Content Manager** → **College**
2. Click **"Create new entry"**
3. Fill in basic fields and JSON structures
4. Click **"Save"** then **"Publish"**

## Step 9: Test the Integration

1. Start your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Visit:
   - `http://localhost:3000/alumini` - Should show alumni from Strapi
   - `http://localhost:3000/colleges` - Should show colleges from Strapi

## Troubleshooting

### API Returns 403 Forbidden
- Check API permissions in Settings → Roles → Public
- Ensure content is **Published** (not just saved as draft)

### Images Not Loading
- Check that media files are uploaded in Strapi
- Verify `NEXT_PUBLIC_STRAPI_API_URL` is correct
- Check CORS settings

### Fields Not Appearing
- Ensure fields are saved in Content-Type Builder
- Check that you're using the correct field names (case-sensitive)
- Restart Strapi after making schema changes

## Production Deployment

### Strapi Cloud
- Your Strapi instance is automatically deployed
- Update `NEXT_PUBLIC_STRAPI_API_URL` to your Strapi Cloud URL

### Self-Hosted
- Deploy Strapi to your preferred hosting (Heroku, Railway, DigitalOcean, etc.)
- Update environment variables
- Set up database (PostgreSQL recommended for production)
- Configure CORS for your production domain

## Next Steps

1. **Add more content** through the Strapi admin panel
2. **Customize fields** as needed for your use case
3. **Set up relations** if you want to link Alumni to Colleges
4. **Configure webhooks** for automatic rebuilds (if using static generation)

## Useful Strapi Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi Content-Type Builder Guide](https://docs.strapi.io/dev-docs/backend-customization/models)
- [Strapi API Documentation](https://docs.strapi.io/dev-docs/api/rest)

