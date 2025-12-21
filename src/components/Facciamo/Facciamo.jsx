import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Facciamo.css";

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
  title = "FACCIAMO",
  paragraphs = [],
  /**
   * Se passi textPx lo rispettiamo.
   * Se non lo passi (o passi null/undefined), facciamo auto.
   */
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

      const track = root.querySelector(".facTrack");
      const panels = gsap.utils.toArray(root.querySelectorAll(".facPanel"));
      gsap.set(track, { width: `${panels.length * 100}vw` });

      const kickerEl = root.querySelector("[data-fkicker]");
      const underlineEl = root.querySelector("[data-funderline]");
      const titleWrap = root.querySelector("[data-ftitlewrap]");
      const bodyWrap = root.querySelector("[data-fbodywrap]");

      const titleEls = root.querySelectorAll("[data-ftch]");
      const bodyEls = root.querySelectorAll("[data-fbch]");

      // anti-flash (JS authoritative)
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], { opacity: 0, y: 10 });
      gsap.set(titleEls, { opacity: 0, y: 10 });
      gsap.set(bodyEls, { opacity: 0, y: 6 });

      // ✅ AUTO textPx se non fornito:
      //  - numero caratteri reali (span animati)
      //  - mobile -> un po’ più px perché le righe aumentano
      const charsCount = titleEls.length + bodyEls.length;
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const mobileBoost = vw < 640 ? 1.35 : vw < 900 ? 1.18 : 1;

      const textPxAuto = Math.round(
        Math.max(1000, Math.min(3200, charsCount * 3.8)) * mobileBoost
      );

      const textPxFinal = typeof textPx === "number" ? textPx : textPxAuto;

      const horizontalPx = window.innerWidth * (panels.length - 1);
      const totalPx = textPxFinal + horizontalPx;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: `facciamo-${id}`,
          trigger: root,
          start: "top top",
          end: () => `+=${totalPx}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // -------------------------
      // FASE A: TESTO (0 -> textPxFinal)
      // -------------------------
      const pad = 24;
      const frame = Math.round(textPxFinal * 0.12);
      const wrap = Math.round(textPxFinal * 0.06);
      const titleDur = Math.round(textPxFinal * 0.22);
      const bodyDur = Math.max(1, textPxFinal - (pad + frame + wrap + titleDur + wrap + 10));

      tl.to([kickerEl, underlineEl], { opacity: 1, y: 0, ease: "none", duration: frame }, pad);

      tl.to(titleWrap, { opacity: 1, y: 0, ease: "none", duration: wrap }, pad + frame);

      tl.to(
        titleEls,
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: titleDur,
          stagger: { amount: titleDur * 0.9, from: "start" },
        },
        pad + frame + wrap
      );

      const bodyStart = pad + frame + wrap + titleDur;

      tl.to(bodyWrap, { opacity: 1, y: 0, ease: "none", duration: wrap }, bodyStart);

      tl.to(
        bodyEls,
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: bodyDur,
          stagger: { amount: bodyDur * 0.95, from: "start" },
        },
        bodyStart + wrap
      );

      // ✅ GUARANTEED: al confine testo -> tutto visibile
      tl.set([kickerEl, underlineEl, titleWrap, bodyWrap], { opacity: 1, y: 0 }, textPxFinal - 1);
      tl.set(titleEls, { opacity: 1, y: 0 }, textPxFinal - 1);
      tl.set(bodyEls, { opacity: 1, y: 0 }, textPxFinal - 1);

      // ---------------------------------
      // FASE B: ORIZZONTALE (textPxFinal -> totalPx)
      // ---------------------------------
      tl.to(
        panels,
        {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          duration: horizontalPx,
        },
        textPxFinal
      );
    }, root);

    return () => ctx.revert();
  }, [id, textPx, titleTokens.length, bodyTokens.length]);

  return (
    <section className="facSection" id={id} ref={rootRef}>
      <div className="facViewport">
        <div className="facTrack">
          {/* PANEL 0 — INTRO */}
          <div className="facPanel facIntro">
            <div className="facInner">
              <div className="facKicker" data-fkicker>
                {kicker}
              </div>

              <h2 className="facTitle" data-ftitlewrap aria-label={title}>
                {titleTokens.map((tok, idx) => {
                  if (tok === "\n") return <br key={`ftbr-${idx}`} />;
                  if (/^[ \t]+$/.test(tok)) return <span key={`ftsp-${idx}`}>{" "}</span>;
                  return <Word key={`ftw-${idx}`} token={tok} type="t" />;
                })}
              </h2>

              <div className="facUnderline" data-funderline aria-hidden="true" />

              <div className="facBody" data-fbodywrap aria-label={bodyText}>
                {bodyTokens.map((tok, idx) => {
                  if (tok === "\n") return <br key={`fbbr-${idx}`} />;
                  if (/^[ \t]+$/.test(tok)) return <span key={`fbsp-${idx}`}>{" "}</span>;
                  return <Word key={`fbw-${idx}`} token={tok} type="b" />;
                })}
              </div>
            </div>
          </div>

          {/* PANEL 1 */}
          <div className="facPanel facCard c1">
            <div className="facCardInner">
              <div className="facEyebrow">01</div>
              <div className="facCardTitle">Analisi scenario</div>
              <div className="facCardText">
                Mappatura attenta e targetizzata delle discussioni online, comprensiva di sentiment
                analysis e analisi semantica.
              </div>
            </div>
          </div>

          {/* PANEL 2 */}
          <div className="facPanel facCard c2">
            <div className="facCardInner">
              <div className="facEyebrow">02</div>
              <div className="facCardTitle">Posizionamento strategico</div>
              <div className="facCardText">
                Analisi di contesto e definizione della strategia più adatta per raggiungere gli
                obiettivi condivisi.
              </div>
            </div>
          </div>

          {/* PANEL 3 */}
          <div className="facPanel facCard c3">
            <div className="facCardInner">
              <div className="facEyebrow">03</div>
              <div className="facCardTitle">Piani comunicazione integrata</div>
              <div className="facCardText">
                Piani digitali integrati, relazioni media, creatività e declinazioni coerenti con il
                posizionamento.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
