// Path: app/contact/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Bungee } from "next/font/google";
import {
  ArrowRight,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";

// Signage-style display face, same as the home hero.
const display = Bungee({ subsets: ["latin"], weight: "400" });

// ---------------------------------------------------------------------------
// Business details (source: Mikmik's Garahe Facebook page)
// Instagram and TikTok are "#" until the real links exist.
// ---------------------------------------------------------------------------
const BUSINESS_NAME = "Mikmik's Garahe";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100083373601114";
const INSTAGRAM_URL = "#";
const TIKTOK_URL = "#";
const ADDRESS = "F&E De Castro Village, Molino Bacoor, Bacoor, Philippines";
const PHONE_DISPLAY = "0956 659 0932";
const PHONE_TEL = "+639566590932";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS_NAME}, ${ADDRESS}`,
)}`;

const contactOptions = [
  {
    icon: MessageCircle,
    title: "Message us on Facebook",
    value: BUSINESS_NAME,
    href: FACEBOOK_URL,
  },
  {
    icon: Phone,
    title: "Call us",
    value: PHONE_DISPLAY,
    href: `tel:${PHONE_TEL}`,
  },
  {
    icon: MapPin,
    title: "Visit us",
    value: ADDRESS,
    href: MAPS_URL,
  },
];

const socials = [
  { label: "Facebook", href: FACEBOOK_URL },
  { label: "Instagram", href: INSTAGRAM_URL },
  { label: "TikTok", href: TIKTOK_URL },
];

const privacyCopy = {
  title: "Privacy Policy",
  body: [
    `At ${BUSINESS_NAME}, we value your trust and are committed to protecting your personal information. We collect details you provide when contacting us, requesting a valuation, or browsing our inventory.`,
    "This information may be used to respond to enquiries, process vehicle transactions, improve our services, and communicate relevant updates. We do not sell your personal data to third parties for marketing purposes.",
    "We may use secure third-party tools to help operate our website, manage customer interactions, and improve the user experience. These partners are expected to handle your information with appropriate safeguards.",
    "You have the right to request access to, correction of, or deletion of your personal data, subject to legal and operational requirements. If you have any concerns, please contact our team directly.",
  ],
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lookingFor: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData | "privacy", string>>;

const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  lookingFor: "",
  message: "",
};

// Laravel snake_case field -> form field
const serverFieldMap: Record<string, keyof FormData> = {
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  phone: "phone",
  looking_for: "lookingFor",
  message: "message",
};

// Mirrors the Laravel rules. The server is the source of truth; this is just for fast feedback.
const NAME_PATTERN = new RegExp("^[\\p{L}\\p{M}\\s.'’-]+$", "u");
// PH mobile number: exactly 11 digits, starts with 09
const PHONE_PATTERN = /^09\d{9}$/;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5BC236]";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#06030D] px-4 py-3 text-white placeholder:text-zinc-500 transition-shadow focus:border-[#5BC236]  focus:outline-none";

const errorText = "text-[#FF7AA8]";

