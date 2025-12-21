import React, { useMemo } from "react";
import "./FacciamoServizi.css";

function IconRadar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="facSvcIconSvg">
      <path d="M12 3a9 9 0 1 0 9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 7a5 5 0 1 0 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 12l6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function IconCompass() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="facSvcIconSvg">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14.8 9.2l-1.7 5.6-5.6 1.7 1.7-5.6 5.6-1.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 3v2M21 12h-2M12 21v-2M3 12h2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="facSvcIconSvg">
      <path d="M12 4 3 9l9 5 9-5-9-5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 13l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 17l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function FacciamoServizi({ items }) {
  // se non passi items, usa quelli di default
  const data = useMemo(
    () =>
      items ?? [
        {
          title: "Analisi scenario",
          text:
            "Mappiamo conversazioni, community e temi caldi con ascolto web e social. Leggiamo sentiment, volumi e linguaggio per capire cosa sta succedendo davvero — e dove si sposta l’attenzione.",
          icon: <IconRadar />,
        },
        {
          title: "Posizionamento strategico",
          text:
            "Traduciamo i dati in una direzione chiara: narrativa, tono e priorità. Definiamo messaggi e target, scegliamo il campo di gioco e costruiamo un posizionamento coerente, riconoscibile e difendibile.",
          icon: <IconCompass />,
        },
        {
          title: "Comunicazione integrata",
          text:
            "Portiamo la strategia a terra con un piano operativo: canali, timing e formati. Creatività e declinazioni lavorano insieme, mentre monitoriamo performance e reputazione per correggere la rotta in tempo reale.",
          icon: <IconLayers />,
        },
      ],
    [items]
  );

  return (
    <div className="facSvcPanel" data-serviceswrap>
      <div className="facSvcWrap">
        {data.map((it) => (
          <article key={it.title} className="facSvcItem" data-service>
            <div className="facSvcIcon" aria-hidden="true">
              {it.icon}
            </div>
            <div className="facSvcBody">
              <h3 className="facSvcTitle">{it.title}</h3>
              <p className="facSvcText">{it.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
