// app/login/page.tsx

"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { login, fetchMe, type ApiError } from "@/lib/api";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

// Where each role lands after signing in.
// Change "/" to "/dashboard" once customer accounts have their own dashboard.
const ROLE_REDIRECTS: Record<string, string> = {
  admin: "/admin",
  user: "/",
};

const DEFAULT_REDIRECT = "/";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    setLoading(true);

    try {
      const data = await login(form);

      // Use the role from the login response; if the API doesn't return
      // the user there, fall back to /me (the session cookie is already set).
      // The redirect is only for UX — /admin must still be protected on the
      // server (middleware / layout) and in the API.
      const role = data?.user?.role ?? (await fetchMe()).user.role;

      // If we were sent here from a protected page (e.g. checkout), go back
      // there. Only same-site paths are allowed, to avoid open redirects.
      const redirectParam = new URLSearchParams(window.location.search).get(
        "redirect",
      );
      const safeRedirect =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//")
          ? redirectParam
          : null;

      const destination =
        safeRedirect ?? ROLE_REDIRECTS[role] ?? DEFAULT_REDIRECT;

      router.push(destination);
      router.refresh();
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const key in apiErr.errors) {
          fieldErrors[key] = apiErr.errors[key][0];
        }
        setErrors(fieldErrors);
      } else {
        setFormError(apiErr.message || "Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-800 bg-black py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#39FF14] focus:shadow-[0_0_0_3px_rgba(57,255,20,0.18),0_0_18px_rgba(57,255,20,0.25)]";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-16">
      {/* neon glow pools, like light spilling off a night-street sign */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-[#39FF14]/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#39FF14]/10 blur-[140px]"
      />

      {/* neon tube along the bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-10 h-[3px] bg-gradient-to-r from-transparent via-[#39FF14] to-transparent shadow-[0_0_18px_4px_rgba(57,255,20,0.55)]"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex flex-col items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39FF14]"
          >
            {/* brushed-metal ring, echoing the circular badge in the logo */}
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 via-zinc-500 to-zinc-300 p-[3px] shadow-[0_0_24px_rgba(57,255,20,0.45)]">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-black text-[#39FF14]">
                <Car size={28} />
              </span>
            </span>
            <span
              className="text-4xl font-black italic tracking-tight text-[#39FF14]"
              style={{
                textShadow:
                  "0 0 8px rgba(57,255,20,0.7), 0 0 28px rgba(57,255,20,0.45)",
              }}
            >
              Mikmik&apos;s
            </span>
            <span className="-mt-2 text-sm font-medium tracking-[0.55em] text-zinc-300">
              Garahe
            </span>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-[#39FF14]/30 bg-black/80 p-6 shadow-[0_0_40px_rgba(57,255,20,0.14)] backdrop-blur-xl sm:p-8"
        >
          <h1 className="mb-1 text-xl font-bold text-white">Welcome back</h1>
          <p className="mb-6 text-sm text-zinc-400">
            Sign in to find your next ride.
          </p>

          {formError && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {formError}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className={`${inputClass} pr-11`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-[#39FF14] focus-visible:text-[#39FF14] focus-visible:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="mb-6 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="h-4 w-4 rounded border-zinc-700 bg-black accent-[#39FF14]"
              />
              Remember me
            </label>
            {/* <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#39FF14] hover:text-[#7dff63]"
            >
              Forgot password?
            </Link> */}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#39FF14] py-3.5 text-sm font-bold text-black shadow-[0_0_22px_rgba(57,255,20,0.5)] transition-all duration-300 hover:bg-[#6bff4f] hover:shadow-[0_0_32px_rgba(57,255,20,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            New to Mikmik&apos;s Garahe?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#39FF14] hover:text-[#7dff63]"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
