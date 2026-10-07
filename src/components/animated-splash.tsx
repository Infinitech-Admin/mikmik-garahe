"use client";

import { useEffect, useState } from "react";

/**
 * AnimatedSplash — "tachometer" version
 * -------------------------------------
 * The wordmark MIKMIK'S GARAHE starts dark. Under it, a tachometer
 * sweeps from 0 to redline: the arc fills, the needle climbs, and the
 * % counter runs. As the needle passes, each letter of MIKMIK'S ignites
 * in order, and the GARAHE tag is revealed.
 * At redline the wordmark flares, then everything fades into the homepage.
 *
 * - Shows only when running as an installed PWA (standalone).
 * - Once per session.
 * - Test in a normal browser tab: /?splash
 * - Respects prefers-reduced-motion.
 *
 * Place as the FIRST child inside <body> in app/layout.tsx.
 */

type Props = {
  /** How long the splash stays before it starts fading out (ms). */
  duration?: number;
  /** Fade-out length (ms). */
  fadeMs?: number;
};

type Phase = "pending" | "show" | "exit" | "done";

const SESSION_KEY = "mg-splash-seen";

const WORD = "MIKMIK'S".split("");

/* ---------- Gauge geometry (viewBox 200 x 150, 240° sweep) ---------- */
const CX = 100;
const CY = 92;
const rad = (deg: number) => (deg * Math.PI) / 180;

// 33 ticks: every 7.5°, a major tick (and number) every 4th, redline from 6
const TICKS = Array.from({ length: 33 }, (_, i) => ({
  i,
  angle: -120 + 7.5 * i,
  major: i % 4 === 0,
  red: i >= 24,
}));

