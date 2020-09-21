import React from "react";
import "./CSS/Footer.min.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <ul>
        <li>
          <Link to="/desclaimer">Desclaimer</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/table_of_content">Table of content</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
    </div>
  );
}

export default Footer;
