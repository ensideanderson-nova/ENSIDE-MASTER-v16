# Vercel Configuration Notes

## vercel.json

This file contains the Vercel deployment configuration for the ENSIDE MASTER system.

### Environment Variables

The `vercel.json` file references the following environment variables:

- **EVOLUTION_API_URL**: URL of the Evolution API server
- **EVOLUTION_API_KEY**: Uses `@evolution-api-key` which is a Vercel Secret reference
- **EVOLUTION_INSTANCE**: Name of the Evolution API instance
- **GOOGLE_SHEETS_ID**: Google Sheets document ID
- **NODE_ENV**: Node environment (production)

### About @evolution-api-key

The `@evolution-api-key` syntax in `vercel.json` is a reference to a Vercel Secret. 

**You have TWO options:**

#### Option 1: Create a Vercel Secret (Recommended for security)

```bash
vercel secrets add evolution-api-key "evolution-api-enside-2024-secret"
```

The `vercel.json` file will automatically use this secret during deployment.

#### Option 2: Override with Environment Variable (Simpler)

In the Vercel dashboard, add an environment variable:
- Variable: `EVOLUTION_API_KEY`
- Value: `evolution-api-enside-2024-secret`

This will override the `@evolution-api-key` reference in `vercel.json`.

### Headers Configuration

The file configures CORS headers for all `/api/*` endpoints:
- `Access-Control-Allow-Origin: *` - Allows requests from any origin
- `Access-Control-Allow-Methods: GET, POST, OPTIONS` - Allowed HTTP methods
- `Access-Control-Allow-Headers: Content-Type, apikey` - Allowed headers

### Why No Rewrites?

Previous versions had a redundant rewrite rule (`/api/(.*)` → `/api/$1`). This was removed as Vercel automatically handles API routes in the `/api` directory without requiring explicit rewrites.

---

For more information, see the main [README.md](README.md).
