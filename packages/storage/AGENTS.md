# AGENTS.md - Storage Package (@repo/storage)

## Overview

File upload and storage management using Vercel Blob.

## File Structure

```
packages/storage/
├── index.ts            # Main exports
├── keys.ts             # Environment variable validation
└── package.json
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking
```

## Dependencies

### Key External Dependencies
- `@vercel/blob` - Vercel Blob storage

## Environment Variables

**Server-side (secret):**
```
BLOB_READ_WRITE_TOKEN    # Vercel Blob token (optional)
```

From `keys.ts`:
```typescript
server: {
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
}
```

## Key Patterns

### Uploading Files
```typescript
import { put } from "@repo/storage";

const { url } = await put("uploads/image.png", file, {
  access: "public",
});
```

### Listing Files
```typescript
import { list } from "@repo/storage";

const { blobs } = await list({
  prefix: "uploads/",
});
```

### Deleting Files
```typescript
import { del } from "@repo/storage";

await del("uploads/image.png");
```

### Generating Upload URLs (Client Upload)
```typescript
import { generateClientTokenFromReadWriteToken } from "@repo/storage";

const token = await generateClientTokenFromReadWriteToken({
  pathname: "uploads/user-123/",
  onUploadCompleted: async ({ blob }) => {
    // Handle upload completion
  },
});
```

## File Upload API Route

Create an API route for client-side uploads:
```typescript
import { handleUpload } from "@vercel/blob/client";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname) => {
      // Validate user permissions
      return {
        allowedContentTypes: ["image/jpeg", "image/png"],
        maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
      };
    },
    onUploadCompleted: async ({ blob }) => {
      // Save blob URL to database
    },
  });
  return Response.json(response);
}
```

## Security Considerations

- `BLOB_READ_WRITE_TOKEN` grants full access - never expose
- Validate file types and sizes before upload
- Use `onBeforeGenerateToken` to verify user permissions
- Set appropriate `access` level (public vs private)
- Implement file type validation on both client and server
- Consider signed URLs for private file access
