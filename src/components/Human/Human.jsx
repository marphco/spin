import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Human.css";

gsap.registerPlugin(ScrollTrigger);

function tokenize(str) {
  return str.split(/(\n|[ \t]+)/g).filter((t) => t !== "");
}

function Word({ token, type }) {
  const chars = Array.from(token);
  const dataAttr = type === "t" ? "data-htch" : "data-hbch";

  return (
    <span className="humWord" aria-hidden="true">
      {chars.map((ch, i) => (
        <span
          key={`${type}-${token}-${i}`}
          {...{ [dataAttr]: true }}
          className="humCh"
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Human({
  id = "human",
  kicker = "HUMAN",
  title = "Dati che diventano direzione.",
  paragraphs = [],
  textPx,
}) {
  const rootRef = useRef(null);

  const bodyText = useMemo(() => paragraphs.join("\n\n"), [paragraphs]);
  const titleTokens = useMemo(() => tokenize(title), [title]);
  const bodyTokens = useMemo(() => tokenize(bodyText), [bodyText]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.getById(`human-${id}`)?.kill(true);

      const kickerEl = root.querySelector("[data-hkicker]");
      const underlineEl = root.querySelector("[data-hunderline]");
      const titleWrap = root.querySelector("[data-htitlewrap]");
      const bodyWrap = root.querySelector("[data-hbodywrap]");

      const titleEls = Array.from(root.querySelectorAll("[data-htch]"));
      const bodyEls = Array.from(root.querySelectorAll("[data-hbch]"));

      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], {
        autoAlpha: 0,
        y: 10,
      });
      gsap.set(titleEls, { autoAlpha: 0, y: 10 });
      gsap.set(bodyEls, { autoAlpha: 0, y: 6 });

      const charsCount = titleEls.length + bodyEls.length;
      const vw = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      const mobileBoost = vw < 640 ? 1.35 : vw < 900 ? 1.18 : 1;

      const textPxAuto = Math.round(
        Math.max(950, Math.min(2800, charsCount * 3.6)) * mobileBoost
      );
      const textPxFinal = typeof textPx === "number" ? textPx : textPxAuto;

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      ScrollTrigger.create({
        id: `human-${id}`,
        trigger: root,
        start: "top top",
        end: () => `+=${textPxFinal}`,
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      const pad = 12;
      const frame = Math.round(textPxFinal * 0.12);
      const wrap = Math.round(textPxFinal * 0.06);
      const titleSeg = Math.round(textPxFinal * 0.22);

      const t_frameStart = pad;
      const t_frameEnd = t_frameStart + frame;

      const t_titleWrapStart = t_frameEnd;
      const t_titleWrapEnd = t_titleWrapStart + wrap;

      const t_titleStart = t_titleWrapEnd;
      const t_titleEnd = t_titleStart + titleSeg;

      const t_bodyWrapStart = t_titleEnd;
      const t_bodyWrapEnd = t_bodyWrapStart + wrap;

      const bodySeg = Math.max(1, textPxFinal - t_bodyWrapEnd);
      const t_bodyStart = t_bodyWrapEnd;

      const staggerEachFit = (segmentDur, n) => {
        if (n <= 1) return 0;
        const perCharDur = 1;
        return Math.max(0, (segmentDur - perCharDur) / (n - 1));
      };

      tl.to(
        [kickerEl, underlineEl],
        { autoAlpha: 1, y: 0, duration: frame },
        t_frameStart
      );
      tl.to(
        titleWrap,
        { autoAlpha: 1, y: 0, duration: wrap },
        t_titleWrapStart
      );

      tl.to(
        titleEls,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: {
            each: staggerEachFit(titleSeg, titleEls.length),
            from: "start",
          },
        },
        t_titleStart
      );

      tl.to(bodyWrap, { autoAlpha: 1, y: 0, duration: wrap }, t_bodyWrapStart);

      tl.to(
        bodyEls,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: {
            each: staggerEachFit(bodySeg, bodyEls.length),
            from: "start",
          },
        },
        t_bodyStart
      );

      tl.set(
        [kickerEl, underlineEl, titleWrap, bodyWrap],
        { autoAlpha: 1, y: 0 },
        textPxFinal
      );
      tl.set(titleEls, { autoAlpha: 1, y: 0 }, textPxFinal);
      tl.set(bodyEls, { autoAlpha: 1, y: 0 }, textPxFinal);
    }, root);

    return () => ctx.revert();
  }, [id, textPx, titleTokens.length, bodyTokens.length]);

  return (
    <section className="humSection" id={id} ref={rootRef}>
      <div className="humInner">
        <div className="humKicker" data-hkicker>
          {kicker}
        </div>

        <h2 className="humTitle" data-htitlewrap aria-label={title}>
          {titleTokens.map((tok, idx) => {
            if (tok === "\n") return <br key={`htbr-${idx}`} />;
            if (/^[ \t]+$/.test(tok)) return <span key={`htsp-${idx}`}> </span>;
            return <Word key={`htw-${idx}`} token={tok} type="t" />;
          })}
        </h2>

        <div className="humUnderline" data-hunderline aria-hidden="true" />

        <div className="humBody" data-hbodywrap aria-label={bodyText}>
          {bodyTokens.map((tok, idx) => {
            if (tok === "\n") return <br key={`hbbr-${idx}`} />;
            if (/^[ \t]+$/.test(tok)) return <span key={`hbsp-${idx}`}> </span>;
            return <Word key={`hbw-${idx}`} token={tok} type="b" />;
          })}
        </div>
      </div>
    </section>
  );
}