export default function Contact() {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState("");
  const [activeModal, setActiveModal] = useState<"privacy" | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFieldChange = (field: keyof FormData, value: string) => {
    // Phone: digits only, max 11
    const nextValue =
      field === "phone" ? value.replace(/\D/g, "").slice(0, 11) : value;

    setFormData((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    } else if (!NAME_PATTERN.test(formData.firstName.trim())) {
      nextErrors.firstName = "First name contains invalid characters.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    } else if (!NAME_PATTERN.test(formData.lastName.trim())) {
      nextErrors.lastName = "Last name contains invalid characters.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!PHONE_PATTERN.test(formData.phone.trim())) {
      nextErrors.phone = "Enter an 11-digit mobile number starting with 09.";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Please include a brief message.";
    } else if (formData.message.trim().length < 10) {
      nextErrors.message =
        "Please include a brief message (at least 10 characters).";
    }

    if (!acceptedPrivacy) {
      nextErrors.privacy =
        "Please agree to the privacy policy before submitting your enquiry.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!validateForm()) {
      return;
    }

    setPrivacyError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          looking_for: formData.lookingFor.trim() || null,
          message: formData.message.trim(),
          privacy_accepted: acceptedPrivacy,
          website: honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setFormData(emptyForm);
        setHoneypot("");
        setAcceptedPrivacy(false);
        setErrors({});
        setStatus({
          type: "success",
          message: data.message ?? "Thank you! Your enquiry has been received.",
        });
        return;
      }

      if (res.status === 422 && data.errors) {
        const serverErrors: FormErrors = {};
        Object.entries(data.errors as Record<string, string[]>).forEach(
          ([key, messages]) => {
            if (key === "privacy_accepted") {
              serverErrors.privacy = messages[0];
              return;
            }

            const field = serverFieldMap[key];
            if (field) {
              serverErrors[field] = messages[0];
            }
          },
        );
        setErrors(serverErrors);
        setStatus({
          type: "error",
          message: "Please fix the highlighted fields and try again.",
        });
        return;
      }

      setStatus({
        type: "error",
        message:
          res.status === 429
            ? "Too many attempts. Please wait a minute and try again."
            : (data.message ?? "Something went wrong. Please try again."),
      });
    } catch {
      setStatus({
        type: "error",
        message: "Unable to send your enquiry. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0E0818] text-white">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#06030D]">
          <div className="pointer-events-none absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-[#B026FF] opacity-20 blur-[140px]" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1
                className={`${display.className} text-[2rem] uppercase leading-[1.12] text-white  sm:text-5xl lg:text-[2.6rem] xl:text-5xl`}
              >
                <span className="block">{"Let's talk cars."}</span>
                <span className="block text-white">Tell us what you need.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                Buying, selling, or trading in, our team will guide you toward a
                car that fits your life, your budget, and your driving style.
                Message us on Facebook for the fastest reply, or send an enquiry
                below.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT + FORM */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* Left: contact rows, no cards */}
            <div>
              <ul className="border-t border-white/10">
                {contactOptions.map(({ icon: Icon, title, value, href }) => {
                  const external = href.startsWith("http");

                  return (
                    <li key={title} className="border-b border-white/10">
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className={`group flex items-start gap-4 py-6 ${focusRing}`}
                      >
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5  transition-shadow duration-300 ">
                          <Icon size={20} className="text-[#5BC236]" />
                        </span>

                        <span>
                          <span className="block text-sm text-zinc-500">
                            {title}
                          </span>
                          <span className="mt-1 block text-lg font-semibold text-white transition-colors group-hover:text-[#78D152]">
                            {value}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex gap-4">
                <Clock3 size={20} className="mt-0.5 shrink-0 text-[#D77BFF]" />
                <p className="text-sm leading-6 text-zinc-300">
                  Our Facebook page lists us as always open. Message us before
                  you visit so we can have the car ready for you.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
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

            {/* Right: form in a neon tube frame */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-[3px] border-[#B026FF] shadow-[0_0_28px_rgba(176,38,255,0.7),inset_0_0_20px_rgba(176,38,255,0.35)] sm:translate-x-4 sm:translate-y-4"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] border border-white/15 "
              />

              <div className="relative z-10 rounded-[2rem] bg-[#0E0818] p-5 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Send size={20} className="text-[#5BC236]" />
                  <h2
                    className={`${display.className} text-xl uppercase text-white sm:text-2xl`}
                  >
                    Send an enquiry
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                        First name
                        <span className={errorText} aria-label="required">
                          *
                        </span>
                      </span>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(event) =>
                          handleFieldChange("firstName", event.target.value)
                        }
                        maxLength={100}
                        autoComplete="given-name"
                        placeholder="John"
                        aria-invalid={Boolean(errors.firstName)}
                        className={inputClass}
                      />
                      {errors.firstName ? (
                        <span className={`mt-2 block text-sm ${errorText}`}>
                          {errors.firstName}
                        </span>
                      ) : null}
                    </label>

                    <label className="block">
                      <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                        Last name
                        <span className={errorText} aria-label="required">
                          *
                        </span>
                      </span>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(event) =>
                          handleFieldChange("lastName", event.target.value)
                        }
                        maxLength={100}
                        autoComplete="family-name"
                        placeholder="Smith"
                        aria-invalid={Boolean(errors.lastName)}
                        className={inputClass}
                      />
                      {errors.lastName ? (
                        <span className={`mt-2 block text-sm ${errorText}`}>
                          {errors.lastName}
                        </span>
                      ) : null}
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                        Email
                        <span className={errorText} aria-label="required">
                          *
                        </span>
                      </span>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(event) =>
                          handleFieldChange("email", event.target.value)
                        }
                        maxLength={255}
                        autoComplete="email"
                        placeholder="john@email.com"
                        aria-invalid={Boolean(errors.email)}
                        className={inputClass}
                      />
                      {errors.email ? (
                        <span className={`mt-2 block text-sm ${errorText}`}>
                          {errors.email}
                        </span>
                      ) : null}
                    </label>

                    <label className="block">
                      <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                        Phone
                        <span className={errorText} aria-label="required">
                          *
                        </span>
                      </span>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(event) =>
                          handleFieldChange("phone", event.target.value)
                        }
                        maxLength={11}
                        minLength={11}
                        pattern="09[0-9]{9}"
                        autoComplete="tel"
                        inputMode="numeric"
                        placeholder="09123456789"
                        title="11-digit mobile number starting with 09"
                        aria-invalid={Boolean(errors.phone)}
                        className={inputClass}
                      />
                      {errors.phone ? (
                        <span className={`mt-2 block text-sm ${errorText}`}>
                          {errors.phone}
                        </span>
                      ) : null}
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm text-zinc-300">
                      Looking for
                    </span>
                    <input
                      type="text"
                      value={formData.lookingFor}
                      onChange={(event) =>
                        handleFieldChange("lookingFor", event.target.value)
                      }
                      maxLength={255}
                      placeholder="SUV, sedan, MPV, pickup..."
                      className={inputClass}
                    />
                    {errors.lookingFor ? (
                      <span className={`mt-2 block text-sm ${errorText}`}>
                        {errors.lookingFor}
                      </span>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-1 text-sm text-zinc-300">
                      Message
                      <span className={errorText} aria-label="required">
                        *
                      </span>
                    </span>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(event) =>
                        handleFieldChange("message", event.target.value)
                      }
                      maxLength={5000}
                      placeholder="Tell us about your ideal vehicle, budget, and timeline..."
                      aria-invalid={Boolean(errors.message)}
                      className={`${inputClass} resize-none`}
                    />
                    {errors.message ? (
                      <span className={`mt-2 block text-sm ${errorText}`}>
                        {errors.message}
                      </span>
                    ) : null}
                  </label>

                  {/* Honeypot: hidden from people, bots tend to fill it in. */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                  >
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                      />
                    </label>
                  </div>

                  <label className="flex items-center gap-3 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedPrivacy}
                      onChange={(event) => {
                        setAcceptedPrivacy(event.target.checked);
                        if (event.target.checked) {
                          setPrivacyError("");
                          setErrors((current) => ({ ...current, privacy: "" }));
                        }
                      }}
                      className="h-4 w-4 rounded border-white/20 bg-[#06030D] text-[#5BC236] focus:ring-[#5BC236]"
                    />
                    <span>
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setActiveModal("privacy")}
                        className="font-medium text-white underline underline-offset-2 transition-colors hover:text-[#78D152]"
                      >
                        Privacy Policy
                      </button>{" "}
                      and consent to being contacted about my vehicle enquiry.
                    </span>
                  </label>

                  {errors.privacy || privacyError ? (
                    <p className={`text-sm ${errorText}`}>
                      {errors.privacy || privacyError}
                    </p>
                  ) : null}

                  {status ? (
                    <p
                      role="status"
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        status.type === "success"
                          ? "border-[#5BC236]/40 bg-white/5 text-[#78D152]"
                          : "border-[#FF7AA8]/40 bg-[#FF7AA8]/10 text-[#FF7AA8]"
                      }`}
                    >
                      {status.message}
                    </p>
                  ) : null}

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-zinc-400">
                      We’ll get back to you as soon as we can.
                    </p>

                    <button
                      type="submit"
                      disabled={!acceptedPrivacy || submitting}
                      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#5BC236] px-7 py-3 text-sm font-bold text-black  transition-all duration-300 hover:bg-[#78D152] disabled:cursor-not-allowed disabled:bg-[#5BC236]/25 disabled:text-zinc-400 disabled:shadow-none ${focusRing}`}
                    >
                      {submitting ? "Sending..." : "Send enquiry"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="border-t border-white/10 bg-[#06030D] py-14">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
            <h2
              className={`${display.className} max-w-xl text-xl uppercase leading-snug text-white sm:text-2xl`}
            >
              Ready to see the cars in person?
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/showroom"
                className={`inline-flex items-center justify-center rounded-full bg-[#5BC236] px-7 py-3.5 text-sm font-bold text-black  transition-all duration-300 hover:bg-[#78D152] ${focusRing}`}
              >
                Visit showroom
              </Link>

              <Link
                href="/sell-trade"
                className={`inline-flex items-center justify-center rounded-full border-2 border-[#B026FF] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(176,38,255,0.4)] transition-all duration-300 hover:border-[#D77BFF] hover:bg-[#B026FF]/15 ${focusRing}`}
              >
                Sell / Trade car
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#06030D]/70 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0E0818] ">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <h3 className="text-xl font-bold text-white">
                {privacyCopy.title}
              </h3>
              <button
                type="button"
                aria-label="Close privacy policy"
                onClick={() => setActiveModal(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-[#5BC236] hover:text-[#78D152]"
              >
                ×
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-5 text-sm leading-7 text-zinc-300 sm:px-6">
              {privacyCopy.body.map((paragraph) => (
                <p key={paragraph} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
