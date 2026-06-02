import { PostForm } from "./PostForm";

export const metadata = { title: "Post a listing · CornerPost" };

export default function PostPage() {
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
        <PostForm />
      </div>
    </div>
  );
}
