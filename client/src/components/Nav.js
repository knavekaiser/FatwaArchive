import React, { useEffect, useState, useContext } from "react";
import { Link, Route } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/Nav.min.css";
import Searchbar from "./Searchbar";

function Nav({ location }) {
  const [style, setStyle] = useState({ boxShadow: "none" });
  const { lan, setLan } = useContext(SiteContext);
  useEffect(() => {
    if (location.pathname === "/") {
      setStyle({ boxShadow: "none" });
    } else {
      setStyle({ boxShadow: "0 5px 5px rgba(0,0,0,0.05)" });
    }
  }, [location]);
  return (
    <div style={style} className="navbar">
      <Route
        path="/:other"
        render={() => (
          <div className="logoNSearch">
            <Link className="logo" to="/">
              Fatwa Archive
            </Link>
            <Searchbar />
          </div>
        )}
      />
      <div></div>
      <nav>
        <ul>
          <li>{lan}</li>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;

//  lan onClick={() => (lan === "BN" ? setLan("EN") : setLan("BN"))}

// <li>
// <Link to="/signup">SIGN UP</Link>
// </li>
// <li>
// <Link to="/login">LOG IN</Link>
// </li>
