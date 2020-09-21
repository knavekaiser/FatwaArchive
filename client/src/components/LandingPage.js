import React from "react";
import "./CSS/LandingPage.min.css";
import Searchbar from "./Searchbar";

function LandingPage() {
  return (
    <div className="main landingPage">
      <div className="content">
        <h1 className="siteTitle">أرشيف الفتوى</h1>
        <Searchbar />
      </div>
    </div>
  );
}

export default LandingPage;
