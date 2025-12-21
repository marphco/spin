import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Siamo.css";

gsap.registerPlugin(ScrollTrigger);

// Tokenizza in: WORD | SPACE | BR (newline)
function tokenizeText(str) {
  const s = String(str || "");
  const out = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    // newline => BR
    if (ch === "\n") {
      out.push({ type: "br", key: `br-${i}` });
      i += 1;
      continue;
    }

    // whitespace (spazi/tabs) => SPACE (preserviamo la run)
    if (/\s/.test(ch)) {
      let j = i;
      while (j < s.length && /\s/.test(s[j]) && s[j] !== "\n") j++;
      const text = s.slice(i, j);
      out.push({ type: "space", text, key: `sp-${i}-${j}` });
      i = j;
      continue;
    }

    // word run => WORD (poi splittiamo in chars)
    let j = i;
    while (j < s.length && !/\s/.test(s[j]) && s[j] !== "\n") j++;
    const word = s.slice(i, j);

    out.push({
      type: "word",
      word,
      chars: Array.from(word).map((c, k) => ({
        ch: c,
        key: `c-${i}-${k}-${c}`,
      })),
      key: `w-${i}-${j}`,
    });

    i = j;
  }

  return out;
}

export default function Siamo({
  id = "siamo",
  kicker = "Siamo",
  title,
  paragraphs = [],
  durationPx = 900,
}) {
  const rootRef = useRef(null);

  const titleTokens = useMemo(() => tokenizeText(title || ""), [title]);

  const bodyText = useMemo(() => paragraphs.join("\n\n"), [paragraphs]);
  const bodyTokens = useMemo(() => tokenizeText(bodyText), [bodyText]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.getById(`siamo-${id}`)?.kill(true);

      const kickerEl = root.querySelector("[data-kicker]");
      const underlineEl = root.querySelector("[data-underline]");
      const titleWrap = root.querySelector("[data-titlewrap]");
      const bodyWrap = root.querySelector("[data-bodywrap]");

      const titleEls = root.querySelectorAll("[data-tch]");
      const bodyEls = root.querySelectorAll("[data-bch]");

      // ✅ Anti-flash robusto: autoAlpha = opacity + visibility
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], {
        autoAlpha: 0,
        y: 10,
      });

      gsap.set(titleEls, { opacity: 0, y: 10 });
      gsap.set(bodyEls, { opacity: 0, y: 6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: `siamo-${id}`,
          trigger: root,
          start: "top top",
          end: `+=${durationPx}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1) Cornice (kicker + underline) insieme
      tl.to(
        [kickerEl, underlineEl],
        { autoAlpha: 1, y: 0, ease: "none", duration: 0.12 },
        0.02
      );

      // 2) Wrapper titolo + chars
      tl.to(titleWrap, { autoAlpha: 1, y: 0, ease: "none", duration: 0.06 }, 0.06);

      tl.to(
        titleEls,
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: 0.22,
          stagger: { amount: 0.22, from: "start" },
        },
        0.08
      );

      // 3) Wrapper body + chars
      tl.to(bodyWrap, { autoAlpha: 1, y: 0, ease: "none", duration: 0.06 }, 0.22);

      tl.to(
        bodyEls,
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: 0.78,
          stagger: { amount: 0.85, from: "start" },
        },
        0.24
      );
    }, root);

    return () => ctx.revert();
  }, [id, durationPx, titleTokens.length, bodyTokens.length]);

  return (
    <section className="siamoSection" id={id} ref={rootRef}>
      <div className="siamoInner">
        <div className="siamoKicker" data-kicker>
          {kicker}
        </div>

        {/* ✅ Word-wrapping: ogni parola è un blocco nowrap, ma dentro animiamo i chars */}
        <h2 className="siamoTitle" data-titlewrap aria-label={title}>
          {titleTokens.map((t) => {
            if (t.type === "br") return <br key={t.key} />;
            if (t.type === "space")
              return (
                <span key={t.key} className="siamoSpace" aria-hidden="true">
                  {t.text.replace(/ /g, "\u00A0")}
                </span>
              );

            // word
            return (
              <span key={t.key} className="siamoWord" aria-hidden="true">
                {t.chars.map(({ ch, key }) => (
                  <span key={key} data-tch className="siamoCh">
                    {ch}
                  </span>
                ))}
              </span>
            );
          })}
        </h2>

        <div className="siamoUnderline" data-underline aria-hidden="true" />

        <div className="siamoBody" data-bodywrap aria-label={bodyText}>
          {bodyTokens.map((t) => {
            if (t.type === "br") return <br key={t.key} />;
            if (t.type === "space")
              return (
                <span key={t.key} className="siamoSpace" aria-hidden="true">
                  {t.text.replace(/ /g, "\u00A0")}
                </span>
              );

            return (
              <span key={t.key} className="siamoWord" aria-hidden="true">
                {t.chars.map(({ ch, key }) => (
                  <span key={key} data-bch className="siamoCh">
                    {ch}
                  </span>
                ))}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
