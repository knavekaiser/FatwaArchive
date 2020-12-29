import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Provider, SiteContext } from "./Context";
import App from "./App";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, reported: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        err: error.name,
        message: error.message,
        dscr: errorInfo,
      }),
    };
    fetch("/api/bugReportAuto", options)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          this.reported = true;
        }
      });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="deathPage">
          <div className="content">
            <ion-icon name="skull-outline"></ion-icon>
            <h2>Oops.</h2>
            <a href="/">
              <ion-icon name="refresh-outline"></ion-icon>
            </a>
            {this.reported && <p>successfully reported</p>}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContainer() {
  const { locale } = useContext(SiteContext);
  return (
    <BrowserRouter>
      <Helmet htmlAttributes={{ lang: locale.slice(0, 2) }}>
        <meta charSet="utf-8" />
        <title>Fatwa Archive</title>
        <meta
          name="description"
          content="Fatwa Archive is potentially the largest Fatwa aggregation website in Bangladesh. Find what you need from our gigantic library. or as your own question and our Fatwa department will be happy to answer your question."
        />
      </Helmet>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <Provider>
    <AppContainer />
  </Provider>,
  document.getElementById("root")
);
