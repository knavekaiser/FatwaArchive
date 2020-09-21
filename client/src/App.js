import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FourOFour from "./components/FourOFour";
import SearchResult from "./components/SearchResult";
import Fatwa from "./components/Fatwa";
import AdminPanel from "./components/AdminPanel";
import "./App.min.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route path="/" component={Nav} />
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/search" component={SearchResult} />
          <Route path="/fatwa/:id" component={Fatwa} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/" component={FourOFour} />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
