// import Navbar from "./components/Navbar/Navbar";
// // import Hero from "./components/Hero/Hero";
// import Hero from "./components/Hero/Hero";
// import heroImg from "./assets/hero.jpg";
// // import PinReadSection from "./components/PinReadSection/PinReadSection";
// import Siamo from "./components/Siamo/Siamo";
// import HorizontalCardsSection from "./components/HorizontalCardsSection/HorizontalCardsSection";
// import Footer from "./components/Footer/Footer";
// import { useEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// function useHashSafeLoad() {
//   useEffect(() => {
//     const hash = window.location.hash;

//     // Se arrivi con #qualcosa: evita che il browser scrolli prima del pin
//     if (hash) {
//       // togli hash senza ricaricare
//       history.replaceState(
//         null,
//         "",
//         window.location.pathname + window.location.search
//       );
//       window.scrollTo(0, 0);

//       // se vuoi comunque andare alla sezione dopo init:
//       requestAnimationFrame(() => {
//         requestAnimationFrame(() => {
//           const el = document.getElementById(hash.replace("#", ""));
//           if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//         });
//       });
//     }
//   }, []);
// }

// export default function App() {
//   useEffect(() => {
//     requestAnimationFrame(() => ScrollTrigger.refresh());
//   }, []);

//   useHashSafeLoad();
//   return (
//     <div className="app">
//       <Navbar />

//       <main>
//         {/* <Hero /> */}
//         <Hero
//           src={heroImg}
//           alt="Hero"
//           title="comunicare è un gioco di parole"
//           durationPx={900} // prova 750, 900, 1100
//         />

//         <Siamo
//   id="siamo"
//   kicker="Siamo"
//   title="Visione e metodo, analisi e strategia."
//   paragraphs={[
//     "Spin Factor è una società attiva dal 2017 nel settore della comunicazione e della consulenza politica e istituzionale. Un team con competenze complementari per costruire identità, creare connessioni e sviluppare posizionamenti strategici.",
//     "Approccio integrato e metodo sartoriale: dall’analisi di scenario alla definizione strategica, fino all’esecuzione coerente e misurabile.",
//   ]}
//   durationPx={1000}
// />

//         <HorizontalCardsSection
//           id="facciamo"
//           kicker="Facciamo"
//           title="Dall’analisi alla strategia, fino all’esecuzione."
//           introParagraphs={[
//             "Sviluppiamo analisi di contesto personalizzate per fotografare il percepito attuale, identificare l’evoluzione dello scenario e definire la strategia più adatta per raggiungere gli obiettivi condivisi.",
//           ]}
//           cards={[
//             {
//               eyebrow: "01",
//               title: "Analisi scenario",
//               text: "Mappatura attenta e targetizzata delle discussioni online, comprensiva di sentiment analysis e analisi semantica.",
//             },
//             {
//               eyebrow: "02",
//               title: "Posizionamento strategico",
//               text: "Analisi di contesto e definizione della strategia più adatta per raggiungere gli obiettivi condivisi.",
//             },
//             {
//               eyebrow: "03",
//               title: "Piani di comunicazione integrata",
//               text: "Piani digitali integrati, relazioni media, creatività e declinazioni coerenti con il posizionamento.",
//             },
//           ]}
//         />

//         <HorizontalCardsSection
//           id="human"
//           kicker="Human"
//           title="Ascolto, monitoraggio, sintesi: dati che diventano decisioni."
//           introParagraphs={[
//             "Con la piattaforma Human® otteniamo una mappatura delle discussioni online con sentiment analysis e analisi semantica.",
//             "Forniamo report e sintesi delle analisi con elaborazione dei dati e spunti strategici curati da professionisti.",
//           ]}
//           cards={[
//             {
//               eyebrow: "A",
//               title: "Web & Social Listening",
//               text: "Mappatura targetizzata delle discussioni online con sentiment e semantica.",
//             },
//             {
//               eyebrow: "B",
//               title: "Monitoraggio digitale",
//               text: "Report, sintesi e insight strategici a partire dai dati raccolti.",
//             },
//             {
//               eyebrow: "C",
//               title: "Monitoraggio stampa",
//               text: "Analisi qualitativa e quantitativa della rassegna, integrata ai dati digitali.",
//             },
//           ]}
//         />

//         <Footer id="contatti" />
//       </main>
//     </div>
//   );
// }

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./debugScroll.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import heroImg from "./assets/hero.jpg";

import Siamo from "./components/Siamo/Siamo";
import Facciamo from "./components/Facciamo/Facciamo";

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
  const didFirstRefresh = useRef(false);

  useLayoutEffect(() => {
    // ✅ BG scroll-driven (Siamo -> Facciamo)
    const rootEl = document.documentElement;

    // leggo il “nero” dal tuo token (se non c’è, fallback #000)
    const siamoBg =
      getComputedStyle(rootEl).getPropertyValue("--bg").trim() || "#000";
    const facciamoBg = "#101327";

    // variabile css globale
    gsap.set(rootEl, { "--pageBg": siamoBg });

    ScrollTrigger.getById("bg-siamo-to-facciamo")?.kill(true);

    ScrollTrigger.create({
      id: "bg-siamo-to-facciamo",
      trigger: "#facciamo",
      start: "top bottom", // inizia quando facciamo entra
      end: "top top", // finisce quando facciamo arriva in alto
      scrub: true,
      animation: gsap.to(rootEl, { "--pageBg": facciamoBg, ease: "none" }),
    });

    // ✅ UN SOLO refresh “serio” dopo mount (doppio RAF)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
        didFirstRefresh.current = true;
      });
    });

    // ✅ refresh al resize
    const onResize = () => ScrollTrigger.refresh(true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getById("bg-siamo-to-facciamo")?.kill(true);
    };
  }, []);

  return (
    <div className="appShell">
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

        <HumanDebug />
        <FooterPlaceholder />
      </main>
    </div>
  );
}
