import { PostForm } from "./PostForm";
import { currentPlace } from "@/lib/place-server";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Post a listing · CornerPost" };
export const dynamic = "force-dynamic";

export default async function PostPage() {
  const place = await currentPlace();
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Post a listing
        </h1>
        <p className="mt-2 text-slate-500">
          It’s free. Add a photo and a clear description to get more responses.
        </p>
      </div>
      <div className="mt-8">
        <PostForm
          defaultPlace={place?.slug}
          uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
          sessionUser={user ? { email: user.email, name: user.name ?? "" } : undefined}
        />
      </div>
    </div>
  );
}

