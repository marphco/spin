import React, { useMemo } from "react";
import "./HumanServizi.css";

function IconPulse() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="humSvcIconSvg">
      <path
        d="M4 13h3l2-6 4 14 2-8h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="humSvcIconSvg">
      <path
        d="M7 3h7l3 3v15H7V3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v4h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 11h6M9 15h6M9 19h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSemantic() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="humSvcIconSvg">
      <circle cx="7" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8.7 11.1l6.2-3.1M8.7 12.9l6.2 3.1M15.6 8.6v6.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


export default function HumanServizi({ items }) {
  const data = useMemo(
    () =>
      items ?? [
        {
          title: "Sentiment Analysis",
          text: "Capire il clima emotivo. Analizziamo le conversazioni per leggere fiducia, interesse e reputazione. Non solo cosa viene detto, ma come viene percepito.",
          icon: <IconPulse />,
        },
        {
          title: "Analisi semantica",
          text: "Le parole rivelano direzioni. Attraverso modelli linguistici e AI individuiamo temi chiave, concetti emergenti e connessioni nel dibattito online.",
          icon: <IconSemantic />,
        },
        {
          title: "Dati e report",
          text: "Sintesi, non rumore. Trasformiamo grandi volumi di dati in report chiari e periodici, utili a leggere l’evoluzione del contesto e orientare le scelte.",
          icon: <IconDoc />,
        },
      ],
    [items],
  );

  // utility: trasforma \n e bullet in righe
  const renderText = (t) =>
    t.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} style={{ height: 10 }} />;
      if (trimmed.startsWith("•"))
        return (
          <div key={i} className="humSvcBullet">
            {trimmed}
          </div>
        );
      return (
        <p key={i} className="humSvcP">
          {trimmed}
        </p>
      );
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
