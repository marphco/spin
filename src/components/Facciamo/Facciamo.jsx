import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Facciamo.css";

import FacciamoServizi from "./FacciamoServizi";
import facciamoImg from "../../assets/facciamo.png";

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
        <span
          key={`${type}-${token}-${i}`}
          {...{ [dataAttr]: true }}
          className="facCh"
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Facciamo({
  id = "facciamo",
  kicker = "Facciamo",
  title = "Metodo, strategia, impatto.",
  titleAria = "FACCIAMO",
  paragraphs = [],
  textPx,
  imageSrc = facciamoImg,
  imageAlt = "Dettaglio scacchiera - strategia e metodo",
}) {
  const rootRef = useRef(null);
  const imgWrapRef = useRef(null);
  const imgRef = useRef(null);

  const bodyText = useMemo(() => paragraphs.join("\n\n"), [paragraphs]);
  const titleTokens = useMemo(() => tokenize(title), [title]);
  const bodyTokens = useMemo(() => tokenize(bodyText), [bodyText]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const imgWrap = imgWrapRef.current;
    const img = imgRef.current;
    if (!root || !imgWrap || !img) return;

    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.getById(`facciamo-${id}`)?.kill(true);

      const track = root.querySelector("[data-ftrack]");

      // Intro refs
      const kickerEl = root.querySelector("[data-fkicker]");
      const underlineEl = root.querySelector("[data-funderline]");
      const titleWrap = root.querySelector("[data-ftitlewrap]");
      const bodyWrap = root.querySelector("[data-fbodywrap]");

      const titleEls = Array.from(root.querySelectorAll("[data-ftch]"));
      const bodyEls = Array.from(root.querySelectorAll("[data-fbch]"));

      const titleTargets = isMobile ? [titleWrap] : titleEls;
      const bodyTargets = isMobile ? [bodyWrap] : bodyEls;

      // Services refs
      const servicesPanel = root.querySelector("[data-fservicespanel]");
      const servicesWrap = root.querySelector("[data-serviceswrap]");
      const servicesTrack = root.querySelector("[data-fservicestrack]");

      const svcPage1 = gsap.utils.toArray(
        root.querySelectorAll('[data-fsvcpage="1"] [data-service]'),
      );
      const svcPage2 = gsap.utils.toArray(
        root.querySelectorAll('[data-fsvcpage="2"] [data-service]'),
      );

      // -------------------------
      // INIT STATES (intro)
      // -------------------------
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], {
        autoAlpha: 0,
        y: 10,
      });
      gsap.set(titleTargets, { autoAlpha: 0, y: 10 });
      gsap.set(bodyTargets, { autoAlpha: 0, y: 6 });

      // ✅ immagine: stessa grammatica di Siamo
      gsap.set(imgWrap, { autoAlpha: 0, y: 14, rotate: -0.4, scale: 0.98 });
      gsap.set(img, { scale: 1.04 });

      gsap.set(track, { x: 0 });

      // -------------------------
      // INIT STATES (services)
      // -------------------------
      gsap.set(servicesPanel, { autoAlpha: 1 });
      gsap.set(servicesWrap, { autoAlpha: 0 });
      gsap.set(servicesTrack, { x: 0 });
      gsap.set([...svcPage1, ...svcPage2], { autoAlpha: 0, y: 18 });

      // -------------------------
      // DURATIONS (same logic)
      // -------------------------
      const charsCount = titleEls.length + bodyEls.length;
      const vw = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
      );
      const mobileBoost = vw < 640 ? 1.35 : vw < 900 ? 1.18 : 1;

      const textPxAuto = Math.round(
        Math.max(1000, Math.min(3200, charsCount * 3.8)) * mobileBoost,
      );
      const textPxFinal = typeof textPx === "number" ? textPx : textPxAuto;

      const horizPx = Math.round(Math.max(520, window.innerWidth * 0.75));
      const svcReveal1Px = Math.round(Math.max(680, window.innerHeight * 0.95));
      const svcSlidePx = Math.round(Math.max(520, window.innerWidth * 0.85));
      const svcReveal2Px = Math.round(Math.max(620, window.innerHeight * 0.9));

      const totalPx =
        textPxFinal + horizPx + svcReveal1Px + svcSlidePx + svcReveal2Px;

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      ScrollTrigger.create({
        id: `facciamo-${id}`,
        trigger: root,
        start: "top top",
        end: () => `+=${totalPx}`,
        scrub: isMobile ? 0.6 : true,
        pin: true,
        pinSpacing: true,
        anticipatePin: isMobile ? 2 : 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      // -------------------------
      // A) TEXT SEGMENTS
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
        const perCharDur = 1;
        return Math.max(0, (segmentDur - perCharDur) / (n - 1));
      };

      // kicker + underline
      tl.to(
        [kickerEl, underlineEl],
        { autoAlpha: 1, y: 0, duration: frame },
        t_frameStart,
      );

      // title wrapper
      tl.to(
        titleWrap,
        { autoAlpha: 1, y: 0, duration: wrap },
        t_titleWrapStart,
      );

      // ✅ IMMAGINE: entra PRIMA e in sync (come Siamo)
      // - entra tra titleWrap e titleTargets, non dopo
      if (!prefersReduced) {
        const imgDur = Math.max(120, Math.round(titleSeg * 0.55));
        const imgAt = Math.max(
          t_titleWrapStart + Math.round(wrap * 0.55),
          t_titleStart - Math.round(titleSeg * 0.25),
        );

        tl.to(
          imgWrap,
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: imgDur,
          },
          imgAt,
        );
        tl.to(img, { scale: 1, duration: Math.round(imgDur * 0.9) }, imgAt + 10);
      } else {
        tl.to(imgWrap, { autoAlpha: 1, y: 0, duration: 1 }, t_titleWrapStart);
        tl.to(img, { scale: 1, duration: 1 }, t_titleWrapStart);
      }

      // title chars / block
      tl.to(
        titleTargets,
        isMobile
          ? { autoAlpha: 1, y: 0, duration: titleSeg }
          : {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              stagger: {
                each: staggerEachFit(titleSeg, titleEls.length),
                from: "start",
              },
            },
        t_titleStart,
      );

      // body wrapper
      tl.to(
        bodyWrap,
        { autoAlpha: 1, y: 0, duration: wrap },
        t_bodyWrapStart,
      );

      // body chars / block
      tl.to(
        bodyTargets,
        isMobile
          ? { autoAlpha: 1, y: 0, duration: bodySeg }
          : {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              stagger: {
                each: staggerEachFit(bodySeg, bodyEls.length),
                from: "start",
              },
            },
        t_bodyStart,
      );

      // -------------------------
      // B) HORIZONTAL SLIDE intro -> services
      // -------------------------
      const hStart = textPxFinal + 1;
      tl.to(track, { x: () => -window.innerWidth, duration: horizPx }, hStart);

      // -------------------------
      // C) SERVICES reveal + slide + reveal
      // -------------------------
      const sStart = hStart + horizPx + 1;

      tl.to(servicesWrap, { autoAlpha: 1, duration: 120 }, sStart);

      const step1 = Math.round(svcReveal1Px / (svcPage1.length + 1));
      svcPage1.forEach((el, i) => {
        tl.to(
          el,
          { autoAlpha: 1, y: 0, duration: Math.round(step1 * 0.7) },
          sStart + 80 + step1 * i,
        );
      });

      const slideStart = sStart + svcReveal1Px + 40;
      tl.to(
        servicesTrack,
        { x: () => -window.innerWidth, duration: svcSlidePx },
        slideStart,
      );

      const r2Start = slideStart + svcSlidePx + 40;
      const step2 = Math.round(svcReveal2Px / (svcPage2.length + 1));
      svcPage2.forEach((el, i) => {
        tl.to(
          el,
          { autoAlpha: 1, y: 0, duration: Math.round(step2 * 0.75) },
          r2Start + step2 * i,
        );
      });
    }, root);

    return () => ctx.revert();
  }, [id, textPx, titleTokens.length, bodyTokens.length]);

  return (
    <section className="facSection" id={id} ref={rootRef}>
      <div id="facciamo__nav" className="navAnchor" aria-hidden="true" />

      <div className="facViewport">
        <div className="facTrack" data-ftrack>
          {/* PANEL 1: INTRO */}
          <div className="facPanel" data-fpanel="intro">
            <div className="facIntroLayer" data-fintro>
              <div className="facInner">
                {/* MEDIA */}
                <div className="facMedia" ref={imgWrapRef} aria-hidden="true">
                  <div className="facPhotoFrame">
                    <img
                      ref={imgRef}
                      className="facPhoto"
                      src={imageSrc}
                      alt={imageAlt}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* COPY */}
                <div className="facCopy">
                  <div className="facKicker" data-fkicker>
                    {kicker}
                  </div>

                  <h2 className="facTitle" data-ftitlewrap aria-label={titleAria}>
                    {titleTokens.map((tok, idx) => {
                      if (tok === "\n") return <br key={`ftbr-${idx}`} />;
                      if (/^[ \t]+$/.test(tok))
                        return <span key={`ftsp-${idx}`}> </span>;
                      return <Word key={`ftw-${idx}`} token={tok} type="t" />;
                    })}
                  </h2>

                  <div className="facUnderline" data-funderline aria-hidden="true" />

                  <div className="facBody" data-fbodywrap aria-label={bodyText}>
                    {bodyTokens.map((tok, idx) => {
                      if (tok === "\n") return <br key={`fbbr-${idx}`} />;
                      if (/^[ \t]+$/.test(tok))
                        return <span key={`fbsp-${idx}`}> </span>;
                      return <Word key={`fbw-${idx}`} token={tok} type="b" />;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 2: SERVICES */}
          <div className="facPanel" data-fpanel="services">
            <div className="facServicesLayer" data-fservicespanel>
              <FacciamoServizi />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
