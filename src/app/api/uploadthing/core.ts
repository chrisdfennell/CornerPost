import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Anyone can post a listing (no accounts), so uploads are open but bounded.
export const ourFileRouter = {
  listingImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 8 },
  }).onUploadComplete(async ({ file }) => {
    // The returned value is passed to the client as `serverData`.
    return { url: file.ufsUrl };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
