import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PinReadSection({ id, kicker, title, paragraphs }) {
  const sectionRef = useRef(null);
  const bodyRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const words = Array.from(bodyRef.current?.querySelectorAll(".w") || []);
      gsap.set(words, { color: "var(--muted)" });

      const total = words.length || 1;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(900, total * 18)}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.floor(self.progress * total);
          for (let i = 0; i < total; i++) {
            words[i].style.color = i <= idx ? "var(--ink)" : "var(--muted)";
          }
        },
      });

      const titleEl = section.querySelector(".read__title");
      gsap.fromTo(
        titleEl,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "top+=200 top",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section read" id={id} ref={sectionRef}>
      <div className="container read__inner">
        <div className="kicker">{kicker}</div>
        <h2 className="read__title">{title}</h2>

        <div className="read__body" ref={bodyRef}>
          {paragraphs.map((p, pi) => (
            <p className="read__p" key={pi}>
              {p.split(" ").map((w, i) => (
                <span key={`${pi}-${i}`} className="w">
                  {w}{" "}
                </span>
              ))}
            </p>
          ))}
        </div>

        <div className="read__note">Scorri per “attivare” il testo</div>
      </div>
    </section>
  );
}
