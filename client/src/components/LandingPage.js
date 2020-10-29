import React, { useState } from "react";
import "./CSS/LandingPage.min.css";
import Searchbar from "./Searchbar";
import logo from "../logo.svg";
import { $ } from "./FormElements";

function LandingPage() {
  const [fullscreenSearch, setFullscreenSearch] = useState(false);
  function handleFocus() {
    if (window.innerWidth <= 480) {
      setFullscreenSearch(true);
      setTimeout(() => $(".fullscreenSearch #searchbar input").focus(), 50);
    }
  }
  return (
    <div className="main landingPage">
      <div className="content">
        <img className="logo" src={logo} alt="Fatwa Archive logo" />
        <Searchbar key="destopLandingPageSearchbar" onFocus={handleFocus} />
      </div>
      {fullscreenSearch && (
        <div className="fullscreenSearch">
          <Searchbar key="mobileLandingPageSearchbar">
            <div className="back" onClick={() => setFullscreenSearch(false)}>
              <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
          </Searchbar>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
