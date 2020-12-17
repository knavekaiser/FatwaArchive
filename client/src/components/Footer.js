import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import "./CSS/Footer.min.css";
import { SiteContext } from "../Context";
import { Link } from "react-router-dom";

function Footer() {
  const { user, locale, setLocale } = useContext(SiteContext);
  return (
    <div className="footer">
      <ul className="links">
        <li>
          <Link to="/about">
            <FormattedMessage id="about" defaultMessage="About" />
          </Link>
        </li>
        <li>
          <Link to="/askQuestion">
            <FormattedMessage id="askFatwa" defaultMessage="Ask Fatwa" />
          </Link>
        </li>
        {user === null && (
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        )}
        <li
          onClick={() => {
            locale === "bn-BD" ? setLocale("en-US") : setLocale("bn-BD");
          }}
        >
          {locale === "en-US" ? <a>বাং</a> : <a>EN</a>}
        </li>
      </ul>
      <ul>
        <li className="copy">&copy; Fatwa Archive</li>
      </ul>
    </div>
  );
}

export default Footer;

// <li>
// <Link to="/desclaimer">Desclaimer</Link>
// </li>
// <li>
// <Link to="/contact">Contact</Link>
// </li>
// <li>
// <Link to="/table_of_content">Table of content</Link>
// </li>
//
