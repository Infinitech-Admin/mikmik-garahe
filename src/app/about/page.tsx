// Path: app/about/page.tsx
"use client";

import Link from "next/link";
import { Bungee } from "next/font/google";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BadgeCheck,
  CalendarCheck,
  CarFront,
  Images,
  MapPin,
  MessageCircle,
  Phone,
  Repeat,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import CTA from "../../components/home/cta";

// Signage-style display face, same as the home hero.
const display = Bungee({ subsets: ["latin"], weight: "400" });

// Source: Mikmik's Garahe Facebook page.
// Instagram and TikTok are "#" until the real links exist.
const BUSINESS = {
  name: "Mikmik's Garahe",
  tagline: "We buy rush cars. Let's go!",
  address: "F&E De Castro Village, Molino Bacoor, Bacoor, Philippines",
  phoneDisplay: "0956 659 0932",
  phoneHref: "tel:+639566590932",
  facebook: "https://www.facebook.com/profile.php?id=100083373601114",
  instagram: "#",
  tiktok: "#",
};

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.name}, ${BUSINESS.address}`,
)}`;

const facts = [
  { icon: MapPin, text: "Molino, Bacoor" },
  { icon: Star, text: "100% recommend, 17 Facebook reviews" },
  { icon: Repeat, text: "Buy, sell, and trade in one place" },
  { icon: Images, text: "Photos and videos on every listing" },
  { icon: CalendarCheck, text: "Book a test drive online" },
];

const services = [
  {
    icon: CarFront,
    word: "Buy",
    title: "Buy a car",
    description:
      "Browse the showroom with specs, mileage, photos, and videos shown up front, then pick the one that fits your life and budget.",
    href: "/showroom",
    cta: "Browse the showroom",
  },
  {
    icon: Banknote,
    word: "Sell",
    title: "Sell your car",
    description:
      "Need to sell fast? Get a quick value estimate online and send your car in for review. Our team will get back to you.",
    href: "/sell-trade",
    cta: "Get a value estimate",
  },
  {
    icon: Repeat,
    word: "Trade",
    title: "Trade it in",
    description:
      "Moving up or switching? Trade in your current car and put it toward your next one.",
    href: "/sell-trade",
    cta: "Start a trade-in",
  },
];

const journeys = [
  {
    title: "Buying with us",
    steps: [
      "Browse listings with full specs, mileage, photos, and videos.",
      "Message us or book a test drive online.",
      "Visit the showroom and drive it in person.",
    ],
  },
  {
    title: "Selling or trading in",
    steps: [
      "Enter your car's details and get a quick value estimate.",
      "Send it in for review.",
      "Our team gets back to you with the next steps.",
    ],
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Honest guidance",
    description:
      "The right purchase starts with clear information and no pressure. Every recommendation is based on your needs, not just the cars on our lot.",
  },
  {
    icon: BadgeCheck,
    title: "Clear details",
    description:
      "Specs, mileage, photos, and videos are on every listing, so you can decide with confidence whether it's your first car or your next upgrade.",
  },
  {
    icon: Users,
    title: "Friendly service",
    description:
      "From your first message to the final handover, our team is patient, responsive, and easy to talk to.",
  },
];

const socials = [
  { label: "Facebook", href: BUSINESS.facebook },
  { label: "Instagram", href: BUSINESS.instagram },
  { label: "TikTok", href: BUSINESS.tiktok },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5BC236]";

