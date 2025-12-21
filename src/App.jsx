import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./debugScroll.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import heroImg from "./assets/hero.jpg";

import Siamo from "./components/Siamo/Siamo";
import Facciamo from "./components/Facciamo/Facciamo";
import Human from "./components/Human/Human";

gsap.registerPlugin(ScrollTrigger);

function HumanDebug() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.getById("human-pin")?.kill(true);

      const track = root.querySelector(".hTrack");
      const panels = gsap.utils.toArray(root.querySelectorAll(".hPanel"));

      gsap.set(track, { width: `${panels.length * 100}vw` });

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          id: "human-pin",
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerWidth * (panels.length - 1)}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dbgSection dbgHuman" id="human" ref={rootRef}>
      <div className="hViewport">
        <div className="hTrack">
          <div className="hPanel h0">HUMAN</div>
          <div className="hPanel h1">Sentiment Analysis</div>
          <div className="hPanel h2">Report</div>
        </div>
      </div>
    </section>
  );
}

function FooterPlaceholder() {
  return (
    <section className="dbgSection dbgFooter" id="footer">
      <div className="dbgLabel">FOOTER</div>
    </section>
  );
}

export default function App() {
  useLayoutEffect(() => {
    const rootEl = document.documentElement;

    const nero =
      getComputedStyle(rootEl).getPropertyValue("--bg").trim() || "#010101";

    const blu = "#0b1320"; // Facciamo
    const verde = "#02291fff"; // Human

    gsap.set(rootEl, { "--pageBg": nero });

    ScrollTrigger.getById("bg-siamo-to-facciamo")?.kill(true);
    ScrollTrigger.getById("bg-facciamo-to-human")?.kill(true);

    // 1) Siamo -> Facciamo (nero -> blu)
    const animSiamoFacciamo = gsap.fromTo(
      rootEl,
      { "--pageBg": nero },
      { "--pageBg": blu, ease: "none", immediateRender: false }
    );

    ScrollTrigger.create({
      id: "bg-siamo-to-facciamo",
      trigger: "#facciamo",
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: animSiamoFacciamo,
      invalidateOnRefresh: true,
    });

    // 2) Facciamo -> Human (blu -> verde)  ✅ IDENTICO identico
    const animFacciamoHuman = gsap.fromTo(
      rootEl,
      { "--pageBg": nero },
      { "--pageBg": verde, ease: "none", immediateRender: false }
    );

    ScrollTrigger.create({
      id: "bg-facciamo-to-human",
      trigger: "#human",
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: animFacciamoHuman,
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
    };
  }, []);

  return (
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

        <FooterPlaceholder />
      </main>
    </div>
  );
}
