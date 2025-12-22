import { Link } from "react-router-dom";
import "./Policies.css";

export default function CookieNotice({ onAccept }) {
  return (
    <div
      className="cnWrap"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
    >
      <div className="cnInner">
        <div className="cnText">
          Questo sito utilizza esclusivamente cookie tecnici necessari al
          funzionamento.
          <Link className="cnLink" to="/cookie-policy">
            Cookie Policy
          </Link>
        </div>

        <button className="cnBtn" type="button" onClick={onAccept}>
          OK
        </button>
      </div>
    </div>
  );
}