export default function AnimatedSplash({
  duration = 3700,
  fadeMs = 600,
}: Props) {
  const [phase, setPhase] = useState<Phase>("pending");

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: window-controls-overlay)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    const forced = new URLSearchParams(window.location.search).has("splash");

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage unavailable: just show */
    }

    if ((!standalone && !forced) || (seen && !forced)) {
      setPhase("done");
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const total = reduced ? 1000 : duration;

    setPhase("show");
    const exitTimer = window.setTimeout(() => setPhase("exit"), total);
    const doneTimer = window.setTimeout(() => setPhase("done"), total + fadeMs);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [duration, fadeMs]);

  if (phase === "done") return null;

  return (
    <div
      className="mg-splash"
      data-active={phase === "show" || phase === "exit"}
      data-exit={phase === "exit"}
      role="status"
      aria-live="polite"
      aria-label="Loading Mikmik's Garahe"
      style={{ ["--mg-fade" as string]: `${fadeMs}ms` }}
    >
      <div className="mg-stage">
        {/* MIKMIK'S — dark until the needle reaches each letter */}
        <h1 className="mg-word" aria-label="Mikmik's Garahe">
          {WORD.map((ch, i) => (
            <span
              key={i}
              className="mg-l"
              aria-hidden="true"
              style={{ animationDelay: `${450 + i * 270}ms` }}
            >
              {ch}
            </span>
          ))}
        </h1>

        {/* GARAHE — revealed in step with the needle */}
        <div className="mg-tag">
          <span>Garahe</span>
        </div>

        {/* Tachometer = the loading bar */}
        <div className="mg-gauge" aria-hidden="true">
          <svg viewBox="0 0 200 150" overflow="visible">
            <defs>
              <linearGradient id="mgArc" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#5BC236" />
                <stop offset="1" stopColor="#B026FF" />
              </linearGradient>
              <linearGradient id="mgNeedle" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#5BC236" />
                <stop offset="1" stopColor="#D58CFF" />
              </linearGradient>
              <radialGradient id="mgGlow">
                <stop offset="0" stopColor="#B026FF" stopOpacity="0.55" />
                <stop offset="1" stopColor="#B026FF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* glow behind the dial, brightens as RPM climbs */}
            <circle
              className="mg-gglow"
              cx={CX}
              cy={CY}
              r="78"
              fill="url(#mgGlow)"
            />

            {/* track */}
            <path
              d="M30.72 132 A80 80 0 1 1 169.28 132"
              fill="none"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* redline zone */}
            <path
              d="M174.48 49 A86 86 0 0 1 174.48 135"
              fill="none"
              stroke="#B026FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* progress arc */}
            <path
              className="mg-arc"
              d="M30.72 132 A80 80 0 1 1 169.28 132"
              pathLength={100}
              fill="none"
              stroke="url(#mgArc)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="100"
            />

            {/* ticks */}
            <g strokeLinecap="round">
              {TICKS.map((t) => (
                <line
                  key={t.i}
                  x1={CX}
                  y1={CY - 74}
                  x2={CX}
                  y2={CY - (t.major ? 62 : 68)}
                  transform={`rotate(${t.angle} ${CX} ${CY})`}
                  stroke={t.red ? "#B026FF" : "#fff"}
                  strokeOpacity={t.major ? 0.9 : 0.4}
                  strokeWidth={t.major ? 2 : 1}
                />
              ))}
            </g>

            {/* numbers 0–8 */}
            <g className="mg-nums" textAnchor="middle" fontSize="9">
              {TICKS.filter((t) => t.major).map((t) => (
                <text
                  key={t.i}
                  x={(CX + 50 * Math.sin(rad(t.angle))).toFixed(2)}
                  y={(CY - 50 * Math.cos(rad(t.angle)) + 3.2).toFixed(2)}
                  fill={t.red ? "#D58CFF" : "#fff"}
                  fillOpacity={t.red ? 1 : 0.75}
                >
                  {t.i / 4}
                </text>
              ))}
              <text
                x={CX}
                y="66"
                fontSize="5"
                fill="#fff"
                fillOpacity="0.45"
                letterSpacing="1"
              >
                x1000 r/min
              </text>
            </g>

            {/* needle */}
            <g className="mg-needle">
              <polygon
                points="98.6,102 98,92 100,24 102,92 101.4,102"
                fill="url(#mgNeedle)"
              />
            </g>
            {/* hub */}
            <circle
              cx={CX}
              cy={CY}
              r="7"
              fill="#0C0716"
              stroke="#fff"
              strokeWidth="2"
            />
            <circle cx={CX} cy={CY} r="2.6" fill="#5BC236" />
          </svg>

          {/* % readout */}
          <div className="mg-readout" />
        </div>
      </div>

      <style>{`
        @property --mg-n {
          syntax: "<integer>";
          inherits: true;
          initial-value: 0;
        }

        .mg-splash {
          --green: #5BC236;
          --neon: #5BC236;
          --purple: #B026FF;
          --purple-glow: #B026FF;
          --navy: #06030D;
          --t0: 300ms;      /* sweep start */
          --drive: 2600ms;  /* sweep duration (gauge = loading bar) */
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(55% 40% at 50% 55%, rgba(176,38,255,0.3), transparent 70%),
            var(--navy);
          opacity: 1;
          transition: opacity var(--mg-fade, 600ms) ease, transform var(--mg-fade, 600ms) ease;
          padding: env(safe-area-inset-top) env(safe-area-inset-right)
                   env(safe-area-inset-bottom) env(safe-area-inset-left);
        }
        @media (display-mode: standalone),
               (display-mode: window-controls-overlay),
               (display-mode: fullscreen) {
          .mg-splash { display: flex; }
        }
        .mg-splash[data-active="true"] { display: flex; }
        .mg-splash[data-exit="true"] {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }

        .mg-stage {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: fit-content;
          /* 8 letters wide: sized so the wordmark fits narrow phones */
          font-size: clamp(30px, 10.5vw, 76px);
        }

        /* ---------- Wordmark ---------- */
        .mg-word {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Arial Black", "Helvetica Neue", Arial, system-ui, sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 1em;
          line-height: 1;
          letter-spacing: 0.01em;
          animation: mg-flare 700ms ease-out 2900ms;
        }
        .mg-l {
          display: inline-block;
          color: var(--green);
          /* purple offset shadow, like the logo */
          text-shadow:
            0.06em 0.06em 0 var(--purple),
            0 0 0.4em rgba(176,38,255,0.5);
          opacity: 0.12; /* unlit */
          /* per-letter delay is set inline; each ignites as the needle passes */
          animation: mg-ignite 520ms ease-out forwards;
        }

        /* ---------- GARAHE tag ---------- */
        .mg-tag {
          align-self: center;
          margin-top: 0.14em;
          background: var(--green);
          color: var(--navy);
          font-family: "Arial Black", "Helvetica Neue", Arial, system-ui, sans-serif;
          font-weight: 900;
          font-size: 0.2em;
          letter-spacing: 0.55em;
          text-transform: uppercase;
          padding: 0.4em 0.4em 0.4em 1em; /* right pad offsets trailing letter-spacing */
          box-shadow: 0 0 1.4em rgba(91,194,54,0.45);
          clip-path: inset(0 100% 0 0);
          animation: mg-reveal var(--drive) linear var(--t0) forwards;
        }

        /* ---------- Gauge ---------- */
        .mg-gauge {
          --g: clamp(190px, 58vw, 300px);
          position: relative;
          width: var(--g);
          font-size: calc(var(--g) / 8);
          margin: clamp(18px, 4vw, 30px) auto 0;
          animation: mg-flare 700ms ease-out 2900ms;
        }
        .mg-gauge svg { display: block; width: 100%; height: auto; overflow: visible; }
        .mg-gauge text {
          font-family: "Arial Black", "Helvetica Neue", Arial, system-ui, sans-serif;
          font-weight: 900;
          font-style: italic;
        }

        .mg-arc {
          stroke-dashoffset: 100;
          filter: drop-shadow(0 0 3px rgba(176,38,255,0.9));
          animation: mg-arc var(--drive) linear var(--t0) both;
        }
        .mg-needle {
          transform-box: view-box;
          transform-origin: 100px 92px;
          transform: rotate(-120deg);
          filter: drop-shadow(0 0 3px rgba(176,38,255,0.9));
          animation: mg-needle var(--drive) linear var(--t0) both;
        }
        .mg-gglow {
          opacity: 0.1;
          animation: mg-gglow var(--drive) linear var(--t0) both;
        }

        .mg-readout {
          position: absolute;
          left: 50%;
          top: 74%;
          transform: translateX(-50%);
          font-family: "Arial Black", "Helvetica Neue", Arial, system-ui, sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 1em;
          line-height: 1;
          color: #fff;
          text-shadow: 0 0 0.4em rgba(176,38,255,0.6);
          font-variant-numeric: tabular-nums;
          counter-reset: mg-n var(--mg-n);
          animation: mg-count var(--drive) linear var(--t0) both;
        }
        .mg-readout::before { content: counter(mg-n) "%"; }

        /* ---------- Keyframes ---------- */
        /* needle, arc, counter and tag reveal share one speed curve */
        @keyframes mg-needle {
          0%   { transform: rotate(-120deg); animation-timing-function: linear; }
          85%  { transform: rotate(84deg);   animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { transform: rotate(120deg); }
        }
        @keyframes mg-arc {
          0%   { stroke-dashoffset: 100; animation-timing-function: linear; }
          85%  { stroke-dashoffset: 15;  animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes mg-count {
          0%   { --mg-n: 0;   animation-timing-function: linear; }
          85%  { --mg-n: 85;  animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { --mg-n: 100; }
        }
        @keyframes mg-gglow {
          0%   { opacity: 0.1; }
          100% { opacity: 0.9; }
        }
        @keyframes mg-reveal {
          0%   { clip-path: inset(0 100% 0 0); animation-timing-function: linear; }
          85%  { clip-path: inset(0 15% 0 0);  animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes mg-ignite {
          0%   { opacity: 0.12; }
          20%  { opacity: 1; }
          32%  { opacity: 0.35; }
          50%  { opacity: 1; }
          62%  { opacity: 0.7; }
          100% { opacity: 1; }
        }
        @keyframes mg-flare {
          0%   { filter: brightness(1) drop-shadow(0 0 0 rgba(176,38,255,0)); }
          35%  { filter: brightness(1.35) drop-shadow(0 0 0.22em rgba(176,38,255,0.85)); }
          100% { filter: brightness(1) drop-shadow(0 0 0 rgba(176,38,255,0)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .mg-splash *, .mg-splash *::before {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
            transition: none !important;
          }
          .mg-splash[data-exit="true"] { transform: none; }
        }
      `}</style>
    </div>
  );
}
