# Vercel Blob Integration

This project uses Vercel Blob for image storage, allowing up to 15 images per product.

## Setup Instructions

### 1. Create a Vercel Blob Store

1. Go to your Vercel dashboard
2. Navigate to Storage → Create → Blob Store
3. Connect the store to your project

### 2. Configure Environment Variables

Add the following to your `.env` file:

```
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

You can find this token in your Vercel project settings under "Environment Variables" after you've created and linked a Blob store.

### 3. Usage in the API

The API now supports the following operations with Vercel Blob:

- Upload a single image: `POST /api/upload`
- Upload multiple images (max 15): `POST /api/upload/multiple`
- Delete an image: `DELETE /api/upload/:filename`
- List images for a product: `GET /api/upload/product/:productId`

### 4. Image Path Structure

Images are stored in Vercel Blob with the following path structure:

```
products/{productId}/{timestamp}-{originalFilename}
```

This allows for easy organization and retrieval of images by product.

### 5. Maximum Images Per Product

There is a limit of 15 images per product. The API will enforce this limit and return an error if you try to upload more.

### 6. Client Integration

The client's `imageUtils.ts` has been updated to handle Vercel Blob URLs automatically.

### 7. Local Development

When running locally, you'll need the `BLOB_READ_WRITE_TOKEN` environment variable set to use Vercel Blob. All uploads, even in development, will go to Vercel Blob.

## Benefits of Vercel Blob

- No filesystem limitations in serverless environments
- CDN-backed global distribution
- No need for separate file serving endpoints
- Direct URLs for each image
- Scalability and reliability

## Migration from Previous Storage

If you have existing images in the old storage system, you'll need to migrate them to Vercel Blob. Contact the development team for migration assistance.
