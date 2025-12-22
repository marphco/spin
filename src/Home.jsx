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

    // 1) Siamo -> Facciamo (nero -> blu)
    ScrollTrigger.create({
      id: "bg-siamo-to-facciamo",
      trigger: "#facciamo",
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: gsap.fromTo(
        rootEl,
        { "--pageBg": nero },
        { "--pageBg": blu, ease: "none", immediateRender: false }
      ),
      invalidateOnRefresh: true,
    });

    // 2) Facciamo -> Human (blu -> verde)
    ScrollTrigger.create({
      id: "bg-facciamo-to-human",
      trigger: "#human",
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: gsap.fromTo(
        rootEl,
        { "--pageBg": blu },
        { "--pageBg": verde, ease: "none", immediateRender: false }
      ),
      invalidateOnRefresh: true,
    });

    // 3) Human -> Footer (verde -> nero)
    ScrollTrigger.create({
      id: "bg-human-to-footer",
      trigger: "#footer",
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: gsap.fromTo(
        rootEl,
        { "--pageBg": verde },
        { "--pageBg": nero, ease: "none", immediateRender: false }
      ),
      invalidateOnRefresh: true,
    });

    requestAnimationFrame(() =>
      requestAnimationFrame(() => ScrollTrigger.refresh())
    );

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getById("bg-siamo-to-facciamo")?.kill(true);
      ScrollTrigger.getById("bg-facciamo-to-human")?.kill(true);
      ScrollTrigger.getById("bg-human-to-footer")?.kill(true);
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
            title="comunicare è un gioco di parole"
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
