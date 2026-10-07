"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  MEDIA_BASE_URL,
  fetchBlogPosts,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type BlogPost,
} from "@/lib/api";

const DEFAULT_LOAD_ERROR =
  "We couldn’t load the blog right now. Please refresh the page and try again.";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const { data } = await fetchBlogPosts({ signal });
      setPosts(data ?? []);
      setIsLoading(false);
    } catch (err) {
      if (isAbortError(err)) return;
      setLoadError((err as ApiError).message || DEFAULT_LOAD_ERROR);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0E0818] text-white">
        <section className="relative overflow-hidden border-b border-[#39FF14]/20 bg-[#06030D]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(57,255,20,0.18),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-[#39FF14]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7CFF5B]">
                  Blog
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                News, stories
                <span className="block text-[#7CFF5B]">& updates</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                Fresh arrivals, deliveries, and behind-the-scenes from Mikmik Garahe
                Exchange.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="rounded-[28px] border border-white/10 bg-[#0E0818] px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#39FF14]/30 bg-[#39FF14]/10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#39FF14]/40 border-t-[#39FF14]" />
              </div>
              <p className="mt-6 text-2xl font-bold text-white">
                Loading posts...
              </p>
            </div>
          ) : loadError ? (
            <div className="rounded-[28px] border border-[#39FF14]/30 bg-[#0E0818] px-6 py-16 text-center">
              <p className="text-2xl font-bold text-white">
                Something went wrong
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-300">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => load()}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#39FF14] px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-[#7CFF5B]"
              >
                <RotateCcw size={16} />
                Retry
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/15 bg-[#0E0818] px-6 py-16 text-center">
              <p className="text-xl font-semibold text-white">No posts yet</p>
              <p className="mt-2 text-sm text-zinc-400">
                Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => {
                const imageSrc = resolveMediaUrl(post.image, MEDIA_BASE_URL);
                const hasVideo = Boolean(post.video);

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#0E0818] transition-all duration-300 hover:-translate-y-1 hover:border-[#39FF14]/50 hover:shadow-[0_25px_60px_rgba(57,255,20,0.15)]"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[#06030D]">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={post.title}
                          width={800}
                          height={450}
                          unoptimized
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : hasVideo ? (
                        <video
                          src={`${resolveMediaUrl(post.video, MEDIA_BASE_URL)}#t=0.1`}
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-zinc-600">
                          No media
                        </div>
                      )}

                      {hasVideo && (
                        <span className="absolute inset-0 flex items-center justify-center bg-[#06030D]/30">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#39FF14] shadow-[0_0_24px_rgba(57,255,20,0.7)]">
                            <Play
                              size={22}
                              className="ml-0.5 fill-white text-white"
                            />
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                        {formatDate(post.created_at)}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-white">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-300">
                        {post.description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#7CFF5B]">
                        Read more
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
