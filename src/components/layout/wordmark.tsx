// components/layout/wordmark.tsx
//
// Shared Mikmik's Garahe logo. Used by the navbar, login and register.
// Place it inside an element with the `group` class for the hover effects.
// Size it with a text-size class: everything inside scales with em.


// Big white italic "BOSS" (the O is a wheel) with a red "AUTO EXCHANGE" bar
// that spans the full width of the word, like the logo artwork.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex flex-col items-stretch whitespace-nowrap leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] ${className}`}
    >
      <span
        role="img"
        aria-label="Mikmik's Garahe"
        className="flex items-center justify-center font-black uppercase italic tracking-[0.04em] text-white [text-shadow:0_0_22px_rgba(57,255,20,0.95),0_0_6px_rgba(255,255,255,0.35),3px_3px_0_#39FF14] transition-all duration-300 group-hover:[text-shadow:0_0_30px_rgba(124,255,91,1),0_0_8px_rgba(255,255,255,0.5),3px_3px_0_#7CFF5B]"
      >
        <span aria-hidden="true">{"MIKMIK'S"}</span>
      </span>
      <span className="mt-[0.35em] block rounded-[0.2em] bg-[#39FF14] px-[0.6em] py-[0.25em] text-center text-[0.34em] font-extrabold uppercase italic tracking-[0.16em] text-black shadow-[0_0_16px_rgba(57,255,20,0.85)] transition-colors duration-300 group-hover:bg-[#7CFF5B]">
        Garahe
      </span>
    </span>
  );
}
