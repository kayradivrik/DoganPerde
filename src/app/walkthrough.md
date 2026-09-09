# Walkthrough - Sanity CMS Leads Migration

We have successfully migrated the Customer Leads (Teklifler) architecture to Sanity CMS. The site is now completely independent of MongoDB and local JSON files.

## Changes Made

### 1. Data Schema
- Created the **Müşteri Talepleri (`lead`)** document schema in Sanity (`schemaTypes/lead.ts`), standardizing fields for contact information, curtain specifications, and status tracking.
- Registered the schema in the Sanity Studio dashboard.

### 2. API Refactoring
- **`POST /api/leads`**: Form submissions from `http://localhost:3000/teklif-al` are now instantly pushed directly to Sanity Cloud using `client.create()`.
- **`GET /api/leads`**: The admin dashboard now reads live customer inquiries securely from Sanity Cloud using GROQ queries (`client.fetch()`).
- **`PATCH & DELETE /api/leads/[id]`**: Updating a lead's status (e.g. from *Pending* to *Contacted*) and deleting spam leads now natively mutate documents within Sanity via `client.patch()` and `client.delete()`.

### 3. Architecture Cleanup
- Deleted all obsolete offline JSON fallback scripts (`src/lib/leadsFallback.js`) and local temporary files (`src/data/leads.json`).
- Updated the custom Next.js admin dashboard React component (`src/app/teklifler-listesi/page.js`) to automatically normalize Sanity's specific `_id` and `_createdAt` fields, ensuring a seamless visual transition with zero UI bugs.

## Validation Results
- The system is fully cloud-native.
- Leads will persist reliably regardless of server restarts or Vercel redeployments.

> [!CAUTION]
> The `SANITY_API_WRITE_TOKEN` in your `.env.local` is now the critical key allowing the contact form to write data to your Sanity Cloud. If this token is missing or invalid, the form will fail to submit.
