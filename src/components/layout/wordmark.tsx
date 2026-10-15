// components/layout/wordmark.tsx
//
// Shared Mikmik's Garahe logo. Used by the navbar, login, register and
// verify-email pages.
// Place it inside an element with the `group` class for the hover effects.
// Size it with a text-size class: everything inside scales with em.
//
// Palette: neon green #5BC236 | green hover #78D152 | neon purple #B026FF
//          light purple #D77BFF

// Neon green italic "MIKMIK'S" with a purple offset shadow and a green
// "GARAHE" tag underneath.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      translate="no"
      className={`notranslate flex flex-col items-center whitespace-nowrap leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] ${className}`}
    >
      <span
        role="img"
        aria-label="Mikmik's Garahe"
        className="flex items-center font-black uppercase italic tracking-[0.06em] text-[#5BC236] [text-shadow:0_0_12px_rgba(91,194,54,0.3),2px_2px_0_#B026FF] transition-all duration-300 group-hover:[text-shadow:0_0_16px_rgba(120,209,82,0.4),2px_2px_0_#D77BFF]"
      >
        <span aria-hidden="true">{"MIKMIK'S"}</span>
      </span>
      <span className="mt-[0.35em] rounded-[3px] bg-[#5BC236] px-2 py-[3px] text-[0.34em] font-extrabold uppercase italic tracking-[0.5em] text-black transition-colors duration-300 group-hover:bg-[#78D152]">
        Garahe
      </span>
    </span>
  );
}

export default Wordmark;
