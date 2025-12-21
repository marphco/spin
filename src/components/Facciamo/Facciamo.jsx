import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Facciamo.css";

import FacciamoServizi from "./FacciamoServizi";

gsap.registerPlugin(ScrollTrigger);

function tokenize(str) {
  return str.split(/(\n|[ \t]+)/g).filter((t) => t !== "");
}

function Word({ token, type }) {
  const chars = Array.from(token);
  const dataAttr = type === "t" ? "data-ftch" : "data-fbch";

  return (
    <span className="facWord" aria-hidden="true">
      {chars.map((ch, i) => (
        <span key={`${type}-${token}-${i}`} {...{ [dataAttr]: true }} className="facCh">
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Facciamo({
  id = "facciamo",
  kicker = "Facciamo",
  // ✅ titolo diverso per evitare “FACCIAMO” doppio (poi lo cambi come vuoi)
  title = "Metodo, strategia, impatto.",
  // il label per screen reader resta “FACCIAMO”
  titleAria = "FACCIAMO",
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
      ScrollTrigger.getById(`facciamo-${id}`)?.kill(true);

      // ---- Intro refs
      const intro = root.querySelector("[data-fintro]");
      const kickerEl = root.querySelector("[data-fkicker]");
      const underlineEl = root.querySelector("[data-funderline]");
      const titleWrap = root.querySelector("[data-ftitlewrap]");
      const bodyWrap = root.querySelector("[data-fbodywrap]");

      const titleEls = Array.from(root.querySelectorAll("[data-ftch]"));
      const bodyEls = Array.from(root.querySelectorAll("[data-fbch]"));

      // ---- Services refs
      const servicesPanel = root.querySelector("[data-fservicespanel]");
      const servicesWrap = root.querySelector("[data-serviceswrap]");
      const serviceItems = gsap.utils.toArray(root.querySelectorAll("[data-service]"));

      // ✅ Stato iniziale (JS authoritative)
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], { autoAlpha: 0, y: 10 });
      gsap.set(titleEls, { autoAlpha: 0, y: 10 });
      gsap.set(bodyEls, { autoAlpha: 0, y: 6 });

      gsap.set(servicesPanel, { autoAlpha: 0 });
      gsap.set(servicesWrap, { autoAlpha: 0 });
      gsap.set(serviceItems, { autoAlpha: 0, y: 18 });

      // ✅ AUTO textPx
      const charsCount = titleEls.length + bodyEls.length;
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const mobileBoost = vw < 640 ? 1.35 : vw < 900 ? 1.18 : 1;

      const textPxAuto = Math.round(Math.max(1000, Math.min(3200, charsCount * 3.8)) * mobileBoost);
      const textPxFinal = typeof textPx === "number" ? textPx : textPxAuto;

      // ✅ px dedicati ai servizi (mobile friendly)
      const servicesPx = Math.round(Math.max(1100, window.innerHeight * 1.8));
      const totalPx = textPxFinal + servicesPx;

      // timeline “px-time”
      const tl = gsap.timeline({ defaults: { ease: "none" } });

      ScrollTrigger.create({
        id: `facciamo-${id}`,
        trigger: root,
        start: "top top",
        end: () => `+=${totalPx}`,
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      // -------------------------
      // FASE A: TESTO (0 -> textPxFinal)
      // -------------------------
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
        const perCharDur = 1; // 1px
        return Math.max(0, (segmentDur - perCharDur) / (n - 1));
      };

      tl.to([kickerEl, underlineEl], { autoAlpha: 1, y: 0, duration: frame }, t_frameStart);
      tl.to(titleWrap, { autoAlpha: 1, y: 0, duration: wrap }, t_titleWrapStart);

      tl.to(
        titleEls,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: { each: staggerEachFit(titleSeg, titleEls.length), from: "start" },
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
          stagger: { each: staggerEachFit(bodySeg, bodyEls.length), from: "start" },
        },
        t_bodyStart
      );

      // lock testo
      tl.set([kickerEl, underlineEl, titleWrap, bodyWrap], { autoAlpha: 1, y: 0 }, textPxFinal);
      tl.set(titleEls, { autoAlpha: 1, y: 0 }, textPxFinal);
      tl.set(bodyEls, { autoAlpha: 1, y: 0 }, textPxFinal);

      // -------------------------
      // FASE B: SERVIZI (textPxFinal -> totalPx)
      // -------------------------
      const sStart = textPxFinal + 1;

      // transizione: intro esce, servizi entrano (stesso sfondo)
      tl.to(intro, { autoAlpha: 0, y: -12, duration: 160 }, sStart);
      tl.to(servicesPanel, { autoAlpha: 1, duration: 160 }, sStart);
      tl.to(servicesWrap, { autoAlpha: 1, duration: 140 }, sStart + 80);

      // reveal sequenziale (3 blocchi) - centrati
      const step = Math.round(servicesPx / (serviceItems.length + 1));
      serviceItems.forEach((el, i) => {
        tl.to(
          el,
          { autoAlpha: 1, y: 0, duration: Math.round(step * 0.7) },
          sStart + 140 + step * i
        );
      });
    }, root);

    return () => ctx.revert();
  }, [id, textPx, titleTokens.length, bodyTokens.length]);

  return (
    <section className="facSection" id={id} ref={rootRef}>
      <div className="facViewport">
        {/* INTRO */}
        <div className="facIntroLayer" data-fintro>
          <div className="facInner">
            <div className="facKicker" data-fkicker>
              {kicker}
            </div>

            <h2 className="facTitle" data-ftitlewrap aria-label={titleAria}>
              {titleTokens.map((tok, idx) => {
                if (tok === "\n") return <br key={`ftbr-${idx}`} />;
                if (/^[ \t]+$/.test(tok)) return <span key={`ftsp-${idx}`}> </span>;
                return <Word key={`ftw-${idx}`} token={tok} type="t" />;
              })}
            </h2>

            <div className="facUnderline" data-funderline aria-hidden="true" />

            <div className="facBody" data-fbodywrap aria-label={bodyText}>
              {bodyTokens.map((tok, idx) => {
                if (tok === "\n") return <br key={`fbbr-${idx}`} />;
                if (/^[ \t]+$/.test(tok)) return <span key={`fbsp-${idx}`}> </span>;
                return <Word key={`fbw-${idx}`} token={tok} type="b" />;
              })}
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <div className="facServicesLayer" data-fservicespanel aria-hidden="true">
          <FacciamoServizi />
        </div>
      </div>
    </section>
  );
}
