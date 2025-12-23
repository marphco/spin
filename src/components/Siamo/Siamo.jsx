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
        <span
          key={`${type}-${token}-${i}`}
          {...{ [dataAttr]: true }}
          className="siamoCh"
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Siamo({ id="siamo", kicker="Siamo", title, paragraphs=[], durationPx=900 }) {
  const rootRef = useRef(null);

  // ✅ disponibili nel render
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  const reduceChars = isMobile;

  const bodyText = useMemo(() => paragraphs.join("\n\n"), [paragraphs]);
  const titleTokens = useMemo(() => tokenize(title || ""), [title]);
  const bodyTokens  = useMemo(() => tokenize(bodyText), [bodyText]);

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
      const bodyEls  = root.querySelectorAll("[data-bch]");

      // ✅ mobile: animiamo wrapper, non i char
      const titleTargets = reduceChars ? [titleWrap] : titleEls;
      const bodyTargets  = reduceChars ? [bodyWrap]  : bodyEls;

      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], { autoAlpha: 0, y: 10 });
      gsap.set(titleTargets, { autoAlpha: 0, y: 10 });
      gsap.set(bodyTargets,  { autoAlpha: 0, y: 6 });

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

      tl.to([kickerEl, underlineEl], { autoAlpha: 1, y: 0, ease: "none", duration: 0.12 }, 0.02);
      tl.to(titleWrap, { autoAlpha: 1, y: 0, ease: "none", duration: 0.06 }, 0.06);

      tl.to(
        titleTargets,
        reduceChars
          ? { autoAlpha: 1, y: 0, ease: "none", duration: 0.22 }
          : { autoAlpha: 1, y: 0, ease: "none", duration: 0.22, stagger: { amount: 0.22, from: "start" } },
        0.08
      );

      tl.to(bodyWrap, { autoAlpha: 1, y: 0, ease: "none", duration: 0.06 }, 0.22);

      tl.to(
        bodyTargets,
        reduceChars
          ? { autoAlpha: 1, y: 0, ease: "none", duration: 0.45 }
          : { autoAlpha: 1, y: 0, ease: "none", duration: 0.78, stagger: { amount: 0.85, from: "start" } },
        0.24
      );
    }, rootRef);

    return () => ctx.revert();
  }, [id, durationPx, titleTokens.length, bodyTokens.length, reduceChars]);

  return (
    <section className="siamoSection" id={id} ref={rootRef}>
      <div id="siamo__nav" className="navAnchor" aria-hidden="true" />
      <div className="siamoInner">
        <div className="siamoKicker" data-kicker>{kicker}</div>

        <h2 className="siamoTitle" data-titlewrap aria-label={title}>
          {reduceChars
            ? title
            : titleTokens.map((tok, idx) => {
                if (tok === "\n") return <br key={`tbr-${idx}`} />;
                if (/^[ \t]+$/.test(tok)) return <span key={`tsp-${idx}`}> </span>;
                return <Word key={`tw-${idx}`} token={tok} type="t" />;
              })}
        </h2>

        <div className="siamoUnderline" data-underline aria-hidden="true" />

        <div className="siamoBody" data-bodywrap aria-label={bodyText}>
          {reduceChars
            ? paragraphs.map((p, i) => (
                <p key={i} className="siamoP">{p}</p>
              ))
            : bodyTokens.map((tok, idx) => {
                if (tok === "\n") return <br key={`bbr-${idx}`} />;
                if (/^[ \t]+$/.test(tok)) return <span key={`bsp-${idx}`}> </span>;
                return <Word key={`bw-${idx}`} token={tok} type="b" />;
              })}
        </div>
      </div>
    </section>
  );
}
