import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Provider } from "./Context";
import App from "./App";

ReactDOM.render(
  <Provider>
    <BrowserRouter>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Fatwa Archive</title>
        <meta
          name="description"
          content="Fatwa Archive is the place to look for answers, when you need it most."
        />
      </Helmet>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