export default function About() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0E0818] text-white">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#06030D]">
          <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#B026FF] opacity-20 blur-[140px]" />

          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <h1
                  className={`${display.className} text-[2rem] uppercase leading-[1.12] text-white  sm:text-5xl lg:text-[2.6rem] xl:text-5xl`}
                >
                  <span className="block">We buy rush cars.</span>
                  <span className="block text-white">{"Let's go!"}</span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                  Mikmik&apos;s Garahe is a car dealership in Molino, Bacoor. We
                  buy, sell, and trade cars, with clear details and a
                  straightforward path to ownership.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/showroom"
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#5BC236] px-7 py-3.5 text-sm font-bold text-black  transition-all duration-300 hover:bg-[#78D152] ${focusRing}`}
                  >
                    Browse the showroom
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/sell-trade"
                    className={`inline-flex items-center justify-center rounded-full border-2 border-[#B026FF] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(176,38,255,0.45),inset_0_0_14px_rgba(176,38,255,0.25)] transition-all duration-300 hover:border-[#D77BFF] hover:bg-[#B026FF]/15 ${focusRing}`}
                  >
                    Sell / Trade your car
                  </Link>
                </div>
              </div>

              {/* Visit panel in a neon tube frame */}
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-[3px] border-[#B026FF] shadow-[0_0_28px_rgba(176,38,255,0.75),inset_0_0_20px_rgba(176,38,255,0.4)] sm:translate-x-4 sm:translate-y-4"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] border border-white/15 "
                />

                <div className="relative z-10 rounded-[2rem] bg-[#0E0818] p-6 sm:p-8">
                  <h2
                    className={`${display.className} text-2xl uppercase text-white`}
                  >
                    Find us
                  </h2>

                  <div className="mt-6 space-y-5">
                    <div className="flex gap-3">
                      <MapPin
                        size={18}
                        className="mt-1 shrink-0 text-[#5BC236]"
                      />
                      <p className="text-sm leading-7 text-zinc-300">
                        {BUSINESS.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone size={18} className="shrink-0 text-[#5BC236]" />
                      <a
                        href={BUSINESS.phoneHref}
                        className={`font-semibold text-white transition-colors hover:text-[#78D152] ${focusRing}`}
                      >
                        {BUSINESS.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <a
                      href={BUSINESS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#5BC236] px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-[#78D152] ${focusRing}`}
                    >
                      <MessageCircle size={16} />
                      Message us
                    </a>

                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 ${focusRing}`}
                    >
                      Directions
                      <ArrowUpRight size={16} />
                    </a>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5 text-sm">
                    <span className="mr-1 text-zinc-400">Follow us</span>
                    {socials.map((social) => {
                      const isLive = social.href !== "#";

                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target={isLive ? "_blank" : undefined}
                          rel={isLive ? "noopener noreferrer" : undefined}
                          className={`rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-semibold text-white transition-colors hover:border-[#5BC236] hover:text-[#78D152] ${focusRing}`}
                        >
                          {social.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Facts: neon-outlined chips */}
            <ul className="mt-14 flex flex-wrap gap-3">
              {facts.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2.5 rounded-full border border-[#B026FF]/50 bg-[#0E0818]/80 px-4 py-2.5 text-sm text-zinc-200 shadow-[0_0_16px_rgba(176,38,255,0.18)]"
                >
                  <Icon size={16} className="shrink-0 text-[#5BC236]" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* WHAT WE DO: three big rows instead of three cards */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h2
            className={`${display.className} max-w-2xl text-2xl uppercase leading-snug text-white sm:text-3xl`}
          >
            One dealership for every way you move.
          </h2>

          <ul className="mt-10 border-t border-white/10">
            {services.map(
              ({ icon: Icon, word, title, description, href, cta }) => (
                <li
                  key={title}
                  className="group grid gap-4 border-b border-white/10 py-8 transition-colors duration-300 hover:bg-white/10 md:grid-cols-[220px_1fr_auto] md:items-center md:gap-10 md:px-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 ">
                      <Icon size={22} className="text-[#5BC236]" />
                    </span>
                    <span
                      className={`${display.className} text-3xl uppercase text-white transition-[text-shadow] duration-300 `}
                    >
                      {word}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="mt-1.5 max-w-xl text-base leading-7 text-zinc-400">
                      {description}
                    </p>
                  </div>

                  <Link
                    href={href}
                    className={`inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#78D152] ${focusRing}`}
                  >
                    {cta}
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ),
            )}
          </ul>
        </section>

        {/* HOW IT WORKS: steps on a neon line */}
        <section className="border-y border-white/10 bg-[#06030D]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <h2
              className={`${display.className} text-2xl uppercase text-white sm:text-3xl`}
            >
              How it works
            </h2>

            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
              {journeys.map((journey) => (
                <div key={journey.title}>
                  <h3 className="text-xl font-bold text-white">
                    {journey.title}
                  </h3>

                  <ol className="relative mt-7 space-y-7 border-l-2 border-white/15 pl-8 ">
                    {journey.steps.map((step, index) => (
                      <li key={step} className="relative">
                        <span className="absolute -left-[3.05rem] flex size-9 items-center justify-center rounded-full border-2 border-white/30 bg-[#06030D] text-sm font-bold text-white ">
                          {index + 1}
                        </span>
                        <p className="pt-1 text-base leading-7 text-zinc-300">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2
                className={`${display.className} text-2xl uppercase leading-snug text-white sm:text-3xl`}
              >
                Buying should feel confident, not complicated.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-zinc-300">
                Whether you&apos;re shopping for a family SUV, a city car, or a
                pickup for work, we help you find something that fits your life
                and your budget.
              </p>
            </div>

            <ul className="divide-y divide-white/10 border-y border-white/10">
              {values.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-5 py-7">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#B026FF]/60 bg-[#B026FF]/10 shadow-[0_0_14px_rgba(176,38,255,0.35)]">
                    <Icon size={22} className="text-[#D77BFF]" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="mt-2 text-base leading-7 text-zinc-400">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
