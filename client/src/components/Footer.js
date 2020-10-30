import React, { useContext } from "react";
// import { FormattedMessage } from "react-intl";
import "./CSS/Footer.min.css";
import { SiteContext } from "../Context";
import { Link } from "react-router-dom";

function Footer() {
  const { user } = useContext(SiteContext);
  return (
    <div className="footer">
      <ul>
        <li>
          <Link to="/about">About</Link>
        </li>
        {user === null && (
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        )}
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
