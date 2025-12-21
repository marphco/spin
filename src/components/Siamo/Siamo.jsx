import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Siamo.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Tokenizza preservando whitespace e newline.
 * - Spazi e tab vengono mantenuti come token separati
 * - \n viene mantenuto come token separato
 */
function tokenize(str) {
  return str.split(/(\n|[ \t]+)/g).filter((t) => t !== "");
}

function Word({ token, type }) {
  // type: "t" -> title, "b" -> body (solo per data-attr)
  const chars = Array.from(token);
  const dataAttr = type === "t" ? "data-tch" : "data-bch";

  return (
    <span className="siamoWord" aria-hidden="true">
      {chars.map((ch, i) => (
        <span key={`${type}-${token}-${i}`} {...{ [dataAttr]: true }} className="siamoCh">
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Siamo({
  id = "siamo",
  kicker = "Siamo",
  title,
  paragraphs = [],
  durationPx = 900,
}) {
  const rootRef = useRef(null);

  const bodyText = useMemo(() => paragraphs.join("\n\n"), [paragraphs]);

  const titleTokens = useMemo(() => tokenize(title || ""), [title]);
  const bodyTokens = useMemo(() => tokenize(bodyText), [bodyText]);

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

      // ✅ Stato iniziale (ANTI flash, tutto davvero invisibile)
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], { opacity: 0, y: 10 });
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

      // cornice
      tl.to([kickerEl, underlineEl], { opacity: 1, y: 0, ease: "none", duration: 0.12 }, 0.02);

      // titolo wrapper + chars
      tl.to(titleWrap, { opacity: 1, y: 0, ease: "none", duration: 0.06 }, 0.06);
      tl.to(
        titleEls,
        { opacity: 1, y: 0, ease: "none", duration: 0.22, stagger: { amount: 0.22, from: "start" } },
        0.08
      );

      // body wrapper + chars
      tl.to(bodyWrap, { opacity: 1, y: 0, ease: "none", duration: 0.06 }, 0.22);
      tl.to(
        bodyEls,
        { opacity: 1, y: 0, ease: "none", duration: 0.78, stagger: { amount: 0.85, from: "start" } },
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

        <h2 className="siamoTitle" data-titlewrap aria-label={title}>
          {titleTokens.map((tok, idx) => {
            if (tok === "\n") return <br key={`tbr-${idx}`} />;
            if (/^[ \t]+$/.test(tok)) return <span key={`tsp-${idx}`}>{" "}</span>;
            return <Word key={`tw-${idx}`} token={tok} type="t" />;
          })}
        </h2>

        <div className="siamoUnderline" data-underline aria-hidden="true" />

        <div className="siamoBody" data-bodywrap aria-label={bodyText}>
          {bodyTokens.map((tok, idx) => {
            if (tok === "\n") return <br key={`bbr-${idx}`} />;
            if (/^[ \t]+$/.test(tok)) return <span key={`bsp-${idx}`}>{" "}</span>;
            return <Word key={`bw-${idx}`} token={tok} type="b" />;
          })}
        </div>
      </div>
    </section>
  );
}
