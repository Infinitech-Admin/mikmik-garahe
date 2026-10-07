// components/auth/auth-shell.tsx

import Link from "next/link";
import type { ReactNode } from "react";
import { Bungee } from "next/font/google";
import {
  BadgeCheck,
  CarFront,
  CircleDollarSign,
  ShieldCheck,
} from "lucide-react";

// Blocky display face, close to the headline lettering on the home page.
const display = Bungee({ subsets: ["latin"], weight: "400" });

/* ------------------------------------------------------------------ */
/* Shared class strings (imported by the login / register pages)       */
/* ------------------------------------------------------------------ */

export const authLabelClass = "mb-1.5 block text-sm font-semibold text-white";

export const authInputClass =
  "w-full rounded-xl border border-[#8B2FE0]/40 bg-[#0D0718] px-4 py-3 text-sm text-white " +
  "placeholder:text-zinc-500 transition " +
  "hover:border-[#A855F7]/70 " +
  "focus:border-[#A855F7] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/40 " +
  "aria-[invalid=true]:border-rose-400/70";

export const authButtonClass =
  "flex w-full items-center justify-center gap-2 rounded-full bg-[#4CBB17] px-6 py-3 " +
  "text-sm font-bold text-[#06030D] transition " +
  "hover:bg-[#5FD42A] hover:shadow-[0_0_24px_rgba(76,187,23,0.45)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39FF14] " +
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none";

export const authErrorClass = "mt-1.5 text-sm text-rose-400";

export const authLinkClass =
  "font-semibold text-[#39FF14] underline-offset-4 transition hover:underline " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39FF14]";

/* ------------------------------------------------------------------ */
/* Brand mark                                                          */
/* ------------------------------------------------------------------ */

function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Mikmik's Garahe home"
      className={`inline-block select-none ${className}`}
    >
      <span
        className={`${display.className} block -skew-x-12 text-3xl leading-none tracking-tight text-[#4CBB17] sm:text-4xl`}
        style={{ textShadow: "3px 3px 0 #8B2FE0" }}
      >
        MIKMIK&apos;S
      </span>
      <span className="mt-1 ml-4 block w-fit bg-[#4CBB17] px-2 py-0.5 text-[10px] font-extrabold tracking-[0.55em] text-[#06030D]">
        GARAHE
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

const PERKS = [
  {
    icon: ShieldCheck,
    title: "Verified vehicles",
    text: "Carefully inspected cars",
  },
  {
    icon: CircleDollarSign,
    title: "Flexible financing",
    text: "Options built around you",
  },
  {
    icon: CarFront,
    title: "Trade-in welcome",
    text: "Upgrade your current vehicle",
  },
  {
    icon: BadgeCheck,
    title: "Easy transactions",
    text: "From inquiry to handover",
  },
];

interface AuthShellProps {
  headline: string;
  blurb: string;
  children: ReactNode;
}

export function AuthShell({ headline, blurb, children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06030D] text-white">
      {/* Purple glow, top-left, like the home page */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#6B1FB8]/30 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 right-0 h-[28rem] w-[28rem] rounded-full bg-[#4A1590]/25 blur-[140px]"
      />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8">
        {/* Brand panel */}
        <section className="flex flex-col">
          <Logo />

          <h2
            className={`${display.className} mt-8 max-w-md text-3xl leading-[1.1] text-white sm:text-4xl lg:mt-14 lg:text-5xl`}
          >
            {headline}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-300">
            {blurb}
          </p>

          {/* Trust strip: hidden on small screens to keep the form near the top */}
          <ul className="mt-10 hidden max-w-md grid-cols-2 gap-3 lg:grid">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-3 rounded-2xl border border-[#8B2FE0]/40 bg-[#0D0718]/70 p-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#4CBB17]">
                  <Icon size={16} aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {title}
                  </span>
                  <span className="block text-xs text-zinc-400">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Form card with neon purple edge */}
        <main className="relative">
          <div
            aria-hidden
            className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#A855F7] via-[#8B2FE0]/40 to-[#6B1FB8] opacity-80 blur-[2px]"
          />
          <div className="relative rounded-3xl border border-[#A855F7]/50 bg-[#0A0512] p-6 shadow-[0_0_48px_rgba(139,47,224,0.35)] sm:p-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
