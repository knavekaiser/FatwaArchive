import React from "react";
import "./CSS/LandingPage.min.css";
import Searchbar from "./Searchbar";
import logo from "../logo.svg";

function LandingPage() {
  return (
    <div className="main landingPage">
      <div className="content">
        <img className="logo" src={logo} alt="Fatwa Archive logo" />
        <Searchbar />
      </div>
    </div>
  );
}

export default LandingPage;
