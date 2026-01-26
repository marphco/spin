import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import heroImg from "./assets/hero.jpg";

import Siamo from "./components/Siamo/Siamo";
import Facciamo from "./components/Facciamo/Facciamo";
import Human from "./components/Human/Human";
import Press from "./components/Press/Press";
import Footer from "./components/Footer/Footer";

import CookieNotice from "./components/Policies/CookieNotice.jsx";
import { useCookieNotice } from "./components/Policies/useCookieNotice.js";

import { PRESS_ITEMS } from "./data/pressData";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { open, accept } = useCookieNotice();

  useLayoutEffect(() => {
    const rootEl = document.documentElement;

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      limitCallbacks: true,
    });

    const nero =
      getComputedStyle(rootEl).getPropertyValue("--bg").trim() || "#010101";

    const blu = "#0b1320";
    const verde = "#02291f";
    const offwhite = "#f3f2ee";

    const scrubBg = (from, to) =>
      gsap.fromTo(
        rootEl,
        { "--pageBg": from },
        { "--pageBg": to, ease: "none", immediateRender: false }
      );

    // stato iniziale
    gsap.set(rootEl, { "--pageBg": nero });

    // kill trigger precedenti (solo quelli che usiamo davvero)
    [
      "bg-scrub-siamo-facciamo",
      "bg-scrub-facciamo-human",
      "bg-scrub-human-press",
      "bg-scrub-press-footer",
      "bg-range-human",
      "bg-range-footer",
    ].forEach((id) => ScrollTrigger.getById(id)?.kill(true));

    // 1) SIAMO -> FACCIAMO (nero -> blu)
    ScrollTrigger.create({
      id: "bg-scrub-siamo-facciamo",
      trigger: "#facciamo",
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: scrubBg(nero, blu),
      invalidateOnRefresh: true,
    });

    // 2) FACCIAMO -> HUMAN (blu -> verde)
    ScrollTrigger.create({
      id: "bg-scrub-facciamo-human",
      trigger: "#human",
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: scrubBg(blu, verde),
      invalidateOnRefresh: true,
    });

    // 3) HUMAN -> PRESS (verde -> offwhite)
    ScrollTrigger.create({
      id: "bg-scrub-human-press",
      trigger: "#press",
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: scrubBg(verde, offwhite),
      invalidateOnRefresh: true,
    });

    // 4) PRESS -> FOOTER (offwhite -> nero)
    ScrollTrigger.create({
      id: "bg-scrub-press-footer",
      trigger: "#footer",
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: scrubBg(offwhite, nero),
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

    const isMobileNow = window.matchMedia("(max-width: 720px)").matches;
    if (!isMobileNow) {
      window.addEventListener("resize", safeRefresh, { passive: true });
    } else {
      window.addEventListener("orientationchange", safeRefresh, { passive: true });
    }

    return () => {
      if (!isMobileNow) {
        window.removeEventListener("resize", safeRefresh);
      } else {
        window.removeEventListener("orientationchange", safeRefresh);
      }
      cancelAnimationFrame(resizeRaf);

      [
        "bg-scrub-siamo-facciamo",
        "bg-scrub-facciamo-human",
        "bg-scrub-human-press",
        "bg-scrub-press-footer",
        "bg-range-human",
        "bg-range-footer",
      ].forEach((id) => ScrollTrigger.getById(id)?.kill(true));
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

          <Press id="press" items={PRESS_ITEMS} />

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
