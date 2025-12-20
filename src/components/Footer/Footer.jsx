import React from "react";

export default function Footer({ id = "contatti" }) {
  return (
    <footer className="section footer" id={id}>
      <div className="container footer__inner">
        <div className="kicker">Contatti</div>
        <h2 className="footer__title">Parliamone.</h2>

        <div className="footer__grid">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <label className="field">
              <span>Nome</span>
              <input placeholder="Nome e cognome" />
            </label>
            <label className="field">
              <span>Email</span>
              <input placeholder="nome@azienda.it" />
            </label>
            <label className="field">
              <span>Messaggio</span>
              <textarea placeholder="Scrivi qui…" rows={5} />
            </label>
            <button className="btn" type="submit">
              Invia (demo)
            </button>
            <p className="tiny">
              Cliccando “Invia” accetti Privacy e Cookie (demo).
            </p>
          </form>

          <div className="footer__info">
            <div className="infoCard">
              <div className="infoTitle">Sedi</div>
              <div className="infoText">Via della Scrofa, 117 – 00186 Roma</div>
              <div className="infoText">Via Bertini, 7 – 20154 Milano</div>
            </div>

            <div className="infoCard">
              <div className="infoTitle">Email</div>
              <div className="infoText">segreteria@spinfactor.it</div>
            </div>

            <div className="infoCard">
              <div className="infoTitle">Legal</div>
              <div className="infoText">Copyright</div>
              <div className="infoText">Privacy Policy</div>
              <div className="infoText">Cookie Policy</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
