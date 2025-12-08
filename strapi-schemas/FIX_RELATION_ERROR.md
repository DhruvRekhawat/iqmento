# Fix User-Alumni Relation Error

## The Problem

The error occurs because:
- Your User model (from users-permissions plugin) has an `alumniId` field
- It expects the Alumni model to have a `userId` field as the inverse relation
- But the Alumni schema doesn't have this field

## Solution 1: Add userId to Alumni (Current Schema)

The schema file `alumni.schema.json` now includes the `userId` relation field. This should fix the error.

## Solution 2: Remove Relation from User Model

If you don't need the User-Alumni relation, remove it from the User model:

1. Navigate to: `src/plugins/users-permissions/server/content-types/user/schema.json`
2. Find and remove the `alumniId` field from the attributes
3. Restart Strapi

## Solution 3: Remove userId from Alumni Schema

If you don't need the relation, you can remove the `userId` field from the Alumni schema:

1. Open `strapi-schemas/alumni.schema.json`
2. Remove the `userId` field (lines 15-20)
3. Copy the updated schema to your Strapi project
4. Restart Strapi

## Which Solution to Choose?

- **Use Solution 1** if: You want Alumni profiles linked to User accounts
- **Use Solution 2 or 3** if: Alumni and Users are separate (no relation needed)

For most cases, if you're just managing Alumni content without user authentication, **Solution 3** is recommended.

