import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./Press.css";
import hintSvg from "../../assets/hint.svg";

function parseItalianDate(dateStr) {
  const months = {
    gennaio: 0,
    febbraio: 1,
    marzo: 2,
    aprile: 3,
    maggio: 4,
    giugno: 5,
    luglio: 6,
    agosto: 7,
    settembre: 8,
    ottobre: 9,
    novembre: 10,
    dicembre: 11,
  };

  if (!dateStr || typeof dateStr !== "string") return new Date(0);

  const parts = dateStr.trim().split(/\s+/);
  const day = Number(parts[0]);
  const month = months[(parts[1] || "").toLowerCase()];
  const year = Number(parts[2]);

  if (!Number.isFinite(day) || !Number.isFinite(year) || month == null)
    return new Date(0);
  return new Date(year, month, day);
}

function chunk2(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2));
  return out;
}

export default function Press({ id = "press", items = [] }) {
  const sorted = useMemo(() => {
    return [...items].sort(
      (a, b) => parseItalianDate(b?.date) - parseItalianDate(a?.date),
    );
  }, [items]);

  const scrollerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 860px)").matches,
  );

  // hint state (solo dismiss)
  const [hintDismissed, setHintDismissed] = useState(false);

  const isCarousel = sorted.length > 2;
  const showArrows = isCarousel && !isMobile;
  const showSwipeHint = isCarousel && isMobile && !hintDismissed;

  // responsive: NO setState sync dentro effect body
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const onChange = (e) => setIsMobile(e.matches);

    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // reset hint SOLO quando "modalità" cambia (mobile+carousel ON/OFF)
  useEffect(() => {
    // quando non serve, lo consideriamo dismissed e fine
    if (!isMobile || !isCarousel) {
      if (!hintDismissed) setHintDismissed(true);
      return;
    }
    // quando torna utile (mobile+carousel), lo ri-mostriamo
    if (hintDismissed) setHintDismissed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isCarousel]);

  // auto-dismiss hint: primo scroll orizzontale o timeout
  useEffect(() => {
    if (!isMobile || !isCarousel || hintDismissed) return;

    const el = scrollerRef.current;
    if (!el) return;

    const t = window.setTimeout(() => setHintDismissed(true), 4500);

    const onScroll = () => {
      if (el.scrollLeft > 8) {
        setHintDismissed(true);
        window.clearTimeout(t);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
    };
  }, [isMobile, isCarousel, hintDismissed]);

  const getStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;

    const target = el.querySelector(isMobile ? ".pressPage" : ".pressCard");
    if (!target) return 0;

    const cs = getComputedStyle(el);
    const gap = parseFloat(cs.columnGap || cs.gap || "0") || 0;
    return target.getBoundingClientRect().width + gap;
  }, [isMobile]);

  const scrollByDir = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;

    const step = getStep();
    if (!step) return;

    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const renderCard = (x, i) => (
    <a
      key={`${x.href}-${i}`}
      className="pressCard"
      href={x.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${x.brand}: ${x.title} (apre in nuova tab)`}
    >
      <div className="pressCardTop">
        {x.logo ? (
          <img
            className="pressLogo"
            src={x.logo}
            alt={x.brand || "Testata"}
            loading="lazy"
          />
        ) : (
          <div className="pressLogoFallback">{x.brand}</div>
        )}
      </div>

      <div className="pressCardTitle">{x.title}</div>
      <div className="pressCardMeta">{x.date}</div>
    </a>
  );

  const pages = useMemo(() => {
    if (!isCarousel || !isMobile) return [];
    return chunk2(sorted);
  }, [sorted, isCarousel, isMobile]);

  return (
    <section className="pressSection" id={id}>
      <div id="press__nav" className="navAnchor" aria-hidden="true" />

      <div className="pressInner">
        <div className="pressKicker">Press</div>
        <div className="pressUnderline" aria-hidden="true" />

        <div className={`pressRail ${isCarousel ? "isCarousel" : ""}`}>
          {showArrows && (
            <>
              <button
                className="pressArrow pressArrowLeft"
                type="button"
                aria-label="Articolo precedente"
                onClick={() => scrollByDir(-1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="pressArrowIcon"
                  aria-hidden="true"
                >
                  <path
                    d="M14.5 5.5L8.5 12l6 6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="pressArrow pressArrowRight"
                type="button"
                aria-label="Articolo successivo"
                onClick={() => scrollByDir(1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="pressArrowIcon"
                  aria-hidden="true"
                >
                  <path
                    d="M9.5 5.5L15.5 12l-6 6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          {/* DESKTOP */}
          {!isMobile && (
            <div
              ref={scrollerRef}
              className={`pressGrid ${isCarousel ? "isCarousel" : ""}`}
            >
              {sorted.map(renderCard)}
            </div>
          )}

          {/* MOBILE carousel: pagine 2-up (vertical stack) */}
          {isMobile && isCarousel && (
            <div className="pressMobileWrap">
              <div
                ref={scrollerRef}
                className="pressMobileScroller"
                aria-label="Rassegna stampa"
              >
                {pages.map((pair, p) => (
                  <div className="pressPage" key={`page-${p}`}>
                    {pair.map(renderCard)}
                  </div>
                ))}
              </div>

              {showSwipeHint && (
                <div className="pressSwipeHint" aria-hidden="true">
                  <img className="pressSwipeImg" src={hintSvg} alt="" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
