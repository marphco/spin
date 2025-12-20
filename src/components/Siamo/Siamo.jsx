import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Siamo.css";

gsap.registerPlugin(ScrollTrigger);

function splitChars(str) {
  // preserva gli spazi: li rendiamo espliciti come token " "
  return Array.from(str).map((ch, i) => ({
    ch,
    key: `${i}-${ch === " " ? "space" : ch}`,
  }));
}

export default function Siamo({
  id = "siamo",
  kicker = "Siamo",
  title,
  paragraphs = [],
  durationPx = 900, // quanto “scrivere” (700–1200)
}) {
  const rootRef = useRef(null);

  const titleChars = useMemo(() => splitChars(title || ""), [title]);

  const bodyText = useMemo(() => {
    // separo i paragrafi con doppio a-capo (gestito poi in CSS come blocchi)
    return paragraphs.join("\n\n");
  }, [paragraphs]);

  const bodyChars = useMemo(() => splitChars(bodyText), [bodyText]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // kill SOLO il nostro trigger se esiste già
      ScrollTrigger.getById(`siamo-${id}`)?.kill(true);

      const titleEls = root.querySelectorAll("[data-tch]");
      const bodyEls = root.querySelectorAll("[data-bch]");

      gsap.set(titleEls, { opacity: 0, y: 6 });
      gsap.set(bodyEls, { opacity: 0 });

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

          // evita micro-jump al confine del pin
          onLeave: (self) => self.animation.progress(1),
          onLeaveBack: (self) => self.animation.progress(0),
        },
      });

      // NIENTE dead-zone: usa amount (più stabile di each)
      tl.to(
        titleEls,
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: 0.18,
          stagger: { amount: 0.16, from: "start" },
        },
        0.02
      );

      tl.to(
        bodyEls,
        {
          opacity: 1,
          ease: "none",
          duration: 0.82,
          stagger: { amount: 0.8, from: "start" },
        },
        0.16
      );
    }, root);

    return () => ctx.revert();
  }, [id, durationPx, titleChars.length, bodyChars.length]);

  return (
    <section className="siamoSection" id={id} ref={rootRef}>
      <div className="siamoInner">
        {/* Kicker */}
        <div className="siamoKicker">{kicker}</div>

        {/* Titolo (type feel ma subito leggibile) */}
        <h2 className="siamoTitle" aria-label={title}>
          {titleChars.map(({ ch, key }) => (
            <span
              key={key}
              data-tch
              className={`siamoCh ${ch === " " ? "isSpace" : ""}`}
              aria-hidden="true"
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h2>

        {/* Una sola underline (basta “doppie linee”) */}
        <div className="siamoUnderline" aria-hidden="true" />

        {/* Body: scritto allo scroll */}
        <div className="siamoBody" aria-label={bodyText}>
          {bodyChars.map(({ ch, key }, idx) => {
            // gestiamo i \n\n come “a capo doppio”
            const isNewline = ch === "\n";
            if (isNewline) {
              // trasformiamo newline in <br/> (due newline = due br)
              return <br key={`br-${key}-${idx}`} />;
            }

            return (
              <span
                key={key}
                data-bch
                className={`siamoCh ${ch === " " ? "isSpace" : ""}`}
                aria-hidden="true"
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </div>

        {/* <div className="siamoNote">Scorri per scrivere il testo</div> */}
      </div>
    </section>
  );
}
