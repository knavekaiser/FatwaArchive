import React, { useEffect, useState, useContext } from "react";
import { Link, Route, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import { OutsideClick } from "./TableElements";
import "./CSS/Nav.min.css";
import Searchbar from "./Searchbar";
import logo from "../logo.svg";

function Avatar() {
  const { locale, user, setUser, setIsAuthenticated } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
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
    <li className="avatar" onClick={() => setOpen(true)}>
      {user.role === "jamia" && user.name[locale].slice(0, 1)}
      {user.role === "admin" && user.firstName.slice(0, 1)}
      {open && (
        <OutsideClick open={open} setOpen={setOpen}>
          <ul className="avatarOptions" onClick={() => setOpen(false)}>
            <li>
              <Link to={`/admin/jamia/active`}>Dashboard</Link>
            </li>
            <li onClick={logout}>Logout</li>
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
  function toggleSidebar() {
    sidebarSize === "full" ? setSidebarSize("mini") : setSidebarSize("full");
  }
  return (
    <div style={style} className={`navbar ${setShowSearchbar ? "mini" : ""}`}>
      <Route
        path="/admin"
        render={() => (
          <div className="sidebarToggleBtn">
            <ion-icon onClick={toggleSidebar} name="menu-outline"></ion-icon>
          </div>
        )}
      />
      <Route
        path="/jamia"
        render={() => (
          <div className="sidebarToggleBtn">
            <ion-icon onClick={toggleSidebar} name="menu-outline"></ion-icon>
          </div>
        )}
      />
      <Route
        path="/:other"
        render={() => (
          <>
            <Link to="/">
              <img className="logo" src={logo} alt="Fatwa Archive logo" />
            </Link>
            {showSearchbar && <Searchbar key="navSearch" />}
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
