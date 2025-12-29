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
  { id: "contatti", label: "Contatti" },
];

export default function Navbar() {
  const [active, setActive] = useState(null);
  const ids = useMemo(() => LINKS.map((l) => l.id), []);

  // ✅ lock per evitare che i trigger sovrascrivano active mentre scrolliamo via click
  const navLock = useRef(false);

  const OFFSETS_DESKTOP = {
    siamo: 300,
    facciamo: 950,
    human: 800,
    contatti: 200,
  };

  const OFFSETS_MOBILE = {
    siamo: 280,
    facciamo: 1100,
    human: 800,
    contatti: 50,
  };

  const getOffset = (id) => {
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    return (isMobile ? OFFSETS_MOBILE : OFFSETS_DESKTOP)[id] ?? 0;
  };

  const getPinnedTriggerId = (id) => `${id}-${id}`;

  useEffect(() => {
    ids.forEach((id) => ScrollTrigger.getById(`nav-${id}`)?.kill());
    ScrollTrigger.getById("nav-top")?.kill();

    const triggers = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((el) =>
        ScrollTrigger.create({
          id: `nav-${el.id}`,
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => {
            if (navLock.current) return; // ✅ non sovrascrivere durante nav via click
            setActive(el.id);
          },
          onEnterBack: () => {
            if (navLock.current) return;
            setActive(el.id);
          },
        })
      );

    const topTrigger = ScrollTrigger.create({
      id: "nav-top",
      trigger: document.body,
      start: "top top",
      end: "top+=10 top",
      onEnter: () => {
        if (navLock.current) return;
        setActive(null);
      },
      onEnterBack: () => {
        if (navLock.current) return;
        setActive(null);
      },
    });

    return () => {
      triggers.forEach((t) => t.kill());
      topTrigger.kill();
    };
  }, [ids]);

  // ✅ helper: rilascia lock DOPO che ScrollTrigger ha aggiornato e poi forza active
  const finalizeNav = (id) => {
    requestAnimationFrame(() => {
      ScrollTrigger.update();

      requestAnimationFrame(() => {
        ScrollTrigger.update();

        // ✅ ora che la posizione è stabile, forziamo active
        setActive(id === "top" ? null : id);

        // ✅ sblocchiamo (da questo momento i trigger possono aggiornare di nuovo)
        navLock.current = false;

        // ✅ refresh leggero per evitare micro mismatch su iOS
        // ✅ refresh leggero per evitare micro mismatch su iOS
        ScrollTrigger.refresh(true);

        // ✅ FIX: salto Footer (nero) -> Human (verde)
        // su iOS a volte il trigger del footer riscrive il nero dopo lo scroll.
        // Qui forziamo l'update dei range-trigger di Home.jsx.
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

    // ✅ attiva lock
    navLock.current = true;

    // stoppa scroll in corso
    gsap.killTweensOf(window);

    requestAnimationFrame(() => {
      const offset = getOffset(id);

      // TOP
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

      // Sezione pinnata? usa START del trigger
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

      // Fallback (contatti / altre non pinnate)
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
      <div className="navBar">
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
