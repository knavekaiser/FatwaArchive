import React, { useEffect, useState, useContext } from "react";
import { Link, Route, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import { Actions } from "./TableElements";
import "./CSS/Nav.min.css";
import Searchbar from "./Searchbar";
import logo from "../logo.svg";

function Avatar() {
  const { locale, user, setUser, setIsAuthenticated } = useContext(SiteContext);
  const history = useHistory();
  function showDashboard() {
    history.push("/admin/jamia");
  }
  function logout() {
    fetch("/api/logout")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setIsAuthenticated(data.isAuthenticated);
        history.push("/");
      });
  }
  return (
    <li className="avatar">
      {user.role === "jamia" && user.name[locale].slice(0, 1)}
      {user.role === "admin" && user.firstName.slice(0, 1)}
      <Actions
        id="avatarActions"
        actions={[
          { option: "Dashboard", action: showDashboard },
          { option: "Logout", action: logout },
        ]}
      />
    </li>
  );
}

function Nav({ location }) {
  const history = useHistory();
  const [style, setStyle] = useState({ boxShadow: "none" });
  const [showSearchbar, setShowSearchbar] = useState(true);
  const {
    lan,
    setLan,
    locale,
    setLocale,
    user,
    setUser,
    setIsAuthenticated,
  } = useContext(SiteContext);
  useEffect(() => {
    if (
      location.pathname.startsWith("/about") ||
      location.pathname.startsWith("/jamia") ||
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/register")
    ) {
      setShowSearchbar(false);
    } else {
      !showSearchbar && setShowSearchbar(true);
    }
    if (location.pathname === "/") {
      setStyle({ boxShadow: "none" });
    } else {
      setStyle({ boxShadow: "0 5px 5px rgba(0,0,0,0.05)" });
    }
  }, [location, showSearchbar]);
  return (
    <div style={style} className={`navbar ${setShowSearchbar ? "mini" : ""}`}>
      <Route
        path="/:other"
        render={() => (
          <>
            <Link to="/">
              <img className="logo" src={logo} alt="Fatwa Archive logo" />
            </Link>
            {showSearchbar && <Searchbar />}
          </>
        )}
      />
      <nav>
        <ul>
          {user ? (
            <Avatar />
          ) : (
            <>
              {!(history.location.pathname === "/login") && (
                <li>
                  <Link to="/login">LOGIN</Link>
                </li>
              )}
              {!(history.location.pathname === "/register") && (
                <li>
                  <Link to="/register">REGISTER</Link>
                </li>
              )}
            </>
          )}
          <li
            onClick={() => {
              lan === "bn" ? setLan("en") : setLan("bn");
              locale === "bn-BD" ? setLocale("en-US") : setLocale("bn-BD");
            }}
          >
            {locale === "bn-BD" ? "BN" : "EN"}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;
