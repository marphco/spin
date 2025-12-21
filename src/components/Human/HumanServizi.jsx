import React, { useMemo } from "react";
import "./HumanServizi.css";

function IconPulse() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="humSvcIconSvg">
      <path d="M4 13h3l2-6 4 14 2-8h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="humSvcIconSvg">
      <path d="M7 3h7l3 3v15H7V3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 3v4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 11h6M9 15h6M9 19h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function HumanServizi({ items }) {
  const data = useMemo(
    () =>
      items ?? [
       {
  title: "Sentiment Analysis",
  text:
    "Analizziamo il parlato del web per capire come viene percepito un brand, un tema o una persona.\n\nCommenti, post, articoli, recensioni e reaction vengono interpretati per individuare emozioni, orientamenti e dinamiche che guidano le conversazioni.\n\nIl sentiment rivela fiducia, credibilità, interesse e reputazione, mostrando non solo cosa si dice, ma come e perché lo si dice.",
  icon: <IconPulse />,
},
{
  title: "Report",
  text:
    "I report trasformano i dati in una visione chiara e utilizzabile.\n\nMostrano l’evoluzione delle conversazioni, le performance dei canali analizzati e la struttura emotiva del dibattito online.\n\nGrazie a modelli di Intelligenza Artificiale, l’analisi può concentrarsi su temi o hashtag specifici, restituendo insight quantitativi e qualitativi sulla reale percezione della rete.",
  icon: <IconDoc />,
},

      ],
    [items]
  );

  // utility: trasforma \n e bullet in righe
  const renderText = (t) =>
    t.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} style={{ height: 10 }} />;
      if (trimmed.startsWith("•")) return <div key={i} className="humSvcBullet">{trimmed}</div>;
      return <p key={i} className="humSvcP">{trimmed}</p>;
    });

  return (
    <div className="humSvcPanel" data-hserviceswrap>
      <div className="humSvcWrap">
        {data.map((it) => (
          <article key={it.title} className="humSvcItem" data-hservice>
            <div className="humSvcIcon" aria-hidden="true">
              {it.icon}
            </div>
            <div className="humSvcBody">
              <h3 className="humSvcTitle">{it.title}</h3>
              <div className="humSvcText">{renderText(it.text)}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
