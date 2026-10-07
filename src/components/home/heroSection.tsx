import Image from "next/image";
import Link from "next/link";
import { Bungee } from "next/font/google";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  CircleDollarSign,
  ShieldCheck,
} from "lucide-react";

// Signage-style display face: fits the neon street signs in the logo art.
const display = Bungee({ subsets: ["latin"], weight: "400" });

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified vehicles",
    description: "Carefully inspected cars",
  },
  {
    icon: CircleDollarSign,
    title: "Flexible financing",
    description: "Options built around you",
  },
  {
    icon: CarFront,
    title: "Trade-in welcome",
    description: "Upgrade your current vehicle",
  },
  {
    icon: BadgeCheck,
    title: "Easy transactions",
    description: "From inquiry to handover",
  },
];

const headlineLines = ["Your next car,", "checked and", "ready to drive."];

// One page-load moment: the neon frame "switches on" with a short flicker,
// then the headline lines and the buttons settle in. CSS only, and turned
// off for people who prefer reduced motion.
const heroAnimations = `
  @keyframes mk-frame-on {
    0%   { opacity: 0; }
    8%   { opacity: 1; }
    14%  { opacity: 0.25; }
    22%  { opacity: 1; }
    30%  { opacity: 0.5; }
    38%  { opacity: 1; }
    100% { opacity: 1; }
  }
  @keyframes mk-photo-in {
    from { opacity: 0; transform: scale(1.04); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes mk-text-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .mk-frame { animation: mk-frame-on 1.4s steps(1, end) 0.1s both; }
  .mk-photo { animation: mk-photo-in 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both; }
  .mk-text  { animation: mk-text-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }

  @media (prefers-reduced-motion: reduce) {
    .mk-frame, .mk-photo, .mk-text { animation: none !important; }
  }
`;

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#06030D]">
      <style>{heroAnimations}</style>

      {/* Two quiet color pools, like light spilling from street signs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#B026FF] opacity-20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* TEXT */}
          <div>
            <h1
              className={`${display.className} text-[2rem] uppercase leading-[1.12] text-white  sm:text-5xl lg:text-[2.6rem] xl:text-5xl`}
            >
              {headlineLines.map((line, index) => (
                <span
                  key={line}
                  className="mk-text block"
                  style={{ animationDelay: `${0.5 + index * 0.12}s` }}
                >
                  {line}
                </span>
              ))}
            </h1>

            <p
              className="mk-text mt-6 max-w-md text-base leading-7 text-zinc-300 lg:text-lg"
              style={{ animationDelay: "0.95s" }}
            >
              Every vehicle is inspected before it reaches the showroom, with
              clear details from your first look to the day you get the keys.
            </p>

            <div
              className="mk-text mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
              style={{ animationDelay: "1.1s" }}
            >
              <Link
                href="/showroom"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#5BC236] px-8 py-4 text-sm font-bold text-black  transition-all duration-300 hover:bg-[#78D152]  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse cars
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/sell-trade"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#B026FF] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(176,38,255,0.45),inset_0_0_14px_rgba(176,38,255,0.25)] transition-all duration-300 hover:border-[#D77BFF] hover:bg-[#B026FF]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Sell or trade your car
              </Link>
            </div>
          </div>

          {/* PHOTO in a neon tube frame */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* Purple tube, offset behind */}
            <div
              aria-hidden="true"
              className="mk-frame absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-[3px] border-[#B026FF] shadow-[0_0_28px_rgba(176,38,255,0.75),inset_0_0_20px_rgba(176,38,255,0.45)] sm:translate-x-4 sm:translate-y-4"
            />
            {/* Green tube, in front */}
            <div
              aria-hidden="true"
              className="mk-frame absolute inset-0 z-20 rounded-[2rem] border border-white/15 "
            />

            <div className="mk-photo relative z-10 aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#0E0818] lg:aspect-[5/4]">
              <Image
                src="/showroom-collection.jpg"
                alt="Mikmik's Garahe showroom"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06030D]/60 via-transparent to-[#B026FF]/10" />
            </div>
          </div>
        </div>

        {/* BENEFITS: one rounded neon panel, divided by thin lines */}
        <ul className="mt-14 grid grid-cols-2 overflow-hidden rounded-3xl border border-[#B026FF]/50 bg-[#0E0818]/80 shadow-[0_0_30px_rgba(176,38,255,0.2)] backdrop-blur-xl lg:mt-16 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <li
                key={benefit.title}
                className={`flex items-center gap-3 px-4 py-5 sm:gap-4 sm:px-6 ${
                  index % 2 === 1 ? "border-l border-white/10" : ""
                } ${index >= 2 ? "border-t border-white/10 lg:border-t-0" : ""} ${
                  index > 0 ? "lg:border-l lg:border-white/10" : ""
                }`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 ">
                  <Icon
                    size={20}
                    strokeWidth={1.9}
                    className="text-[#5BC236]"
                  />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white sm:text-base">
                    {benefit.title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-5 text-zinc-400 sm:text-sm">
                    {benefit.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
