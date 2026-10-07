"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  MEDIA_BASE_URL,
  fetchBlogPost,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type BlogPost,
} from "@/lib/api";

export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) return;
      setIsLoading(true);
      setLoadError(null);

      try {
        const { data } = await fetchBlogPost(id, { signal });
        setPost(data);
        setIsLoading(false);
      } catch (err) {
        if (isAbortError(err)) return;
        const e = err as ApiError;
        setLoadError(
          e.status === 404
            ? "This post doesn’t exist or was removed."
            : e.message || "We couldn’t load this post.",
        );
        setIsLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const imageSrc = post ? resolveMediaUrl(post.image, MEDIA_BASE_URL) : "";
  const videoSrc = post ? resolveMediaUrl(post.video, MEDIA_BASE_URL) : "";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0E0818] text-white">
        <div className="border-b border-[#39FF14]/20 bg-[#06030D] pb-10 pt-28 sm:pt-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#7CFF5B] hover:text-[#7CFF5B]"
            >
              <ArrowLeft size={16} />
              Back to blog
            </Link>

            {post && (
              <>
                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-zinc-400">
                  {new Date(post.created_at).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {post.title}
                </h1>
              </>
            )}
          </div>
        </div>

        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="rounded-[28px] border border-white/10 bg-[#0E0818] px-6 py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#39FF14]/40 border-t-[#39FF14]" />
              <p className="mt-4 text-sm text-zinc-400">Loading post...</p>
            </div>
          ) : loadError || !post ? (
            <div className="rounded-[28px] border border-[#39FF14]/30 bg-[#0E0818] px-6 py-16 text-center">
              <p className="text-2xl font-bold text-white">
                Something went wrong
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-300">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => load()}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#39FF14] px-5 py-3 text-sm font-semibold text-black hover:bg-[#7CFF5B]"
              >
                <RotateCcw size={16} />
                Retry
              </button>
            </div>
          ) : (
            <article className="space-y-8">
              {videoSrc ? (
                <div className="overflow-hidden rounded-[26px] border border-white/10 bg-black">
                  <video
                    src={videoSrc}
                    poster={imageSrc || undefined}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full"
                  />
                </div>
              ) : imageSrc ? (
                <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#06030D]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={post.title}
                    className="w-full object-cover"
                  />
                </div>
              ) : null}

              <p className="whitespace-pre-line text-base leading-8 text-zinc-300 sm:text-lg">
                {post.description}
              </p>
            </article>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
