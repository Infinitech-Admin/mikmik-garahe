import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

// ---------------------------------------------------------------------------
// Business details
// TODO: fill in the real Mikmik's Garahe details below. Anything left empty
// is hidden automatically instead of showing placeholder text.
// ---------------------------------------------------------------------------
const BUSINESS_NAME = "Mikmik's Garahe";
const FACEBOOK_URL = ""; // e.g. "https://www.facebook.com/yourpage"
const INSTAGRAM_URL = ""; // e.g. "https://www.instagram.com/yourpage"
const TIKTOK_URL = ""; // e.g. "https://www.tiktok.com/@yourpage"
const ADDRESS_LINE_1 = ""; // e.g. "123 Sample St."
const ADDRESS_LINE_2 = ""; // e.g. "Quezon City, Philippines"
const PHONE_DISPLAY = ""; // e.g. "0917 123 4567"
const PHONE_TEL = ""; // e.g. "+639171234567"
const EMAIL = ""; // e.g. "hello@yourdomain.com"

const HAS_ADDRESS = Boolean(ADDRESS_LINE_1 || ADDRESS_LINE_2);

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS_NAME}, ${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`,
)}`;

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Mikmik's Garahe palette
// neon green #5BC236 | green hover #78D152 | neon purple #B026FF
// light purple #D77BFF | background #06030D
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5BC236]";

// Text logo: neon green "MIKMIK'S" with a purple offset shadow and a
// "GARAHE" tag underneath. Place inside an element with the `group` class
// for hover effects. Size is controlled with a text-size class
// (everything scales with em).
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex flex-col items-center whitespace-nowrap leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] ${className}`}
    >
      <span
        role="img"
        aria-label="Mikmik's Garahe"
        className="flex items-center font-black uppercase italic tracking-[0.06em] text-[#5BC236] [text-shadow:0_0_12px_rgba(91,194,54,0.3),2px_2px_0_#B026FF] transition-all duration-300 group-hover:[text-shadow:0_0_16px_rgba(120,209,82,0.4),2px_2px_0_#D77BFF]"
      >
        <span aria-hidden="true">{"MIKMIK'S"}</span>
      </span>
      <span className="mt-1.5 rounded-[3px] bg-[#5BC236] px-2 py-[3px] text-[0.34em] font-extrabold uppercase italic tracking-[0.5em] text-black  transition-colors duration-300 group-hover:bg-[#78D152]">
        Garahe
      </span>
    </span>
  );
}

const socialLink =
  "flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all duration-300 hover:border-[#5BC236]/50 hover:bg-white/10 hover:text-[#78D152]";

export default function Footer() {
  const hasSocials = Boolean(FACEBOOK_URL || INSTAGRAM_URL || TIKTOK_URL);
  const hasContact =
    HAS_ADDRESS || Boolean(PHONE_DISPLAY && PHONE_TEL) || Boolean(EMAIL);

  return (
    <>
      <footer className="border-t border-white/10 bg-[#06030D] text-white ">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          {/* Main Footer */}
          <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
            {/* Brand */}
            <div className="lg:col-span-1">
              {/* Logo (text wordmark) */}
              <Link
                href="/"
                aria-label={`${BUSINESS_NAME} home`}
                className={`group inline-block ${focusRing}`}
              >
                <Wordmark className="text-4xl" />
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">
                Quality pre-owned vehicles, transparent transactions, and a
                better way to find your next drive.
              </p>

              {/* Socials */}
              {hasSocials ? (
                <div className="mt-6 flex items-center gap-3">
                  {FACEBOOK_URL ? (
                    <a
                      href={FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${BUSINESS_NAME} on Facebook`}
                      className={`${socialLink} ${focusRing}`}
                    >
                      <FacebookIcon className="size-4" />
                    </a>
                  ) : null}

                  {INSTAGRAM_URL ? (
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${BUSINESS_NAME} on Instagram`}
                      className={`${socialLink} ${focusRing}`}
                    >
                      <InstagramIcon className="size-4" />
                    </a>
                  ) : null}

                  {TIKTOK_URL ? (
                    <a
                      href={TIKTOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${BUSINESS_NAME} on TikTok`}
                      className={`${socialLink} ${focusRing}`}
                    >
                      <TikTokIcon className="size-4" />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Explore
              </h3>

              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <Link
                    href="/showroom"
                    className="text-zinc-400 transition-colors hover:text-[#78D152]"
                  >
                    Browse Inventory
                  </Link>
                </li>

                <li>
                  <Link
                    href="/sell-trade"
                    className="text-zinc-400 transition-colors hover:text-[#78D152]"
                  >
                    Sell / Trade Car
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about"
                    className="text-zinc-400 transition-colors hover:text-[#78D152]"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="text-zinc-400 transition-colors hover:text-[#78D152]"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Services
              </h3>

              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <Link
                    href="/showroom"
                    className="text-zinc-400 transition-colors hover:text-[#78D152]"
                  >
                    Vehicle Sales
                  </Link>
                </li>

                <li>
                  <Link
                    href="/sell-trade"
                    className="text-zinc-400 transition-colors hover:text-[#78D152]"
                  >
                    Vehicle Trade-In
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="text-zinc-400 transition-colors hover:text-[#78D152]"
                  >
                    Test Drive
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            {hasContact ? (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                  Contact
                </h3>

                <div className="mt-6 space-y-4 text-sm">
                  {HAS_ADDRESS ? (
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 text-zinc-400 transition-colors hover:text-[#78D152]"
                    >
                      <MapPin className="mt-0.5 size-4 shrink-0 text-[#5BC236]" />
                      <address className="not-italic">
                        {ADDRESS_LINE_1}
                        <br />
                        {ADDRESS_LINE_2}
                      </address>
                    </a>
                  ) : null}

                  {PHONE_DISPLAY && PHONE_TEL ? (
                    <a
                      href={`tel:${PHONE_TEL}`}
                      className="flex items-center gap-3 text-zinc-400 transition-colors hover:text-[#78D152]"
                    >
                      <Phone className="size-4 text-[#5BC236]" />
                      {PHONE_DISPLAY}
                    </a>
                  ) : null}

                  {EMAIL ? (
                    <a
                      href={`mailto:${EMAIL}`}
                      className="flex items-center gap-3 text-zinc-400 transition-colors hover:text-[#78D152]"
                    >
                      <Mail className="size-4 text-[#5BC236]" />
                      {EMAIL}
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          {/* Bottom */}
          <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-center text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="space-y-1">
              <p>
                &copy; {new Date().getFullYear()} {BUSINESS_NAME}. All rights
                reserved.
              </p>
              <span>
                Powered by{" "}
                <Link
                  href="https://www.infinitechphil.com/"
                  className="transition-colors hover:text-[#78D152]"
                >
                  Infinitech Advertising Corporation
                </Link>
              </span>
            </div>

            <div className="flex justify-center gap-5 sm:justify-end">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-[#78D152]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms-and-conditions"
                className="transition-colors hover:text-[#78D152]"
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
