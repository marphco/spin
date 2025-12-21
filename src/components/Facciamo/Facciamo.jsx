import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Facciamo.css";

gsap.registerPlugin(ScrollTrigger);

function splitChars(str) {
  return Array.from(str).map((ch, i) => ({
    ch,
    key: `${i}-${ch === " " ? "space" : ch}`,
  }));
}

export default function Facciamo({
  id = "facciamo",
  kicker = "Facciamo",
  title = "FACCIAMO",
  paragraphs = [],
  // px dedicati SOLO alla fase testo
  textPx = 900,
}) {
  const rootRef = useRef(null);

  const bodyText = useMemo(() => paragraphs.join("\n\n"), [paragraphs]);
  const titleChars = useMemo(() => splitChars(title), [title]);
  const bodyChars = useMemo(() => splitChars(bodyText), [bodyText]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.getById(`facciamo-${id}`)?.kill(true);

      const track = root.querySelector(".facTrack");
      const panels = gsap.utils.toArray(root.querySelectorAll(".facPanel"));

      // panel 0 = intro testo, il resto sono pannelli orizzontali
      // larghezza track = N * 100vw
      gsap.set(track, { width: `${panels.length * 100}vw` });

      const kickerEl = root.querySelector("[data-fkicker]");
      const underlineEl = root.querySelector("[data-funderline]");
      const titleWrap = root.querySelector("[data-ftitlewrap]");
      const bodyWrap = root.querySelector("[data-fbodywrap]");

      const titleEls = root.querySelectorAll("[data-ftch]");
      const bodyEls = root.querySelectorAll("[data-fbch]");

      // ✅ Stato iniziale anti-flash
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], {
        opacity: 0,
        y: 10,
      });
      gsap.set(titleEls, { opacity: 0, y: 10 });
      gsap.set(bodyEls, { opacity: 0, y: 6 });

      // distanza orizzontale = (N-1) * vw (perché il primo pannello è l'intro)
      const horizontalPx = window.innerWidth * (panels.length - 1);
      const totalPx = textPx + horizontalPx;

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
      // FASE A: TESTO (0 -> textPx)
      // -------------------------
      // 1) cornice
      tl.to(
        [kickerEl, underlineEl],
        { opacity: 1, y: 0, ease: "none", duration: 0.12 },
        0.02
      );

      // 2) wrapper titolo + chars
      tl.to(titleWrap, { opacity: 1, y: 0, ease: "none", duration: 0.06 }, 0.06);

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

      // 3) body wrapper + chars
      tl.to(bodyWrap, { opacity: 1, y: 0, ease: "none", duration: 0.06 }, 0.22);

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

      // ---------------------------------
      // FASE B: ORIZZONTALE (dopo testo)
      // ---------------------------------
      // Mettiamo l'orizzontale quando la fase testo è finita.
      // Con scrub è stabile: appena superi textPx parte il movimento.
      tl.to(
        panels,
        {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          duration: 1, // questa "1" viene scalata sul tratto scroll dedicato
        },
        1 // inizio della fase orizzontale dopo che la fase testo è "completa"
      );
    }, root);

    return () => ctx.revert();
  }, [id, textPx, titleChars.length, bodyChars.length]);

  return (
    <section className="facSection" id={id} ref={rootRef}>
      <div className="facViewport">
        <div className="facTrack">
          {/* PANEL 0 — INTRO (come Siamo) */}
          <div className="facPanel facIntro">
            <div className="facInner">
              <div className="facKicker" data-fkicker>
                {kicker}
              </div>

              <h2 className="facTitle" data-ftitlewrap aria-label={title}>
                {titleChars.map(({ ch, key }) => (
                  <span
                    key={key}
                    data-ftch
                    className={`facCh ${ch === " " ? "isSpace" : ""}`}
                    aria-hidden="true"
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </span>
                ))}
              </h2>

              <div className="facUnderline" data-funderline aria-hidden="true" />

              <div className="facBody" data-fbodywrap aria-label={bodyText}>
                {bodyChars.map(({ ch, key }, idx) => {
                  if (ch === "\n") return <br key={`br-${key}-${idx}`} />;
                  return (
                    <span
                      key={key}
                      data-fbch
                      className={`facCh ${ch === " " ? "isSpace" : ""}`}
                      aria-hidden="true"
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  );
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
