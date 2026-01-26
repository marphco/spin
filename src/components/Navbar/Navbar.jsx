import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.svg";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const LINKS = [
  { id: "siamo", label: "Siamo" },
  { id: "facciamo", label: "Facciamo" },
  { id: "human", label: "Human" },
  { id: "press", label: "Press" },
  { id: "contatti", label: "Contatti" },
];

export default function Navbar() {
  const [active, setActive] = useState(null);
  const ids = useMemo(() => LINKS.map((l) => l.id), []);

  const navLock = useRef(false);
  const elsRef = useRef([]);
  const barRef = useRef(null);

  const OFFSETS_DESKTOP = {
    siamo: 300,
    facciamo: 950,
    human: 760,
    press: 50,
    contatti: 200,
  };

  const OFFSETS_MOBILE = {
    siamo: 280,
    facciamo: 1100,
    human: 800,
    press: 50,
    contatti: 50,
  };

  const getOffset = (id) => {
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    return (isMobile ? OFFSETS_MOBILE : OFFSETS_DESKTOP)[id] ?? 0;
  };

  const getPinnedTriggerId = (id) => `${id}-${id}`;

  // ---------------------------------------------------
  // NAVBAR SKIN ANIMATION (dark <-> light) — smooth
  // ---------------------------------------------------
  const toLightSkin = useMemo(
    () => ({
      backgroundColor: "rgba(255,255,255,0.72)",
      borderColor: "rgba(0,0,0,0.10)",
      boxShadow: "0 14px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.70)",
      backdropFilter: "blur(16px)",
    }),
    [],
  );

  const toDarkSkin = useMemo(
    () => ({
      backgroundColor: "var(--glass-bg)",
      borderColor: "var(--glass-border)",
      boxShadow: "var(--shadow-float), inset 0 1px 0 var(--glass-highlight)",
      backdropFilter: "blur(14px)",
    }),
    [],
  );

  const animateSkin = (mode) => {
    const el = barRef.current;
    if (!el) return;

    gsap.to(el, {
      ...(mode === "light" ? toLightSkin : toDarkSkin),
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto",
    });

    // classe solo per i colori dei link (non per il background)
    if (mode === "light") el.classList.add("isOnLight");
    else el.classList.remove("isOnLight");
  };

  // ---------------------------------------------------
  // TRIGGERS
  // ---------------------------------------------------
  useEffect(() => {
    ids.forEach((id) => ScrollTrigger.getById(`nav-${id}`)?.kill());
    ScrollTrigger.getById("nav-top")?.kill();
    ScrollTrigger.getById("nav-smart")?.kill();
    ScrollTrigger.getById("nav-press-skin")?.kill();

    const getNavEl = (id) => {
      if (id === "contatti") return document.getElementById("footer");
      return document.getElementById(id);
    };

    const els = ids
      .map((id) => ({ id, el: getNavEl(id) }))
      .filter((x) => x.el);

    elsRef.current = els;

    const setActiveSmart = () => {
      if (navLock.current) return;

      const center = window.innerHeight * 0.5;

      const stSiamo = ScrollTrigger.getById("siamo-siamo");
      if (stSiamo && window.scrollY < stSiamo.start + 1) {
        setActive(null);
        return;
      }

      let best = null;
      let bestDist = Infinity;

      for (const { id, el } of elsRef.current) {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - center);

        if (dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      }

      setActive(best);
    };

    const smart = ScrollTrigger.create({
      id: "nav-smart",
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: setActiveSmart,
      onRefresh: setActiveSmart,
    });

    const topTrigger = ScrollTrigger.create({
      id: "nav-top",
      trigger: "#top",
      start: "top top",
      end: "bottom top",
      onEnter: () => {
        if (!navLock.current) setActive(null);
      },
      onEnterBack: () => {
        if (!navLock.current) setActive(null);
      },
    });

    // ✅ transizione soft su Press
    const pressSkin = ScrollTrigger.create({
      id: "nav-press-skin",
      trigger: "#press",
      start: "top 25%",
      end: "bottom 25%",
      onEnter: () => animateSkin("light"),
      onEnterBack: () => animateSkin("light"),
      onLeave: () => animateSkin("dark"),
      onLeaveBack: () => animateSkin("dark"),
    });

    // init: forza skin corretta al load
    requestAnimationFrame(() => {
      const pressEl = document.getElementById("press");
      if (!pressEl) return;
      const r = pressEl.getBoundingClientRect();
      const inPress = r.top < window.innerHeight * 0.25 && r.bottom > window.innerHeight * 0.25;
      animateSkin(inPress ? "light" : "dark");
    });

    setActiveSmart();

    return () => {
      smart.kill();
      topTrigger.kill();
      pressSkin.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  // ---------------------------------------------------
  // CLICK SCROLL
  // ---------------------------------------------------
  const finalizeNav = (id) => {
    requestAnimationFrame(() => {
      ScrollTrigger.update();

      requestAnimationFrame(() => {
        ScrollTrigger.update();

        setActive(id === "top" ? null : id);
        navLock.current = false;

        ScrollTrigger.refresh(true);

        if (id === "human") {
          requestAnimationFrame(() => {
            ScrollTrigger.getById("bg-range-human")?.refresh();
            ScrollTrigger.update();
            requestAnimationFrame(() => ScrollTrigger.update());
          });
        }
      });
    });
  };

  const onNav = (e, id) => {
    e.preventDefault();

    navLock.current = true;
    gsap.killTweensOf(window);

    requestAnimationFrame(() => {
      const offset = getOffset(id);

      if (id === "top") {
        gsap.to(window, {
          scrollTo: 0,
          duration: 0.9,
          ease: "power2.out",
          overwrite: "auto",
          onUpdate: ScrollTrigger.update,
          onComplete: () => finalizeNav("top"),
        });
        return;
      }

      const st = ScrollTrigger.getById(getPinnedTriggerId(id));
      if (st) {
        const y = st.start + offset;

        gsap.to(window, {
          scrollTo: y,
          duration: 0.95,
          ease: "power2.out",
          overwrite: "auto",
          onUpdate: ScrollTrigger.update,
          onComplete: () => finalizeNav(id),
        });
        return;
      }

      const anchor =
        document.getElementById(`${id}__nav`) || document.getElementById(id);
      if (!anchor) {
        navLock.current = false;
        return;
      }

      const y = anchor.getBoundingClientRect().top + window.scrollY + offset;

      gsap.to(window, {
        scrollTo: y,
        duration: 0.95,
        ease: "power2.out",
        overwrite: "auto",
        onUpdate: ScrollTrigger.update,
        onComplete: () => finalizeNav(id),
      });
    });
  };

  return (
    <div className="navShell" role="navigation" aria-label="Sezioni">
      <div ref={barRef} className="navBar">
        <a className="navBrand" href="#top" onClick={(e) => onNav(e, "top")}>
          <img className="navLogo" src={logo} alt="Spin Factor" />
        </a>

        <div className="navLinks" aria-label="Menu">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => onNav(e, l.id)}
              className={`navLink ${active === l.id ? "isActive" : ""}`}
              aria-current={active === l.id ? "page" : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
