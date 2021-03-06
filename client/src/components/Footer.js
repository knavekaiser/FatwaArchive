import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import "./CSS/Footer.min.css";
import { SiteContext } from "../Context";
import { Link } from "react-router-dom";

function Footer() {
  const { user, locale, setLocale } = useContext(SiteContext);
  return (
    <div className="footer">
      <ul
        className="links"
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
      >
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
            <Link to="/adminLogin">
              <FormattedMessage id="admin" defaultMessage="Admin" />
            </Link>
          </li>
        )}
        <li>
          <Link to="/tableOfContent">
            <FormattedMessage id="tableOfContent" />
          </Link>
        </li>
        <li
          onClick={() => {
            locale === "bn-BD" ? setLocale("en-US") : setLocale("bn-BD");
          }}
        >
          {locale === "en-US" ? <a>বাং</a> : <a>EN</a>}
        </li>
        {
          //   <li>
          //   <Link className="bugReport" to="/bugReport">
          //     <ion-icon name="bug-outline"></ion-icon>
          //   </Link>
          // </li>
        }
      </ul>
      <ul>
        <li className="copy">&copy; Fatwa Archive</li>
      </ul>
    </div>
  );
}

export default Footer;
