import React, { useEffect, useState, useContext } from "react";
import { Link, Route, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import { OutsideClick } from "./TableElements";
import "./CSS/Nav.min.css";
import Searchbar from "./Searchbar";
import logo from "../logo.svg";
import { FormattedMessage } from "react-intl";

function Avatar() {
  const { locale, user, setUser, setIsAuthenticated } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const history = useHistory();
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
    <li className="avatar" onClick={() => setOpen(true)}>
      {user.role === "admin" ? (
        <ion-icon name="shield-outline"></ion-icon>
      ) : (
        <ion-icon name="people-circle-outline"></ion-icon>
      )}

      {open && (
        <OutsideClick open={open} setOpen={setOpen}>
          <ul
            className="avatarOptions"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <li>
              <Link to={`/${user.role === "admin" ? "admin" : "source"}/fatwa`}>
                <FormattedMessage id="dashboard" defaultMessage="Dashboard" />
              </Link>
            </li>
            <li onClick={logout}>
              <a>
                <FormattedMessage id="logout" defaultMessage="logout" />
              </a>
            </li>
          </ul>
        </OutsideClick>
      )}
    </li>
  );
}

function Nav({ location }) {
  const history = useHistory();
  const { sidebarSize, setSidebarSize } = useContext(SiteContext);
  const [style, setStyle] = useState({ boxShadow: "none" });
  const [showSearchbar, setShowSearchbar] = useState(true);
  const { user } = useContext(SiteContext);
  useEffect(() => {
    if (
      location.pathname.startsWith("/moblieSearch") ||
      location.pathname.startsWith("/source") ||
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/register") ||
      location.pathname.startsWith("/passwordRecovery")
    ) {
      setShowSearchbar(false);
    } else {
      setShowSearchbar(true);
    }
    if (location.pathname === "/") {
      setStyle({ boxShadow: "none" });
    } else {
      setStyle({ boxShadow: "0 5px 5px rgba(0,0,0,0.05)" });
    }
  }, [location, showSearchbar]);
  function toggleSidebar() {
    sidebarSize === "full" ? setSidebarSize("mini") : setSidebarSize("full");
  }
  return (
    <div style={style} className={`navbar ${!showSearchbar ? "mini" : ""}`}>
      <Route
        path="/admin"
        render={() => (
          <div className="sidebarToggleBtn">
            <ion-icon onClick={toggleSidebar} name="menu-outline"></ion-icon>
          </div>
        )}
      />
      <Route
        path="/source"
        render={() => (
          <div className="sidebarToggleBtn">
            <ion-icon onClick={toggleSidebar} name="menu-outline"></ion-icon>
          </div>
        )}
      />
      <Route path="/:other">
        <Link className="navLogo" to="/">
          <img src={logo} alt="Fatwa Archive logo" />
        </Link>
        {showSearchbar && <Searchbar key="navSearch" />}
      </Route>
      <nav>
        <ul>
          {user ? (
            <Avatar />
          ) : (
            <>
              {!(history.location.pathname === "/login") && (
                <li>
                  <Link to="/login">
                    <FormattedMessage id="login" defaultMessage="Login" />
                  </Link>
                </li>
              )}
              {!(history.location.pathname === "/register") && (
                <li>
                  <Link to="/register">
                    <FormattedMessage id="register" defaultMessage="Register" />
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Nav;
