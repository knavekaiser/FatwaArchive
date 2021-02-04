import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  Suspense,
  lazy,
} from "react";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import { IntlProvider } from "react-intl";
import LandingPage from "./components/LandingPage";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FourOFour from "./components/FourOFour";
import SearchResult from "./components/SearchResult";
import Fatwa from "./components/Fatwa";
import About from "./components/About";
import {
  SourceLogin,
  JamiaRegister,
  AdminLogin,
  PassRecovery,
  BugReportForm,
} from "./components/Forms";
import UserQuestion from "./components/UserSubmitions";
import TableOfContent from "./components/TableOfContent";
import { SiteContext } from "./Context";
import Enlish from "./language/en-US.json";
import Bangali from "./language/bn-BD.json";
import "./App.min.css";
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const JamiaProfile = lazy(() => import("./components/JamiaProfile"));

function App() {
  const { setUser, setIsAuthenticated } = useContext(SiteContext);
  const { locale, setLocale } = useContext(SiteContext);
  const history = useHistory();
  const link = useRef(window.location.href.replace(window.location.origin, ""));
  const setLan = () => {
    if (history.location.pathname.startsWith("/fatwa/")) {
      let path = history.location.pathname.replace("/fatwa/", "");
      let engChar = (path.match(/[a-z0-9]/gi) || []).length;
      if (engChar > path.length / 2) {
        setLocale("en-US");
      }
    }
  };
  const seeIfLoggedIn = () => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setIsAuthenticated(data.isAuthenticated);
          setUser(data.user);
          history.push(link.current);
        }
      })
      .catch((err) => 69);
  };
  useEffect(setLan, []);
  useEffect(seeIfLoggedIn, []);
  const [messages, setMessages] = useState(null);
  useEffect(() => setMessages(locale === "bn-BD" ? Bangali : Enlish), [locale]);
  return (
    <IntlProvider locale={locale} messages={messages} onError={() => 1}>
      <div className="App">
        <Route path="/" component={Nav} />
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/moblieSearch" component={LandingPage} />
          <Route path="/search">
            {(props) => {
              const url = window.location.href.replace(
                window.location.origin,
                ""
              );
              if (url.match(/^\/search\?q=.+&page=\d+$/)) {
                return <SearchResult />;
              } else {
                return <Redirect to="/" />;
              }
            }}
          </Route>
          <Route path="/fatwa/:id" component={Fatwa} />
          <Route path="/about" component={About} />
          <Route path="/login" component={SourceLogin} />
          <Route path="/passwordRecovery" component={PassRecovery} />
          <Route path="/adminLogin" component={AdminLogin} />
          <Route path="/register" component={JamiaRegister} />
          <Route path="/askQuestion" component={UserQuestion} />
          <Route
            path="/source"
            render={() => (
              <Suspense fallback={<div>Loading...</div>}>
                <JamiaProfile />
              </Suspense>
            )}
          />
          <Route
            path="/admin"
            render={() => (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminPanel />
              </Suspense>
            )}
          />
          <Route path="/tableOfContent" component={TableOfContent} />
          <Route path="/bugReport" component={BugReportForm} />
          <Route path="/" component={FourOFour} />
        </Switch>
        <Route path={/^\/(?!admin)(?!source)/} component={Footer} />
      </div>
    </IntlProvider>
  );
}

export default App;
