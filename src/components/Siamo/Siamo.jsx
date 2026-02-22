import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Siamo.css";

// ✅ metti il file in /src/assets/ e rinomina come preferisci
import founderImg from "../../assets/tiberio.png";

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

export default function Siamo({
  id = "siamo",
  kicker = "Siamo",
  title,
  paragraphs = [],
  durationPx = 900,
  imageSrc = founderImg,
  imageAlt = "Fondatore Spin Factor",
}) {
  const rootRef = useRef(null);
  const tiltRef = useRef(null);
  const imgWrapRef = useRef(null);
  const imgRef = useRef(null);

  // ✅ disponibili nel render
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  const reduceChars = isMobile;

  const bodyText = useMemo(() => paragraphs.join("\n\n"), [paragraphs]);
  const titleTokens = useMemo(() => tokenize(title || ""), [title]);
  const bodyTokens = useMemo(() => tokenize(bodyText), [bodyText]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const imgWrap = imgWrapRef.current;
    const img = imgRef.current;
    const tiltEl = tiltRef.current;
    if (!tiltEl) return;

    if (!root || !imgWrap || !img) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouch = window.matchMedia("(hover: none)").matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.getById(`siamo-img-reveal-${id}`)?.kill(true);

      const kickerEl = root.querySelector("[data-kicker]");
      const underlineEl = root.querySelector("[data-underline]");
      const titleWrap = root.querySelector("[data-titlewrap]");
      const bodyWrap = root.querySelector("[data-bodywrap]");

      const titleEls = root.querySelectorAll("[data-tch]");
      const bodyEls = root.querySelectorAll("[data-bch]");

      const titleTargets = reduceChars ? [titleWrap] : titleEls;
      const bodyTargets = reduceChars ? [bodyWrap] : bodyEls;

      // testo statico: tutto visibile subito
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], {
        autoAlpha: 1,
        y: 0,
      });
      gsap.set(titleTargets, { autoAlpha: 1, y: 0 });
      gsap.set(bodyTargets, { autoAlpha: 1, y: 0 });

      // ✅ stato iniziale immagine (reveal in sync)
      gsap.set(imgWrap, { autoAlpha: 0, y: 14, rotate: -0.4, scale: 0.98 });
      gsap.set(img, { scale: 1.04 });

      // reveal: l'immagine arriva a opacità 1 quando la sezione occupa tutta la viewport
      gsap.timeline({
        scrollTrigger: {
          id: `siamo-img-reveal-${id}`,
          trigger: root,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
        .to(
          imgWrap,
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            scale: 1,
            ease: "none",
          },
          0,
        )
        .to(img, { scale: 1, ease: "none" }, 0);

      // testo già visibile: nessun reveal legato allo scroll

      // -------------------------
      // ✅ FLOATING LOOP premium (anche mobile)
      // -------------------------
      if (!prefersReduced) {
        gsap.to(imgWrap, {
          y: "-=7",
          duration: 1.8, // ✅ un po’ più percepibile ma sempre slow
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // gsap.to(imgWrap, {
        //   rotate: 0.6,
        //   duration: 1.6, // ✅ coerente col movimento verticale
        //   ease: "sine.inOut",
        //   yoyo: true,
        //   repeat: -1,
        // });
      }

      // -------------------------
      // ✅ HOVER TILT (solo desktop con hover)
      // -------------------------
      if (!prefersReduced && !isTouch) {
        const setRX = gsap.quickTo(tiltEl, "rotationX", {
          duration: 0.45,
          ease: "power3.out",
        });
        const setRY = gsap.quickTo(tiltEl, "rotationY", {
          duration: 0.45,
          ease: "power3.out",
        });
        const setSX = gsap.quickTo(tiltEl, "x", {
          duration: 0.45,
          ease: "power3.out",
        });
        const setSY = gsap.quickTo(tiltEl, "y", {
          duration: 0.45,
          ease: "power3.out",
        });

        const onMove = (e) => {
          const r = imgWrap.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;

          setRX((0.5 - py) * 8);
          setRY((px - 0.5) * 10);
          setSX((px - 0.5) * 10);
          setSY((py - 0.5) * 6);
        };

        const onEnter = () => {
          gsap.to(imgWrap, { scale: 1.02, duration: 0.35, ease: "power3.out" });
        };

        const onLeave = () => {
          gsap.to(tiltEl, {
            rotationX: 0,
            rotationY: 0,
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          });
          gsap.to(imgWrap, { scale: 1, duration: 0.6, ease: "power3.out" });
        };

        imgWrap.addEventListener("mousemove", onMove);
        imgWrap.addEventListener("mouseenter", onEnter);
        imgWrap.addEventListener("mouseleave", onLeave);

        return () => {
          imgWrap.removeEventListener("mousemove", onMove);
          imgWrap.removeEventListener("mouseenter", onEnter);
          imgWrap.removeEventListener("mouseleave", onLeave);
        };
      }

      // -------------------------
      // ✅ TAP FEEL mobile (micro feedback, senza hover)
      // -------------------------
      if (!prefersReduced && isTouch) {
        const onDown = () =>
          gsap.to(imgWrap, { scale: 0.99, duration: 0.18, ease: "power2.out" });
        const onUp = () =>
          gsap.to(imgWrap, { scale: 1, duration: 0.25, ease: "power2.out" });

        imgWrap.addEventListener("pointerdown", onDown);
        imgWrap.addEventListener("pointerup", onUp);
        imgWrap.addEventListener("pointercancel", onUp);
        imgWrap.addEventListener("pointerleave", onUp);

        return () => {
          imgWrap.removeEventListener("pointerdown", onDown);
          imgWrap.removeEventListener("pointerup", onUp);
          imgWrap.removeEventListener("pointercancel", onUp);
          imgWrap.removeEventListener("pointerleave", onUp);
        };
      }
    }, rootRef);

    return () => ctx.revert();
  }, [id, durationPx, titleTokens.length, bodyTokens.length, reduceChars]);

  return (
    <section className="siamoSection" id={id} ref={rootRef}>
      <div id="siamo__nav" className="navAnchor" aria-hidden="true" />

      <div className="siamoInner">
        {/* COL LEFT: immagine (desktop) / si sposta sotto (mobile via CSS order) */}
        <div className="siamoMedia" ref={imgWrapRef} aria-hidden="true">
          <div className="siamoPhotoFrame" ref={tiltRef}>
            <img
              ref={imgRef}
              className="siamoPhoto"
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
            />
            {/* <span className="siamoShine" aria-hidden="true" /> */}
          </div>

          {/* <div className="siamoPhotoGlow" /> */}
        </div>

        {/* COL RIGHT: testo */}
        <div className="siamoCopy">
          <div className="siamoKicker" data-kicker>
            {kicker}
          </div>

          <h2 className="siamoTitle" data-titlewrap aria-label={title}>
            {reduceChars
              ? title
              : titleTokens.map((tok, idx) => {
                  if (tok === "\n") return <br key={`tbr-${idx}`} />;
                  if (/^[ \t]+$/.test(tok))
                    return <span key={`tsp-${idx}`}> </span>;
                  return <Word key={`tw-${idx}`} token={tok} type="t" />;
                })}
          </h2>

          <div className="siamoUnderline" data-underline aria-hidden="true" />

          <div className="siamoBody" data-bodywrap aria-label={bodyText}>
            {reduceChars
              ? paragraphs.map((p, i) => (
                  <p key={i} className="siamoP">
                    {p}
                  </p>
                ))
              : bodyTokens.map((tok, idx) => {
                  if (tok === "\n") return <br key={`bbr-${idx}`} />;
                  if (/^[ \t]+$/.test(tok))
                    return <span key={`bsp-${idx}`}> </span>;
                  return <Word key={`bw-${idx}`} token={tok} type="b" />;
                })}
          </div>
        </div>
      </div>
    </section>
  );
}
