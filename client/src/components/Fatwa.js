import React, { useEffect, Fragment, useState, useContext } from "react";
import { Route, Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/Fatwa.min.css";
import { FormattedNumber, FormattedMessage } from "react-intl";
import { Modal } from "./Modals";
import { Helmet } from "react-helmet";
import { Report } from "./Forms";

function Loading() {
  return (
    <>
      <div className="h1" />
      <div className="ques" />
      <div className="ans" />
    </>
  );
}

function Fatwa({ match }) {
  const { locale } = useContext(SiteContext);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [fatwa, setFatwa] = useState({});
  const [report, setReport] = useState(false);
  const fixUrlOnLocaleChange = () =>
    fatwa.link && history.push(`/fatwa/${fatwa.link[locale]}`);
  useEffect(fixUrlOnLocaleChange, [locale]);
  const abortController = new AbortController();
  const signal = abortController.signal;
  const options = { headers: { "Accept-Language": locale }, signal: signal };
  const closeModal = () => {
    history.push(`/fatwa/${fatwa.link[locale]}`);
  };
  const fetchData = () => {
    fetch(`/api/fatwa/${match.params.id}`, options)
      .then((res) => {
        setLoading(false);
        return res.json();
      })
      .then((data) => {
        setFatwa(data);
      })
      .catch((err) => console.log(err));
    return () => abortController.abort();
  };
  useEffect(fetchData, [match]);
  return (
    <div className={`main fatwa ${loading ? "loading" : ""}`}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{fatwa.title && fatwa.title[locale]}</title>
        <meta
          name="description"
          content={fatwa.ans && fatwa.ans[locale].substring(200)}
        />
      </Helmet>
      {loading ? (
        <Loading />
      ) : fatwa.title ? (
        <>
          <h1>{fatwa.title[locale]}</h1>
          <h4 className="jamia">
            <Link
              title={`Show other fatwas from ${fatwa.source._id}`}
              to={`/jamia/${fatwa.source.name[locale]}`}
            >
              {fatwa.source.name[locale]}
            </Link>
            <br />
            <span>Mohammadpur, Dhaka, Bangladesh</span>
          </h4>
          <br />
          <br />
          <h3>
            <span className="hr" />
            <span className="content">
              <FormattedMessage id="question" defaultMessage="Question" />
            </span>
            <span className="hr" />
          </h3>
          <br />
          {fatwa.ques[locale].split("\n").map((para, i) => {
            return (
              <Fragment key={i}>
                <p className="ques">{para}</p>
                <br />
              </Fragment>
            );
          })}
          <br />
          <h3>
            <span className="hr" />
            <span className="content">
              <FormattedMessage id="answer" defaultMessage="Answer" />
            </span>
            <span className="hr" />
          </h3>
          <br />
          {fatwa.ans[locale].split("\n").map((para, i) => {
            return (
              <Fragment key={i}>
                <p className="ans">{para}</p>
                <br />
              </Fragment>
            );
          })}
          <br />
          {locale === "en-US" && (
            <>
              <p className="dis">
                * This Fatwa was translated by Google Translate.
                <br /> To see the original{" "}
                <Link
                  target="_blank"
                  to={`/fatwa/${fatwa.link && fatwa.link["bn-BD"]}`}
                >
                  click here
                </Link>
              </p>
              <br />
            </>
          )}
          <br />
          <br />
          <h3 className="sub">
            <FormattedMessage id="ref" value="Ref." />
          </h3>
          <br />
          {fatwa.ref.length > 0 && (
            <ul className="ref">
              {fatwa.ref.map((ref, i) =>
                ref.book ? (
                  <li key={i}>
                    <span>{ref.book}</span>,{" "}
                    <FormattedMessage id="page" defaultMessage="Page" />{" "}
                    <span>
                      <FormattedNumber value={ref.part} />
                    </span>
                    , <FormattedMessage id="part" defaultMessage="Part" />{" "}
                    <span>
                      <FormattedNumber value={ref.page} />
                    </span>
                  </li>
                ) : (
                  <li key={i}>
                    <span>{ref.sura}</span>,{" "}
                    <FormattedMessage id="aayat" defaultMessage="Aayat" />{" "}
                    <span>
                      <FormattedNumber value={ref.aayat} />
                    </span>
                  </li>
                )
              )}
            </ul>
          )}
          <br />
          <br />
          <br />
          <button
            className="cla"
            onClick={() => history.push(`${history.location.pathname}/report`)}
          >
            অভিযোগ
          </button>
          <br />
          <br />
          <br />
        </>
      ) : (
        <>Fatwa did not found.</>
      )}
      <Route path={`/fatwa/${fatwa.link ? fatwa.link[locale] : "link"}/report`}>
        {
          <Modal open={true} setOpen={closeModal}>
            <Report fatwa={fatwa} close={closeModal} />
          </Modal>
        }
      </Route>
    </div>
  );
}

export default Fatwa;
