import { Link } from "react-router-dom";
import "./Policies.css";

export default function PrivacyPolicy() {
  return (
    <div className="policyShell">
      <div className="policyPage">
        <header className="policyHeader">
          <div className="policyKicker">Policies</div>
          <h1 className="policyTitle">Privacy Policy</h1>
          <div className="policyUnderline" aria-hidden="true" />
        </header>

        <div className="policyBody">
          <p>
            Ai sensi del Regolamento UE 2016/679 (GDPR), Spin Factor s.r.l.
            informa gli utenti che i dati personali forniti tramite il sito web
            saranno trattati secondo i principi di liceità, correttezza e
            trasparenza.
          </p>

          <h2>Titolare del trattamento</h2>
          <p>
            <strong>Spin Factor s.r.l.</strong>
            <br />
            Email: <a href="mailto:info@spinfactor.it">info@spinfactor.it</a>
          </p>

          <h2>Dati trattati</h2>
          <p>
            Tramite il modulo di contatto possono essere raccolti: nome, email e
            contenuto del messaggio.
          </p>

          <h2>Finalità</h2>
          <p>
            I dati sono trattati esclusivamente per rispondere alle richieste
            inviate dall’utente.
          </p>

          <h2>Base giuridica</h2>
          <p>
            Il trattamento si basa sulla richiesta dell’utente e sull’invio
            volontario del messaggio.
          </p>

          <h2>Conservazione</h2>
          <p>
            I dati sono conservati per il tempo strettamente necessario a gestire
            la richiesta.
          </p>

          <h2>Diritti dell’interessato</h2>
          <p>
            L’utente può esercitare i diritti previsti dagli articoli 15–22 del
            GDPR contattando{" "}
            <a href="mailto:info@spinfactor.it">info@spinfactor.it</a>.
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
