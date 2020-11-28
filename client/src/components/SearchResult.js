import React, { useEffect, useState, useContext } from "react";
import { SiteContext } from "../Context";
import decodeURIComponent from "decode-uri-component";
import { Link, useHistory } from "react-router-dom";
import { FormattedMessage, FormattedNumber } from "react-intl";
import "./CSS/SearchResult.min.css";

function Loading() {
  return (
    <div className="loading">
      <div className="head" />
      <div className="desc" />
      <div className="jamia" />
    </div>
  );
}

function SearchResult() {
  const { locale, jamias, searchInput } = useContext(SiteContext);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [wrongLan, setWrongLan] = useState(null);
  const fetchData = () => {
    if (history.location.search === "") return history.push("/");
    const query = decodeURIComponent(history.location.search);
    if (
      (locale === "bn-BD" && /[a-z0-9]/gi.test(searchInput)) ||
      (locale === "en-US" && /[ঀ-৾]/gi.test(searchInput))
    ) {
      setWrongLan(true);
      return;
    } else {
      setWrongLan(false);
    }
    fetch(`/api/search${query}`, {
      method: "GET",
      headers: { "Accept-Language": locale },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        const result = data.map((item) => {
          return {
            ...item,
            jamia: jamias[item.jamia] ? jamias[item.jamia].name : "",
          };
        });
        setResults(result);
      })
      .catch((err) => console.log("Error: " + err));
  };
  useEffect(fetchData, [history.location, locale]);
  if (wrongLan) {
    return (
      <div className="main searchResult">
        <div className="content">
          <p className="noResult">
            {locale === "bn-BD" &&
              "Search in Bangla or change language to English."}
            {locale === "en-US" &&
              "Search in English or change language to Bangla."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className={`main searchResult`}>
      {results.length > 0 && (
        <div className="resultInfo">
          <p>
            <FormattedMessage
              values={{ number: <FormattedNumber value={results.length} /> }}
              id="results.count"
              defaultValue={`${results.length} fatwas found`}
            />
          </p>
        </div>
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="content">
          {results.length > 0 ? (
            results.map((item) => {
              return (
                <div key={item.ans.substring(0, 10)} className="result">
                  <Link to={`/fatwa/${item.link}`}>
                    <p className="title">{item.title}</p>
                    <p className="ques">{item.ques}</p>
                  </Link>
                  <p className="ans">{item.ans}</p>
                  <p className="jamia">
                    <FormattedMessage
                      id="results.source"
                      defaultValue="Source"
                    />{" "}
                    {item.jamia[locale]}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="noResult">
              Nothing found. ask your own questions{" "}
              <Link to="/askQuestion">here</Link>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchResult;
