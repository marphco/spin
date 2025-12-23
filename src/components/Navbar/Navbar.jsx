import React, { useEffect, useMemo, useState } from "react";
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
  const [active, setActive] = useState(null); // ✅ niente selezione all’avvio
  const ids = useMemo(() => LINKS.map((l) => l.id), []);

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

  // i tuoi id ScrollTrigger sono: "siamo-siamo", "facciamo-facciamo", "human-human"
  const getPinnedTriggerId = (id) => `${id}-${id}`;

  useEffect(() => {
    // cleanup di eventuali trigger precedenti (hot reload)
    ids.forEach((id) => ScrollTrigger.getById(`nav-${id}`)?.kill());

    const triggers = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((el) =>
        ScrollTrigger.create({
          id: `nav-${el.id}`,
          trigger: el,
          // “attivo” quando la sezione passa nella zona centrale dello schermo
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setActive(el.id),
          onEnterBack: () => setActive(el.id),
        })
      );

    // quando sei in hero/top: nessun active
    const topTrigger = ScrollTrigger.create({
      id: "nav-top",
      trigger: document.body,
      start: "top top",
      end: "top+=10 top",
      onEnter: () => setActive(null),
      onEnterBack: () => setActive(null),
    });

    // importante con layout/refresh GSAP
    ScrollTrigger.refresh(true);
    requestAnimationFrame(() => ScrollTrigger.refresh(true));

    return () => {
      triggers.forEach((t) => t.kill());
      topTrigger.kill();
      ids.forEach((id) => ScrollTrigger.getById(`nav-${id}`)?.kill());
      ScrollTrigger.getById("nav-top")?.kill();
    };
  }, [ids]);

  const onNav = (e, id) => {
    e.preventDefault();

    // stoppa eventuali scroll in corso
    gsap.killTweensOf(window);

    // assesta i pin/spacer prima di leggere start/end
    ScrollTrigger.refresh(true);

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
        });
        setActive(null);
        return;
      }

      // Sezione pinnata? usa START del trigger (stabile ovunque ti trovi)
      const st = ScrollTrigger.getById(getPinnedTriggerId(id));
      if (st) {
        const y = st.start + offset;

        gsap.to(window, {
          scrollTo: y,
          duration: 0.95,
          ease: "power2.out",
          overwrite: "auto",
          onUpdate: ScrollTrigger.update,
          onComplete: () => ScrollTrigger.refresh(true),
        });

        setActive(id);
        return;
      }

      // Fallback (es. contatti se non è pinnata)
      const anchor =
        document.getElementById(`${id}__nav`) || document.getElementById(id);
      if (!anchor) return;

      const y = anchor.getBoundingClientRect().top + window.scrollY + offset;

      gsap.to(window, {
        scrollTo: y,
        duration: 0.95,
        ease: "power2.out",
        overwrite: "auto",
        onUpdate: ScrollTrigger.update,
        onComplete: () => ScrollTrigger.refresh(true),
      });

      setActive(id);
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
