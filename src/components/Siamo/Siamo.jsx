import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Siamo.css";

gsap.registerPlugin(ScrollTrigger);

function splitChars(str) {
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
  durationPx = 900,
}) {
  const rootRef = useRef(null);

  const titleChars = useMemo(() => splitChars(title || ""), [title]);

  const bodyText = useMemo(() => {
    return paragraphs.join("\n\n");
  }, [paragraphs]);

  const bodyChars = useMemo(() => splitChars(bodyText), [bodyText]);

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

      // ✅ Stato iniziale (matcha CSS, ma qui lo ribadiamo per sicurezza)
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], {
        opacity: 0,
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

      // 1) Entra “cornice” (kicker + underline) insieme
      tl.to(
        [kickerEl, underlineEl],
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: 0.12,
        },
        0.02
      );

      // 2) Appare il blocco titolo (wrapper) e poi i chars
      tl.to(
        titleWrap,
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: 0.06,
        },
        0.06
      );

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

      // 3) Body wrapper e poi i chars del body
      tl.to(
        bodyWrap,
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: 0.06,
        },
        0.22
      );

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
  }, [id, durationPx, titleChars.length, bodyChars.length]);

  return (
    <section className="siamoSection" id={id} ref={rootRef}>
      <div className="siamoInner">
        <div className="siamoKicker" data-kicker>
          {kicker}
        </div>

        <h2 className="siamoTitle" data-titlewrap aria-label={title}>
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

        <div className="siamoUnderline" data-underline aria-hidden="true" />

        <div className="siamoBody" data-bodywrap aria-label={bodyText}>
          {bodyChars.map(({ ch, key }, idx) => {
            if (ch === "\n") return <br key={`br-${key}-${idx}`} />;

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
      </div>
    </section>
  );
}
