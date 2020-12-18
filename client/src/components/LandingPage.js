import React from "react";
import { Route } from "react-router";
import "./CSS/LandingPage.min.css";
import Searchbar from "./Searchbar";
import logo from "../logo.svg";
import { $ } from "./FormElements";

function LandingPage({ history }) {
  function handleFocus() {
    if (window.innerWidth <= 480) {
      history.push("/moblieSearch");
      setTimeout(() => $(".fullscreenSearch #searchbar input").focus(), 50);
    }
  }
  return (
    <div className="main landingPage">
      <div className="content">
        <img className="logo" src={logo} alt="Fatwa Archive logo" />
        <Searchbar key="destopLandingPageSearchbar" onFocus={handleFocus} />
      </div>
      <Route path="/moblieSearch">
        <div className="fullscreenSearch">
          <Searchbar key="mobileLandingPageSearchbar">
            <div
              className="back"
              onClick={() => {
                history.push("/");
              }}
            >
              <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
          </Searchbar>
        </div>
      </Route>
    </div>
  );
}

export default LandingPage;
