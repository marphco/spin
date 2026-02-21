// Human.jsx
import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Human.css";
import HumanServizi from "./HumanServizi";

import humanLogo from "../../assets/human.svg";

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
  imageSrc = humanLogo,
  imageAlt = "Human logo",
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

    let cleanup = null;

    const ctx = gsap.context(() => {
      ScrollTrigger.getById(`human-${id}`)?.kill(true);
      ScrollTrigger.getById(`human-img-reveal-${id}`)?.kill(true);

      const track = root.querySelector("[data-htrack]");

      // intro refs
      const kickerEl = root.querySelector("[data-hkicker]");
      const underlineEl = root.querySelector("[data-hunderline]");
      const titleWrap = root.querySelector("[data-htitlewrap]");
      const bodyWrap = root.querySelector("[data-hbodywrap]");

      const titleEls = Array.from(root.querySelectorAll("[data-htch]"));
      const bodyEls = Array.from(root.querySelectorAll("[data-hbch]"));

      const titleTargets = isMobile ? [titleWrap] : titleEls;
      const bodyTargets = isMobile ? [bodyWrap] : bodyEls;

      // services refs
      const servicesPanel = root.querySelector("[data-hservicespanel]");
      const servicesWrap = root.querySelector("[data-hserviceswrap]");
      const serviceItems = gsap.utils.toArray(
        root.querySelectorAll("[data-hservice]"),
      );

      if (!track || !servicesPanel || !servicesWrap) return;

      // -------------------------
      // INITIAL STATE
      // -------------------------
      gsap.set([kickerEl, underlineEl, titleWrap, bodyWrap], {
        autoAlpha: 1,
        y: 0,
      });
      gsap.set(titleTargets, { autoAlpha: 1, y: 0 });
      gsap.set(bodyTargets, { autoAlpha: 1, y: 0 });

      // logo (no rotate: è un logo)
      gsap.set(imgWrap, { autoAlpha: 0, y: 14, scale: 0.985 });
      gsap.set(img, { scale: 1.02 });

      gsap.set(track, { x: 0 });

      gsap.set(servicesPanel, { autoAlpha: 1 });
      gsap.set(servicesWrap, { autoAlpha: 1 });
      gsap.set(serviceItems, { autoAlpha: 1, y: 0 });

      // -------------------------
      // DURATIONS (coerenti con Facciamo fix)
      // -------------------------
      const charsCount = titleEls.length + bodyEls.length;
      const vw = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
      );

      const mobileBoost = vw < 640 ? 1.1 : vw < 900 ? 1.05 : 1;

      const textPxAuto = Math.round(
        Math.max(950, Math.min(2500, charsCount * 3.4)) * mobileBoost,
      );

      const textPxFinal = typeof textPx === "number" ? textPx : textPxAuto;
      void textPxFinal;

      // tratto intro quasi nullo: evita scroll a vuoto prima dei servizi
      const introHoldPx = isMobile ? 18 : 24;

      const horizPx = Math.round(Math.max(300, window.innerWidth * 0.5));
      const servicesPx = 6;
      const totalPx = introHoldPx + horizPx + servicesPx;

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      ScrollTrigger.create({
        id: `human-${id}`,
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

      // -------------------------
      // A) TEXT SEGMENTS
      // -------------------------

      // reveal: il logo arriva a opacità 1 quando la sezione occupa tutta la viewport
      gsap.timeline({
        scrollTrigger: {
          id: `human-img-reveal-${id}`,
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
            scale: 1,
            ease: "none",
          },
          0,
        )
        .to(img, { scale: 1, ease: "none" }, 0);

      // -------------------------
      // B) HORIZONTAL intro -> services
      // -------------------------
      const hStart = introHoldPx;
      tl.to(track, { x: () => -window.innerWidth, duration: horizPx }, hStart);

      // -------------------------
      // C) SERVICES reveal
      // -------------------------
      const sStart = hStart + horizPx;

      tl.to(servicesWrap, { autoAlpha: 1, duration: 1 }, sStart);

      // -------------------------
      // FLOATING + HOVER/TAP (come Siamo)
      // -------------------------
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
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
          });
        };

        imgWrap.addEventListener("mousemove", onMove);
        imgWrap.addEventListener("mouseenter", onEnter);
        imgWrap.addEventListener("mouseleave", onLeave);

        cleanup = () => {
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

        cleanup = () => {
          imgWrap.removeEventListener("pointerdown", onDown);
          imgWrap.removeEventListener("pointerup", onUp);
          imgWrap.removeEventListener("pointercancel", onUp);
          imgWrap.removeEventListener("pointerleave", onUp);
        };
      }
    }, root);

    return () => {
      cleanup?.();
      ctx.revert();
    };
  }, [id, textPx, titleTokens.length, bodyTokens.length]);

  return (
    <section className="humSection" id={id} ref={rootRef}>
      <div id="human__nav" className="navAnchor" aria-hidden="true" />

      <div className="humViewport">
        <div className="humTrack" data-htrack>
          {/* PANEL 1: INTRO */}
          <div className="humPanel" data-hpanel="intro">
            <div className="humInner">
              {/* LOGO */}
              <div className="humMedia" ref={imgWrapRef} aria-hidden="true">
                <img
                  ref={imgRef}
                  className="humLogo"
                  src={imageSrc}
                  alt={imageAlt}
                  loading="lazy"
                />
              </div>

              {/* COPY */}
              <div className="humCopy">
                <div className="humKicker" data-hkicker>
                  {kicker}
                </div>

                <h2 className="humTitle" data-htitlewrap aria-label={title}>
                  {titleTokens.map((tok, idx) => {
                    if (tok === "\n") return <br key={`htbr-${idx}`} />;
                    if (/^[ \t]+$/.test(tok))
                      return <span key={`htsp-${idx}`}> </span>;
                    return <Word key={`htw-${idx}`} token={tok} type="t" />;
                  })}
                </h2>

                <div
                  className="humUnderline"
                  data-hunderline
                  aria-hidden="true"
                />

                <div className="humBody" data-hbodywrap aria-label={bodyText}>
                  {bodyTokens.map((tok, idx) => {
                    if (tok === "\n") return <br key={`hbbr-${idx}`} />;
                    if (/^[ \t]+$/.test(tok))
                      return <span key={`hbsp-${idx}`}> </span>;
                    return <Word key={`hbw-${idx}`} token={tok} type="b" />;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 2: SERVICES */}
          <div className="humPanel" data-hpanel="services">
            <div className="humServicesLayer" data-hservicespanel>
              <HumanServizi />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
