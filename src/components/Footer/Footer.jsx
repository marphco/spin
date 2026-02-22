import { useState } from "react";
import "./Footer.css";
import { FaInstagram, FaTiktok, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";


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

export default function Footer({
  company = "Spin Factor s.r.l.",
  email = "segreteria@spinfactor.it",
  sedePrincipale = "via della Scrofa, 117 – 00186 Roma",
  sedeLegale = "via Vittoria Colonna, 14 – 80121 Napoli",
  piva = "08521911217",
  privacyHref = "/privacy-policy",
  cookieHref = "/cookie-policy",

  // ✅ nuovi social
  instagramHref = "https://www.instagram.com/spin.factor?igsh=MWs3azVwd2dodHFlbw==",
  tiktokHref = "https://www.tiktok.com/@spin.factor?_r=1&_t=ZP-92dbyl6XukZ",
  xHref = "https://x.com/SpinFactorIT",
  linkedinHref = "https://www.linkedin.com/company/spinfactor/",
}) {
  const year = new Date().getFullYear();

  const [name, setName] = useState("");
  const [emailField, setEmailField] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot

  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: emailField,
          message,
          company: hp, // honeypot
        }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setStatus("error");
        setErrorMsg(data?.error || "Errore invio. Riprova.");
        return;
      }

      setStatus("ok");
      setName("");
      setEmailField("");
      setMessage("");
      setHp("");
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMsg("Errore di rete. Riprova.");
    }
  };

  return (
    <footer className="ftSection" id="footer">
      <span id="contatti" className="ftAnchor" aria-hidden="true" />
      <div className="ftInner">
        <div className="ftTop">
          <div className="ftHead">
            <div className="ftKicker">Contatti</div>
            <div className="ftUnderline" aria-hidden="true" />
          </div>
          <div className="ftContent">
            {/* LEFT: contatti + dati */}
            <div className="ftLeft">
              <div className="ftBrand">{company}</div>

              <div className="ftRow ftRowStatic">
                <span className="ftRowIcon" aria-hidden="true">
                  <IconMail />
                </span>

                <span className="ftRowText">
                  <a className="ftMailLink" href={`mailto:${email}`}>
                    {email}
                  </a>
                </span>
              </div>



              <div className="ftRow ftRowStatic">
                <span className="ftRowIcon">
                  <IconPin />
                </span>
                <span className="ftRowText">
                  <span className="ftAddrTitle">Sede Principale</span>
                  <span className="ftSub">{sedePrincipale}</span>

                  <span className="ftAddrTitle ftAddrTitle2">Sede Legale</span>
                  <span className="ftSub">{sedeLegale}</span>
                </span>
              </div>

              <div className="ftRow ftRowStatic">
                <span className="ftRowIcon">
                  <IconDoc />
                </span>
                <span className="ftRowText">
                  <span className="ftAddrTitle">P. IVA</span>
                  <span className="ftSub">{piva}</span>
                </span>
              </div>

              {/* ✅ SOCIAL UPDATE */}
              <div className="ftSocial ftSocialLeft">
                <a
                  className="ftSocialBtn"
                  href={instagramHref}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram />
                </a>

                <a
                  className="ftSocialBtn"
                  href={tiktokHref}
                  aria-label="TikTok"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaTiktok />
                </a>

                <a
                  className="ftSocialBtn"
                  href={xHref}
                  aria-label="X"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaXTwitter />
                </a>

                <a
                  className="ftSocialBtn"
                  href={linkedinHref}
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            {/* RIGHT: form */}
            <div className="ftRight">
              <div className="ftRightHead">
                <div className="ftTitle">Scrivici</div>
              </div>

              <form className="ftFormGrid" onSubmit={onSubmit}>
                {/* honeypot (invisibile) */}
                <label className="ftHp" aria-hidden="true">
                  <span>Company</span>
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                  />
                </label>

                <label className="ftField">
                  <span className="ftFieldLabel">Nome</span>
                  <input
                    className="ftInput"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label className="ftField">
                  <span className="ftFieldLabel">Email</span>
                  <input
                    className="ftInput"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={emailField}
                    onChange={(e) => setEmailField(e.target.value)}
                  />
                </label>

                <label className="ftField ftFieldFull">
                  <span className="ftFieldLabel">Messaggio</span>
                  <textarea
                    className="ftTextarea"
                    name="message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>

                <div className="ftConsent">
                  Inviando accetti l’{" "}
                  <a className="ftInlineLink" href={privacyHref}>
                    Informativa Privacy
                  </a>
                  .
                </div>

                <button
                  className="ftBtn"
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Invio..." : "Invia"}
                </button>

                {/* feedback elegante */}
                {status === "ok" && (
                  <div className="ftNotice ftOk">Messaggio inviato.</div>
                )}
                {status === "error" && (
                  <div className="ftNotice ftErr">{errorMsg}</div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="ftBottom">
          <div className="ftCopy">
            © {year} {company} • Tutti i diritti riservati.
          </div>
          <div className="ftPolicies">
            <a className="ftLegalLink" href={privacyHref}>
              Privacy Policy
            </a>
            <span className="ftSep">·</span>
            <a className="ftLegalLink" href={cookieHref}>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
