import React, { useEffect, useMemo, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.svg";

const LINKS = [
  { id: "siamo", label: "Siamo" },
  { id: "facciamo", label: "Facciamo" },
  { id: "human", label: "Human" },
  { id: "contatti", label: "Contatti" },
];

export default function Navbar() {
  const [active, setActive] = useState("siamo");
  const ids = useMemo(() => LINKS.map((l) => l.id), []);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      { threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [ids]);

  const onNav = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="navShell" role="navigation" aria-label="Sezioni">
      <div className="navBar">
        <a className="navBrand" href="#siamo" onClick={(e) => onNav(e, "siamo")}>
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
