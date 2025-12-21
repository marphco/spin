import React from "react";
import "./Footer.css";

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ftIcon">
      <path
        d="M4 7.5h16v9H4v-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 8l7.5 6 7.5-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ftIcon">
      <path
        d="M12 21s7-5.4 7-11.1A7 7 0 0 0 5 9.9C5 15.6 12 21 12 21Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="9.9"
        r="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ftIcon">
      <path
        d="M7 3.8h7.5L19.5 8v12.2H7V3.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 3.8V8H19.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ftSocialIcon">
      <path
        d="M14 8.5h2V6h-2c-2 0-3.5 1.5-3.5 3.5V12H8v2.5h2.5V20H13v-5.5h2.5L16 12h-3V9.8c0-.7.3-1.3 1-1.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ftSocialIcon">
      <path
        d="M18.7 4H15.8l-4 5.1L8.5 4H4.2l5.6 8.2L4 20h2.9l4.3-5.6L15.1 20h4.3l-6-8.7L18.7 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer({
  company = "Spin Factor s.r.l.",
  email = "info@spinfactor.it",
  sedePrincipale = ["Sede Principale", "via della Scrofa, 17 – 00186 Roma"],
  sedeLegale = ["Sede Legale", "via Vittoria Colonna, 14 – 80121 Napoli"],
  piva = "08521911217",
  privacyHref = "/privacy-policy",
  cookieHref = "/cookie-policy",
  facebookHref = "#",
  xHref = "#",
}) {
  return (
    <footer className="ftSection" id="footer">
      <div className="ftInner">
        <div className="ftGrid">
          {/* COL 1 */}
          <div className="ftCol">
            <div className="ftBrand">{company}</div>
            <p className="ftTagline">
              Costruiamo posizionamenti che resistono al rumore.
            </p>

            <div className="ftMeta">
              <span className="ftMetaLabel">© {new Date().getFullYear()}</span>
              <span className="ftMetaSep">·</span>
              <span className="ftMetaLabel">All rights reserved</span>
            </div>
          </div>

          {/* COL 2 */}
          <div className="ftCol">
            <div className="ftTitle">Contatti</div>

            <a className="ftRow" href={`mailto:${email}`}>
              <span className="ftRowIcon">
                <IconMail />
              </span>
              <span className="ftRowText">{email}</span>
            </a>

            <div className="ftRow ftRowStatic">
              <span className="ftRowIcon">
                <IconPin />
              </span>
              <span className="ftRowText">
                <strong>{sedePrincipale[0]}</strong>
                <span className="ftSub">{sedePrincipale[1]}</span>

                <strong className="ftStrong2">{sedeLegale[0]}</strong>
                <span className="ftSub">{sedeLegale[1]}</span>
              </span>
            </div>
          </div>

          {/* COL 3 */}
          <div className="ftCol">
            <div className="ftTitle">Legale</div>

            <div className="ftRow ftRowStatic">
              <span className="ftRowIcon">
                <IconDoc />
              </span>
              <span className="ftRowText">
                <strong>P. IVA</strong>
                <span className="ftSub">{piva}</span>
              </span>
            </div>

            <div className="ftSocial">
              <a className="ftSocialBtn" href={facebookHref} aria-label="Facebook">
                <IconFacebook />
              </a>
              <a className="ftSocialBtn" href={xHref} aria-label="X">
                <IconX />
              </a>
            </div>
          </div>
        </div>

        {/* bottom links (sotto a tutto) */}
        <div className="ftBottom">
          <a className="ftLegalLink" href={privacyHref}>
            Privacy Policy
          </a>
          <span className="ftBottomSep">·</span>
          <a className="ftLegalLink" href={cookieHref}>
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
