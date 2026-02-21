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
    const isTouch = window.matchMedia("(hover: none)").matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.getById(`facciamo-${id}`)?.kill(true);
      ScrollTrigger.getById(`facciamo-img-reveal-${id}`)?.kill(true);

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

      const serviceItems = gsap.utils.toArray(
        root.querySelectorAll("[data-service]"),
      );

      // -------------------------
      // INIT STATES (intro)
      // -------------------------
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], {
        autoAlpha: 1,
        y: 0,
      });
      gsap.set(titleTargets, { autoAlpha: 1, y: 0 });
      gsap.set(bodyTargets, { autoAlpha: 1, y: 0 });

      // ✅ immagine: stessa grammatica di Siamo
      gsap.set(imgWrap, { autoAlpha: 0, y: 14, rotate: -0.4, scale: 0.98 });
      gsap.set(img, { scale: 1.04 });

      gsap.set(track, { x: 0 });

      // -------------------------
      // INIT STATES (services)
      // -------------------------
      gsap.set(servicesPanel, { autoAlpha: 1 });
      gsap.set(servicesWrap, { autoAlpha: 1 });
      gsap.set(servicesTrack, { x: 0 });
      gsap.set(serviceItems, { autoAlpha: 1, y: 0 });

      // -------------------------
      // DURATIONS (same logic)
      // -------------------------
      const charsCount = titleEls.length + bodyEls.length;
      const vw = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
      );

      const mobileBoost = vw < 640 ? 1.1 : vw < 900 ? 1.05 : 1;

      const textPxAuto = Math.round(
        Math.max(980, Math.min(2600, charsCount * 3.4)) * mobileBoost,
      );

      const textPxFinal = typeof textPx === "number" ? textPx : textPxAuto;
      void textPxFinal;

      const introHoldPx = isMobile ? 18 : 24;

      const horizPx = Math.round(Math.max(300, window.innerWidth * 0.5));
      const svcSlidePx = Math.round(Math.max(300, window.innerWidth * 0.56));
      const servicesSettlePx = 6;

      const totalPx = introHoldPx + horizPx + svcSlidePx + servicesSettlePx;

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      ScrollTrigger.create({
        id: `facciamo-${id}`,
        trigger: root,
        start: "top top",
        end: () => `+=${totalPx}`,
        scrub: isMobile ? 0.7 : true,
        pin: true,
        pinSpacing: true,
        anticipatePin: isMobile ? 2 : 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      // reveal: l'immagine arriva a opacità 1 quando la sezione occupa tutta la viewport
      gsap.timeline({
        scrollTrigger: {
          id: `facciamo-img-reveal-${id}`,
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

      const hStart = introHoldPx;
      tl.to(track, { x: () => -window.innerWidth, duration: horizPx }, hStart);

      const sStart = hStart + horizPx;
      tl.to(servicesWrap, { autoAlpha: 1, duration: 1 }, sStart);

      tl.to(
        servicesTrack,
        { x: () => -window.innerWidth, duration: svcSlidePx },
        sStart + 1,
      );

      if (!prefersReduced) {
        gsap.to(imgWrap, {
          y: "-=7",
          duration: 1.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      if (!prefersReduced && !isTouch) {
        const setRX = gsap.quickTo(imgWrap, "rotationX", {
          duration: 0.45,
          ease: "power3.out",
        });
        const setRY = gsap.quickTo(imgWrap, "rotationY", {
          duration: 0.45,
          ease: "power3.out",
        });
        const setSX = gsap.quickTo(imgWrap, "x", {
          duration: 0.45,
          ease: "power3.out",
        });
        const setSY = gsap.quickTo(imgWrap, "y", {
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
          gsap.to(imgWrap, {
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
    }, root);

    return () => ctx.revert();
  }, [id, textPx, titleTokens.length, bodyTokens.length]);

  return (
    <section className="facSection" id={id} ref={rootRef}>
      <div id="facciamo__nav" className="navAnchor" aria-hidden="true" />

      <div className="facViewport">
        <div className="facTrack" data-ftrack>
          <div className="facPanel" data-fpanel="intro">
            <div className="facIntroLayer" data-fintro>
              <div className="facInner">
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

                <div className="facCopy">
                  <div className="facKicker" data-fkicker>
                    {kicker}
                  </div>

                  <h2
                    className="facTitle"
                    data-ftitlewrap
                    aria-label={titleAria}
                  >
                    {titleTokens.map((tok, idx) => {
                      if (tok === "\n") return <br key={`ftbr-${idx}`} />;
                      if (/^[ \t]+$/.test(tok))
                        return <span key={`ftsp-${idx}`}> </span>;
                      return <Word key={`ftw-${idx}`} token={tok} type="t" />;
                    })}
                  </h2>

                  <div
                    className="facUnderline"
                    data-funderline
                    aria-hidden="true"
                  />

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
