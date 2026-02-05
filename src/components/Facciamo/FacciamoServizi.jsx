import React, { useMemo } from "react";
import "./FacciamoServizi.css";

/* ICONS */

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

function IconNetwork() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="facSvcIconSvg">
      <circle cx="6" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7.8 11.2l8-3.4M7.8 12.8l8 3.4M16.8 8.9v6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSparkPen() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="facSvcIconSvg">
      <path d="M4 20l4.6-1.2L19 8.4 15.6 5 5.2 15.4 4 20Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13.8 6.8l3.4 3.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 2l1.1 3.2L16 6.3l-2.9 1.1L12 10l-1.1-2.6L8 6.3l2.9-1.1L12 2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconMegaphone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="facSvcIconSvg">
      <path d="M4 11v2c0 1.1.9 2 2 2h2l6 3V6L8 9H6c-1.1 0-2 .9-2 2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 8c1.5 1 2.5 2.4 2.5 4s-1 3-2.5 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 15l1 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconInstitution() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="facSvcIconSvg">
      <path d="M3 10h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 10V20M10 10V20M14 10V20M18 10V20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10l9-6 9 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 20h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCalendarStar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="facSvcIconSvg">
      <path d="M7 3v3M17 3v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 7h16v14H4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 11h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 14l.8 2 2.2.2-1.7 1.4.6 2.1-1.9-1.1-1.9 1.1.6-2.1-1.7-1.4 2.2-.2.8-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FacciamoServizi({ items }) {
  const data = useMemo(
    () =>
      items ?? [
        {
          title: "Web e social listening",
          text:
            "Capire prima degli altri.\nMonitoriamo le conversazioni online in tempo reale e analizziamo sentiment e linguaggi per leggere dinamiche, tensioni e opportunità.",
          icon: <IconRadar />,
        },
        {
          title: "Posizionamento strategico",
          text:
            "Prendere posizione è una scelta.\nAnalizziamo contesto, committenti e competitor per definire priorità, narrativa e campo di gioco. Costruiamo posizionamenti solidi, che reggono nel tempo.",
          icon: <IconCompass />,
        },
        {
          title: "Identità digitale",
          text:
            "Presenza continua, non occasionale.\nContenuti, community e piani digitali integrati, con un controllo costante delle performance per misurare l’efficacia reale.",
          icon: <IconNetwork />,
        },
        {
          title: "Creatività",
          text:
            "La strategia deve farsi riconoscere.\nDiamo forma visiva e verbale ai progetti: identità, visual, naming e claim che parlano con coerenza e carattere.",
          icon: <IconSparkPen />,
        },
        {
          title: "Relazioni con i media",
          text:
            "Le storie contano. Dove e come vengono raccontate, ancora di più.\nCostruiamo narrazioni mirate per media generalisti e di settore, rafforzando reputazione e posizionamento.",
          icon: <IconMegaphone />,
        },
        {
          title: "Relazioni istituzionali",
          text:
            "Relazioni che producono senso.\nLavoriamo con stakeholder e pubblici di riferimento su incontri, eventi e momenti di confronto, dando forza a temi e proposte.",
          icon: <IconInstitution />,
        },
        {
          title: "Eventi",
          text:
            "Gli eventi come spazio di relazione.\nProgettiamo eventi con obiettivi chiari di partecipazione, visibilità ed engagement, seguendo ogni fase del processo.",
          icon: <IconCalendarStar />,
        },
      ],
    [items],
  );

  const page1 = data.slice(0, 4);
  const page2 = data.slice(4);

  const renderText = (t) =>
    t.split("\n").map((line, i) =>
      line ? (
        <p key={i} className="facSvcText">
          {line}
        </p>
      ) : null,
    );

  const renderItem = (it) => (
    <article key={it.title} className="facSvcItem" data-service>
      <div className="facSvcIcon" aria-hidden="true">
        {it.icon}
      </div>
      <div className="facSvcBody">
        <h3 className="facSvcTitle">{it.title}</h3>
        <div className="facSvcTextWrap">{renderText(it.text)}</div>
      </div>
    </article>
  );

  return (
    <div className="facSvcPanel" data-serviceswrap>
      <div className="facSvcScroller">
        <div className="facSvcTrack" data-fservicestrack>
          <div className="facSvcPage" data-fsvcpage="1">
            <div className="facSvcGrid">{page1.map(renderItem)}</div>
          </div>

          <div className="facSvcPage" data-fsvcpage="2">
            <div className="facSvcGrid">{page2.map(renderItem)}</div>
          </div>
        </div>

        <div className="facSvcDots" aria-hidden="true">
          <span className="facSvcDot" />
          <span className="facSvcDot" />
        </div>
      </div>
    </div>
  );
}
