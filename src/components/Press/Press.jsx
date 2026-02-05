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

  if (!Number.isFinite(day) || !Number.isFinite(year) || month == null) {
    return new Date(0);
  }

  return new Date(year, month, day);
}

function chunk2(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2));
  return out;
}

export default function Press({ id = "press", items = [] }) {
  const baseItems = useMemo(() => {
    return [...items].sort(
      (a, b) => parseItalianDate(b?.date) - parseItalianDate(a?.date),
    );
  }, [items]);

  const isCarousel = baseItems.length > 2;

  // Loop: 3 copie
  const loopItems = useMemo(() => {
    if (!isCarousel) return baseItems;
    return [...baseItems, ...baseItems, ...baseItems];
  }, [baseItems, isCarousel]);

  const scrollerRef = useRef(null);
  const railRef = useRef(null);

  const isHoveringRef = useRef(false);
  const ignoreHintScrollRef = useRef(false);

  const isJumpingRef = useRef(false);
  const userInteractingRef = useRef(false);
  const resumeTRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 860px)").matches,
  );

  // hint state (solo dismiss)
  const [hintDismissed, setHintDismissed] = useState(false);

  const sectionRef = useRef(null);

  // sezione in viewport (serve per mostrare hint solo quando la raggiungi)
  const [pressInView, setPressInView] = useState(false);

  // motivo dismiss: "user" = non riproporre, "auto" = riproporre quando rientri
  const hintDismissReasonRef = useRef("auto");

  const showArrows = isCarousel && !isMobile;
  const showSwipeHint = isCarousel && isMobile && !hintDismissed;

  // ---------------------------------------------------
  // RESPONSIVE
  // ---------------------------------------------------
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const onChange = (e) => setIsMobile(e.matches);

    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // reset hint quando serve
  useEffect(() => {
    if (!isMobile || !isCarousel) {
      if (!hintDismissed) setHintDismissed(true);
      return;
    }
    if (hintDismissed) {
      hintDismissReasonRef.current = "auto";
      setHintDismissed(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isCarousel, baseItems.length]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // true quando la sezione è davvero “navigata” (down o up)
        setPressInView(entry.isIntersecting);
      },
      {
        // entra un filo prima, esce un filo dopo: feel migliore
        root: null,
        threshold: 0.18,
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!pressInView) return;

    // Mostra hint quando arrivi alla sezione, ma solo se:
    // - sei mobile
    // - è carousel
    // - non è stato dismissato dall’utente
    if (isMobile && isCarousel && hintDismissReasonRef.current !== "user") {
      setHintDismissed(false);
      hintDismissReasonRef.current = "auto";
    }
  }, [pressInView, isMobile, isCarousel]);

  // ---------------------------------------------------
  // USER INTERACTION FLAG
  // ---------------------------------------------------
  const setUserInteracting = useCallback(() => {
    userInteractingRef.current = true;
    if (resumeTRef.current) window.clearTimeout(resumeTRef.current);
    resumeTRef.current = window.setTimeout(() => {
      userInteractingRef.current = false;
    }, 2200);
  }, []);

  // ---------------------------------------------------
  // JUMP WITHOUT BOUNCE (usato dal loop)
  // ---------------------------------------------------
  const jumpWithoutBounce = useCallback((newLeft) => {
    const el = scrollerRef.current;
    if (!el) return;

    isJumpingRef.current = true;

    // evita che hint si chiuda per scroll programmatici
    ignoreHintScrollRef.current = true;

    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    el.scrollLeft = newLeft;

    requestAnimationFrame(() => {
      el.style.scrollBehavior = prev || "";
      isJumpingRef.current = false;

      requestAnimationFrame(() => {
        ignoreHintScrollRef.current = false;
      });
    });
  }, []);

  // ---------------------------------------------------
  // SCROLL STEP (per pagina)
  // ---------------------------------------------------
  const getStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;

    const target = el.querySelector(isMobile ? ".pressPage" : ".pressDeskPage");
    if (!target) return 0;

    const cs = getComputedStyle(el);
    const gap = parseFloat(cs.columnGap || cs.gap || "0") || 0;

    return target.getBoundingClientRect().width + gap;
  }, [isMobile]);

  const getRailGap = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const cs = getComputedStyle(el);
    return parseFloat(cs.columnGap || cs.gap || "0") || 0;
  }, []);

  // copy width coerente con step (desktop+mobile)
  const getCopyWidth = useCallback(() => {
    const step = getStep();
    if (!step) return 0;

    const gap = getRailGap();
    const pageCount = Math.ceil(baseItems.length / 2);

    // step = pageWidth + gap  => copyW = pageCount*step - gap
    const copyW = pageCount * step - gap;

    return Number.isFinite(copyW) ? copyW : 0;
  }, [getStep, getRailGap, baseItems.length]);

  // ✅ PRE-WRAP per evitare clamp a 0 (nessun scroll event)
  const ensureMiddleCopyForDir = useCallback(
    (dir) => {
      if (!isCarousel) return;

      const el = scrollerRef.current;
      if (!el) return;

      const copyW = getCopyWidth();
      if (!copyW) return;

      const left = el.scrollLeft;

      if (dir < 0 && left <= copyW + 2) {
        jumpWithoutBounce(left + copyW);
        return;
      }

      if (dir > 0 && left >= 2 * copyW - 2) {
        jumpWithoutBounce(left - copyW);
      }
    },
    [isCarousel, getCopyWidth, jumpWithoutBounce],
  );

  // scroll via frecce
  const scrollByDir = useCallback(
    (dir) => {
      const el = scrollerRef.current;
      if (!el) return;

      const step = getStep();
      if (!step) return;

      ensureMiddleCopyForDir(dir);
      el.scrollBy({ left: dir * step, behavior: "smooth" });
    },
    [getStep, ensureMiddleCopyForDir],
  );

  // ---------------------------------------------------
  // HINT auto-dismiss (non triggerare su jump/autoplay)
  // ---------------------------------------------------
  useEffect(() => {
    if (!pressInView) return;
    if (!isMobile || !isCarousel || hintDismissed) return;

    const el = scrollerRef.current;
    if (!el) return;

    const startLeft = el.scrollLeft;

    const t = window.setTimeout(() => {
      hintDismissReasonRef.current = "auto";
      setHintDismissed(true);
    }, 4500);

    const onScroll = () => {
      if (ignoreHintScrollRef.current) return;

      // qui è user swipe/scroll reale (non autoplay/jump)
      if (Math.abs(el.scrollLeft - startLeft) > 8) {
        hintDismissReasonRef.current = "user";
        setHintDismissed(true);
        window.clearTimeout(t);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
    };
  }, [pressInView, isMobile, isCarousel, hintDismissed]);

  // ---------------------------------------------------
  // POSITION INIT: copia centrale
  // ---------------------------------------------------
  useEffect(() => {
    if (!isCarousel) return;

    const el = scrollerRef.current;
    if (!el) return;

    let raf1 = 0;
    let raf2 = 0;

    if (!isMobile) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          const copyW = getCopyWidth();
          if (!copyW) return;
          jumpWithoutBounce(copyW);
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    const raf = requestAnimationFrame(() => {
      const copyW = getCopyWidth();
      if (!copyW) return;
      jumpWithoutBounce(copyW);
    });
    return () => cancelAnimationFrame(raf);
  }, [isCarousel, isMobile, getCopyWidth, jumpWithoutBounce]);

  // ---------------------------------------------------
  // WRAP quando esci dalla copia centrale
  // ---------------------------------------------------
  useEffect(() => {
    if (!isCarousel) return;

    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      if (isJumpingRef.current) return;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const copyW = getCopyWidth();
        if (!copyW) return;

        const left = el.scrollLeft;

        if (left >= 2 * copyW) {
          jumpWithoutBounce(left - copyW);
        } else if (left < copyW) {
          jumpWithoutBounce(left + copyW);
        }
      });
    };

    const markInteract = () => setUserInteracting();

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", markInteract, { passive: true });
    el.addEventListener("touchstart", markInteract, { passive: true });
    el.addEventListener("pointerdown", markInteract, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", markInteract);
      el.removeEventListener("touchstart", markInteract);
      el.removeEventListener("pointerdown", markInteract);
    };
  }, [isCarousel, getCopyWidth, jumpWithoutBounce, setUserInteracting]);

  // ---------------------------------------------------
  // AUTOPLAY (pausa su hover + non uccide hint su mobile)
  // ---------------------------------------------------
  useEffect(() => {
    if (!isCarousel) return;

    const el = scrollerRef.current;
    if (!el) return;

    const idInt = window.setInterval(() => {
      if (isJumpingRef.current) return;
      if (userInteractingRef.current) return;
      if (isHoveringRef.current) return;

      const step = getStep();
      if (!step) return;

      if (isMobile) ignoreHintScrollRef.current = true;
      el.scrollBy({ left: step, behavior: "smooth" });
      if (isMobile) {
        window.setTimeout(() => {
          ignoreHintScrollRef.current = false;
        }, 350);
      }
    }, 4200);

    return () => window.clearInterval(idInt);
  }, [isCarousel, getStep, isMobile]);

  // ---------------------------------------------------
  // HOVER PAUSE
  // ---------------------------------------------------
  useEffect(() => {
    if (!isCarousel) return;

    const el = railRef.current;
    if (!el) return;

    const onEnter = () => {
      isHoveringRef.current = true;
    };
    const onLeave = () => {
      isHoveringRef.current = false;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [isCarousel]);

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  const renderCard = useCallback(
    (x, i) => (
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
              className={`pressLogo ${x.brand === "LA7" ? "pressLogo--la7" : ""}`}
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
    ),
    [],
  );

  const pagesMobile = useMemo(() => {
    if (!isCarousel || !isMobile) return [];
    return chunk2(loopItems);
  }, [loopItems, isCarousel, isMobile]);

  const pagesDesktop = useMemo(() => {
    if (!isCarousel || isMobile) return [];
    return chunk2(loopItems);
  }, [loopItems, isCarousel, isMobile]);

  return (
    <section ref={sectionRef} className="pressSection" id={id}>
      <div id="press__nav" className="navAnchor" aria-hidden="true" />

      <div className="pressInner">
        <div className="pressKicker">Press</div>
        <div className="pressUnderline" aria-hidden="true" />

        <div
          ref={railRef}
          className={`pressRail ${isCarousel ? "isCarousel" : ""}`}
        >
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
          {!isMobile && !isCarousel && (
            <div className="pressGrid">{baseItems.map(renderCard)}</div>
          )}

          {!isMobile && isCarousel && (
            <div
              ref={scrollerRef}
              className="pressDeskScroller"
              aria-label="Rassegna stampa"
            >
              {pagesDesktop.map((pair, p) => (
                <div className="pressDeskPage" key={`desk-page-${p}`}>
                  {pair.map(renderCard)}
                </div>
              ))}
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
                {pagesMobile.map((pair, p) => (
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

          {/* MOBILE non-carousel (<=2 items): fallback semplice */}
          {isMobile && !isCarousel && (
            <div className="pressGrid">{baseItems.map(renderCard)}</div>
          )}
        </div>
      </div>
    </section>
  );
}
