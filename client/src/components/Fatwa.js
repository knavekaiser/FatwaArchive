import React, { useEffect, Fragment, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/Fatwa.min.css";
import { FormattedNumber } from "react-intl";
import { Helmet } from "react-helmet";

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
  const [loading, setLoading] = useState(true);
  const [fatwa, setFatwa] = useState({
    ques: "",
    ans: "",
    ref: [],
  });
  const abortController = new AbortController();
  const signal = abortController.signal;
  const options = { headers: { "Accept-Language": locale }, signal: signal };
  const fetchData = () => {
    fetch(`http://localhost:8080/api/fatwa/${match.params.id}`, options)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
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
        <title>{fatwa.title}</title>
        <meta
          name="description"
          content={fatwa.ans && fatwa.ans.substring(200)}
        />
      </Helmet>
      {loading && <Loading />}
      {!loading && (
        <>
          <h1>{fatwa.title}</h1>
          <br />
          <br />
          <h3>প্রশ্ন</h3>
          <br />
          {fatwa.ques.split("\n").map((para, i) => {
            return (
              <Fragment key={i}>
                <p className="ques">{para}</p>
                <br />
              </Fragment>
            );
          })}
          <br />
          <h3>উত্তর</h3>
          <br />
          {fatwa.ans.split("\n").map((para, i) => {
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
          <h3 className="sub">সূত্র</h3>
          <br />
          {fatwa.ref.length > 0 && (
            <ul className="ref">
              {fatwa.ref.map((ref, i) => (
                <li key={i}>
                  <span>{ref.book}</span>, পৃষ্ঠা{" "}
                  <span>
                    <FormattedNumber value={ref.part} />
                  </span>
                  , খন্ড{" "}
                  <span>
                    <FormattedNumber value={ref.page} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          <br />
          <br />
          <br />
          <h3 className="sub">ফতোয়া' উৎস</h3>
          <br />
          <h4 className="jamia">
            <Link
              title={`Show other fatwas from ${fatwa.jamia}`}
              to={`/jamia/${fatwa.jamia}`}
            >
              জামিয়া রাহমানিয়া আরাবিয়া
            </Link>
            <br />
            <span>Mohammadpur, Dhaka, Bangladesh</span>
          </h4>
          <br />
          <br />
          <br />
          <Link className="cla" to="/user/review">
            মতামত / অভিযোগ
          </Link>
          <br />
          <br />
          <br />
        </>
      )}
    </div>
  );
}

export default Fatwa;

//1 fetch req           http://localhost:8080
