import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({
  id = "top",
  src,
  alt = "",
  title = "comunicare è un gioco di parole",
  durationPx = 900,
}) {
  const shellRef = useRef(null);
  const imgRef = useRef(null);
  const titleRef = useRef(null);
  const grainRef = useRef(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const img = imgRef.current;
    const titleEl = titleRef.current;
    const grain = grainRef.current;
    if (!shell || !img || !titleEl || !grain) return;

    const isMobile = window.matchMedia("(max-width: 720px)").matches;

    const ctx = gsap.context(() => {
      // kill SOLO il nostro trigger se esiste già
      ScrollTrigger.getById("heroFX")?.kill(true);

      // stato iniziale (sempre uguale)
      gsap.set(shell, { backgroundColor: "#000" });
      gsap.set(img, {
        opacity: 1,
        filter: "blur(0px) brightness(1) contrast(1)",
        scale: 1,
        willChange: "transform,opacity,filter",
      });
      gsap.set(titleEl, { opacity: 1, y: 0, willChange: "transform,opacity" });
      gsap.set(grain, {
        opacity: 0,
        transformOrigin: "50% 50%",
        scale: 1,
        willChange: "opacity,transform",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "heroFX",
          trigger: shell,
          start: "top top",
          end: `+=${durationPx}`,
          scrub: isMobile ? 0.6 : true,
          pin: true,
          pinSpacing: false,
          anticipatePin: isMobile ? 2 : 1,
          invalidateOnRefresh: true,
        },

      });

      // Titolo: micro move + fade
      tl.to(titleEl, { y: -10, ease: "none" }, 0);
      tl.to(titleEl, { opacity: 0, ease: "none" }, 0.08);

      // Grain
      tl.to(grain, { opacity: 0.22, ease: "none" }, 0.12);
      tl.to(grain, { scale: 1.03, ease: "none" }, 0.12);

      // Immagine: blur + zoom + darken
      tl.to(
        img,
        {
          filter: `blur(${isMobile ? 6 : 10}px) brightness(0.85) contrast(1.05)`,
          scale: 1.04,
          ease: "none",
        },
        0.12
      );

      // chiusura a nero
      tl.to(img, { opacity: 0, ease: "none" }, 0.99);
      tl.to(grain, { opacity: 0, ease: "none" }, 0.99);
    }, shell);

    return () => ctx.revert();
  }, [durationPx]);

  return (
    <section className="heroDis" id={id} ref={shellRef}>
      <img className="heroUnderImg" ref={imgRef} src={src} alt={alt} />
      <div className="heroGrain" ref={grainRef} aria-hidden="true" />
      <div className="heroOverlay">
        <h1 className="heroTitle" ref={titleRef}>
          {title}
        </h1>
      </div>
    </section>
  );
}
