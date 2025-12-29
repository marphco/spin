import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import heroImg from "./assets/hero.jpg";

import Siamo from "./components/Siamo/Siamo";
import Facciamo from "./components/Facciamo/Facciamo";
import Human from "./components/Human/Human";
import Footer from "./components/Footer/Footer";
import CookieNotice from "./components/Policies/CookieNotice.jsx";
import { useCookieNotice } from "./components/Policies/useCookieNotice.js";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { open, accept } = useCookieNotice();
  useLayoutEffect(() => {
    const rootEl = document.documentElement;

    const isMobile = window.matchMedia("(max-width: 720px)").matches;

    // ✅ GSAP: meno rogne su mobile resize / orientation
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      limitCallbacks: true, // ✅ aggiungi
    });


    // ✅ migliora lo scroll touch (se noti “stranezze” lo togliamo)
    // ScrollTrigger.normalizeScroll(true);

    const nero =
      getComputedStyle(rootEl).getPropertyValue("--bg").trim() || "#010101";

    const blu = "#0b1320"; // Facciamo (macro + micro)
    const verde = "#02291f"; // Human (macro + micro)

    gsap.set(rootEl, { "--pageBg": nero });

    // kill vecchi trigger
    ScrollTrigger.getById("bg-siamo-to-facciamo")?.kill(true);
    ScrollTrigger.getById("bg-facciamo-horizontal")?.kill(true); // 👈 se esisteva
    ScrollTrigger.getById("bg-facciamo-to-human")?.kill(true);
    ScrollTrigger.getById("bg-human-to-footer")?.kill(true);

    // ✅ helper: setta bg in modo pulito e coerente (usato solo per HUMAN/FOOTER)
    const setBg = (color) => {
      gsap.to(rootEl, {
        "--pageBg": color,
        duration: 0.15,
        ease: "none",
        overwrite: "auto",
      });
    };

    // stato iniziale
    gsap.set(rootEl, { "--pageBg": nero });

    // kill vecchi trigger (hot reload safe)
    ScrollTrigger.getById("bg-scrub-siamo-facciamo")?.kill(true);
    ScrollTrigger.getById("bg-range-human")?.kill(true);
    ScrollTrigger.getById("bg-range-footer")?.kill(true);

    /* ---------------------------------------------------
       ✅ 1) SCRUB: SIAMO <-> FACCIAMO (smooth)
    --------------------------------------------------- */
    ScrollTrigger.create({
      id: "bg-scrub-siamo-facciamo",
      trigger: "#facciamo",
      start: "top bottom",
      end: "top top",
      scrub: true,
      fastScrollEnd: true,
      preventOverlaps: true,
      invalidateOnRefresh: true,
      animation: gsap.fromTo(
        rootEl,
        { "--pageBg": nero },
        { "--pageBg": blu, ease: "none", immediateRender: false }
      ),
    });

    /* ---------------------------------------------------
       ✅ 2) HUMAN: verde fino al footer
    --------------------------------------------------- */
    ScrollTrigger.create({
      id: "bg-range-human",
      trigger: "#human",
      start: "top top",
      endTrigger: "#footer",
      end: "top top",
      onEnter: () => setBg(verde),
      onEnterBack: () => setBg(verde),
      onLeaveBack: () => setBg(blu),
      invalidateOnRefresh: true,
    });

    /* ---------------------------------------------------
       ✅ 3) FOOTER: nero (e quando risali torna verde)
    --------------------------------------------------- */
    ScrollTrigger.create({
      id: "bg-range-footer",
      trigger: "#footer",
      start: "top 70%",
      onEnter: () => setBg(nero),
      onEnterBack: () => setBg(nero),
      onLeaveBack: () => setBg(verde),
      invalidateOnRefresh: true,
    });


    requestAnimationFrame(() =>
      requestAnimationFrame(() => ScrollTrigger.refresh())
    );

    let resizeRaf = 0;

    const safeRefresh = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    // ricalcolo qui (dentro l'effect) così è coerente con i trigger
    const isMobileNow = window.matchMedia("(max-width: 720px)").matches;

    if (!isMobileNow) {
      // ✅ Desktop: ok refresh su resize
      window.addEventListener("resize", safeRefresh, { passive: true });
    } else {
      // ✅ Mobile: NO resize (iOS/Android lo triggerano anche mentre scrolli)
      window.addEventListener("orientationchange", safeRefresh, { passive: true });
    }

    return () => {
      if (!isMobileNow) {
        window.removeEventListener("resize", safeRefresh);
      } else {
        window.removeEventListener("orientationchange", safeRefresh);
      }

      cancelAnimationFrame(resizeRaf);

      ScrollTrigger.getById("bg-siamo-to-facciamo")?.kill(true);
      ScrollTrigger.getById("bg-facciamo-to-human")?.kill(true);
      ScrollTrigger.getById("bg-human-to-footer")?.kill(true);
      ScrollTrigger.getById("bg-scrub-siamo-facciamo")?.kill(true);
      ScrollTrigger.getById("bg-range-human")?.kill(true);
      ScrollTrigger.getById("bg-range-footer")?.kill(true);
    };
  }, []);

  return (
    <>
      <div className="appShell">
        <div className="bgLayer" aria-hidden="true" />
        <Navbar />

        <main>
          <Hero
            id="top"
            src={heroImg}
            alt="Hero"
            title={
              <>
                comunicare
                <br />è un gioco di parole
              </>
            }
            durationPx={900}
          />

          <Siamo
            id="siamo"
            kicker="Siamo"
            title="Visione e metodo, analisi e strategia."
            paragraphs={[
              "Spin Factor è una società attiva dal 2017 nel settore della comunicazione e della consulenza politica e istituzionale. Un team con competenze complementari per costruire identità, creare connessioni e sviluppare posizionamenti strategici.",
              "Approccio integrato e metodo sartoriale: dall’analisi di scenario alla definizione strategica, fino all’esecuzione coerente e misurabile.",
            ]}
            durationPx={1000}
          />

          <Facciamo
            id="facciamo"
            kicker="Facciamo"
            title="Dal dato alla strategia."
            paragraphs={[
              "Il nostro è un processo integrato e innovativo che attuiamo con cura sartoriale sui progetti che scegliamo di seguire.",
              "Le nostre proposte strategiche partono dall’analisi dei dati reali, geolocalizzati e targettizzati. Grazie a Human, la nostra esclusiva piattaforma di web e social listening, otteniamo una fotografia della situazione attuale e sviluppiamo gli scenari a breve e lungo termine. Su questa base elaboriamo strategie di posizionamento mirate che vengono successivamente declinate in piani di comunicazione integrata. Monitoriamo costantemente la reputazione e gli stati di avanzamento dei progetti.",
            ]}
          />

          <Human
            paragraphs={[
              "Human è la nostra piattaforma esclusiva di web e social listening, sviluppata con Osservatorio Social.",
              "Monitora performance, trend e topic, misurando sentiment e reputation per individuare insight utili e tempestivi.",
              "Gli indicatori sono segmentati per area geografica, demografia e interessi. I nostri Data Analyst interpretano i risultati e li trasformano in decisioni di posizionamento.",
              "Un servizio di analisi e monitoraggio su misura, costruito sulle tue priorità.",
            ]}
          />

          <Footer
            facebookHref="#"
            xHref="#"
            privacyHref="/privacy-policy"
            cookieHref="/cookie-policy"
          />
        </main>
      </div>

      {open && <CookieNotice onAccept={accept} />}
    </>
  );
}
