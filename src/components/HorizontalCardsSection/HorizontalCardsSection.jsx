import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADER_H = 64;          // topbar
const INTRO_SCROLL = 520;     // quanto dura la “lettura” verticale

export default function HorizontalCardsSection({
  id,
  kicker,
  title,
  introParagraphs = [],
  cards = [],
}) {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const introWords = Array.from(introRef.current?.querySelectorAll(".w") || []);

      // reset
      gsap.set(introWords, { color: "var(--muted)" });
      gsap.set(track, { x: 0 });

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const totalScroll = () => INTRO_SCROLL + getDistance() + 1;

      const st = ScrollTrigger.create({
        trigger: section,
        start: () => `top top+=${HEADER_H}`,   // evita che il pin finisca sotto la topbar
        end: () => `+=${totalScroll()}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // progress in px, così separiamo bene fase 1/2
          const progressPx = self.progress * totalScroll();

          // FASE 1: reading
          const readingT = Math.min(1, progressPx / INTRO_SCROLL);
          const total = introWords.length || 1;
          const idx = Math.floor(readingT * total);

          for (let i = 0; i < total; i++) {
            introWords[i].style.color = i <= idx ? "var(--ink)" : "var(--muted)";
          }

          // FASE 2: orizzontale
          const afterIntroPx = Math.max(0, progressPx - INTRO_SCROLL);
          const dist = getDistance();
          const x = dist === 0 ? 0 : -(afterIntroPx / dist) * dist; // lineare
          gsap.set(track, { x: x });
        },
      });

      return () => st.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section combo" id={id} ref={sectionRef}>
      <div className="container combo__inner">
        <div className="kicker">{kicker}</div>
        <h2 className="combo__title">{title}</h2>

        <div className="combo__intro" ref={introRef}>
          {introParagraphs.map((p, pi) => (
            <p className="combo__p" key={pi}>
              {p.split(" ").map((w, i) => (
                <span key={`${pi}-${i}`} className="w">{w}{" "}</span>
              ))}
            </p>
          ))}
          <div className="combo__hint">Poi lo scroll passa in orizzontale →</div>
        </div>
      </div>

      <div className="hwrap" aria-label="Sezione orizzontale">
        <div className="track" ref={trackRef}>
          {cards.map((c, idx) => (
            <article className="card" key={idx}>
              <div className="card__top">
                <div className="card__icon" aria-hidden="true">
                  <span className="dot" />
                </div>
                <div className="card__eyebrow">{c.eyebrow}</div>
              </div>

              <h3 className="card__title">{c.title}</h3>
              <p className="card__text">{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
