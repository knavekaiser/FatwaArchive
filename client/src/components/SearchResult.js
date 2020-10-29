import React, { useEffect, useState, useContext } from "react";
import { SiteContext } from "../Context";
import decodeURIComponent from "decode-uri-component";
import { Link, useHistory } from "react-router-dom";
import "./CSS/SearchResult.min.css";

function SearchResult() {
  const { locale } = useContext(SiteContext);
  const history = useHistory();
  const [results, setResults] = useState([]);
  useEffect(() => {
    if (history.location.search === "") return history.push("/");
    const query = decodeURIComponent(history.location.search);
    fetch(`/api/search${query}`, {
      method: "GET",
      headers: { "Accept-Language": locale },
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      })
      .catch((err) => console.log("Error: " + err));
  }, [history, locale]);
  return (
    <div className="main searchResult">
      {results.length > 0 && (
        <div className="resultInfo">
          <p>{results.length} result found.</p>
        </div>
      )}
      <div className="content">
        {results.length > 0 ? (
          results.map((item) => {
            return (
              <div key={item.ans.substring(0, 10)} className="result">
                <Link to={`/fatwa/${item.link[locale]}`}>
                  <p className="ques">{item.ques}</p>
                </Link>
                <p className="ans">{item.ans}</p>
              </div>
            );
          })
        ) : (
          <p className="noResult">
            Nothing found. but soon you will be able to submit questions. Stay
            tuned.
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchResult;
