import { Link } from "react-router-dom";
import "./Policies.css";

export default function CookiePolicy() {
  return (
    <div className="policyShell">
      <div className="policyPage">
        <header className="policyHeader">
          <div className="policyKicker">Policies</div>
          <h1 className="policyTitle">Cookie Policy</h1>
          <div className="policyUnderline" aria-hidden="true" />
        </header>

        <div className="policyBody">
          <p>
            Questo sito utilizza esclusivamente <strong>cookie tecnici</strong>{" "}
            necessari al corretto funzionamento delle pagine e alla navigazione.
          </p>

          <h2>Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file di testo che i siti visitati inviano al
            dispositivo dell’utente, dove vengono memorizzati per essere poi
            ritrasmessi agli stessi siti alla visita successiva.
          </p>

          <h2>Tipologie di cookie utilizzate</h2>
          <ul>
            <li>
              <strong>Cookie tecnici</strong>: indispensabili per il
              funzionamento del sito.
            </li>
          </ul>

          <p>
            Il sito <strong>non utilizza</strong> cookie di profilazione o cookie
            di terze parti.
          </p>

          <h2>Gestione dei cookie</h2>
          <p>
            Poiché vengono utilizzati esclusivamente cookie tecnici,{" "}
            <strong>non è richiesto il consenso preventivo</strong>. L’utente può
            comunque disabilitare i cookie tramite le impostazioni del proprio
            browser.
          </p>
        </div>

        <div className="policyActions">
          <Link className="policyBackBtn" to="/">
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
}
