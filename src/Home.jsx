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
        { "--pageBg": to, ease: "none", immediateRender: false },
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
      requestAnimationFrame(() => ScrollTrigger.refresh()),
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
      window.addEventListener("orientationchange", safeRefresh, {
        passive: true,
      });
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
            // title={<>Hanno<br/>Tutti<br/>Ragione</>}
            durationPx={900}
          />

          <Siamo
            id="siamo"
            kicker="Siamo"
            title="Strategia che prende posizione."
            paragraphs={[
              "Spin Factor lavora nella comunicazione politica e istituzionale. Fondata nel 2017 e guidata da Tiberio Brunetti, affianca organizzazioni e istituzioni nella costruzione di posizionamenti chiari, riconoscibili, difendibili.",
              "Partiamo dai dati. Leggiamo il contesto.",
              "Scegliamo una direzione e la trasformiamo in risultati misurabili.",
            ]}
            durationPx={1000}
          />

          <Facciamo
            id="facciamo"
            kicker="Facciamo"
            title="Un metodo chiaro.
            Dati, strategia, azione."
            paragraphs={[
              "Un metodo chiaro. Dati, strategia, azione. Ascoltiamo il contesto attraverso Human, la nostra piattaforma di web e social listening.",
              "Analizziamo ciò che emerge, definiamo un posizionamento e lo traduciamo in comunicazione integrata.",
              "Monitoriamo tutto: reputazione, performance, impatto. Per capire cosa funziona. E cosa va cambiato.",
            ]}
          />

          <Human
            id="human"
            kicker="HUMAN"
            title="Trasformare l’ascolto in direzione"
            paragraphs={[
              "Human è la piattaforma di web e social listening di Spin Factor, sviluppata con Osservatorio Social. Analizza conversazioni, trend e performance, misura sentiment e reputazione e restituisce insight chiari e utilizzabili.",
              "I dati sono segmentati per area geografica, profili e interessi. I nostri Data Analyst li interpretano e li trasformano in scelte strategiche.",
              "Human non si limita a misurare. Orienta le decisioni.",
            ]}
          />

          <Press id="press" items={PRESS_ITEMS} />

          <Footer
            xHref="https://x.com/SpinFactorIT"
            privacyHref="/privacy-policy"
            cookieHref="/cookie-policy"
          />
        </main>
      </div>

      {open && <CookieNotice onAccept={accept} />}
    </>
  );
}
