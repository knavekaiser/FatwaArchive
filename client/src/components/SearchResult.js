import React, { useEffect, useState, useContext } from "react";
import { SiteContext } from "../Context";
import decodeURIComponent from "decode-uri-component";
import { Link, useHistory, Redirect } from "react-router-dom";
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
const parseParams = (querystring) => {
  const params = new URLSearchParams(querystring);
  const obj = {};
  for (const key of params.keys()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = params.get(key);
    }
  }
  return obj;
};
function SearchResult() {
  const { locale, sources, searchInput } = useContext(SiteContext);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [wrongLan, setWrongLan] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const url = parseParams(history.location.search);
  const fetchData = () => {
    setLoading(true);
    setResults([]);
    if (history.location.search === "") return history.push("/");
    const query = decodeURIComponent(history.location.search);
    if (
      (locale === "bn-BD" && /[a-z0-9]/gi.test(url.q)) ||
      (locale === "en-US" && /[ঀ-৾]/gi.test(url.q))
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
        if (data.code === "ok") {
          setResults(data.fatwas);
          setTotal(data.total);
          setPage(+url.page);
        } else {
          alert("something went wrong");
        }
      })
      .catch((err) => console.log("Error: " + err));
  };
  useEffect(fetchData, [history.location, locale, page]);
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
  if (loading) {
    return (
      <div className="main searchResult">
        <Loading />
      </div>
    );
  }
  return (
    <div className={`main searchResult`}>
      {results.length > 0 && (
        <div className="resultInfo">
          <p>
            <FormattedMessage
              values={{ number: <FormattedNumber value={total} /> }}
              id="results.count"
              defaultValue={`${total} fatwas found`}
            />
          </p>
        </div>
      )}
      <div className="content">
        {results.length > 0 ? (
          <>
            {results.map((item) => {
              return (
                <div key={item.link[locale]} className="result">
                  <Link to={`/fatwa/${item.link[locale]}`}>
                    <p className="title">{item.title[locale]}</p>
                    <p className="ques">{item.ques[locale]}</p>
                  </Link>
                  <p className="ans">{item.ques[locale]}</p>
                  <p className="source">
                    <FormattedMessage
                      id="results.source"
                      defaultValue="Source"
                    />{" "}
                    {item.source.name[locale]}
                  </p>
                </div>
              );
            })}
          </>
        ) : (
          <p className="noResult">
            <FormattedMessage
              id="noResult"
              values={{
                link: (
                  <Link to="/askQuestion">
                    <FormattedMessage id="here" defaultMessage="here" />
                  </Link>
                ),
              }}
            />
          </p>
        )}
      </div>
      <Paginaiton
        url={`/search?q=${url.q}&page=n`}
        total={total}
        btns={5}
        perPage={10}
        currentPage={page}
        setCurrentPage={setPage}
      />
    </div>
  );
}

function Paginaiton({
  url,
  total,
  btns,
  perPage,
  currentPage,
  setCurrentPage,
}) {
  const [pages, setPages] = useState([]);
  const [links, setLinks] = useState([]);
  useEffect(() => {
    setPages(
      [...Array(Math.ceil(total / perPage)).keys()].map((num) => num + 1)
    );
    setLinks([...Array(btns).keys()].map((num) => num + 1));
  }, [total]);
  if (total <= perPage) {
    return <></>;
  }

  return (
    <div className="paginaiton">
      <Link
        className={currentPage === 1 ? "disabled" : ""}
        to={url.replace("page=n", `page=${currentPage - 1}`)}
      >
        <ion-icon name="chevron-back-outline"></ion-icon>
      </Link>
      <ul className="pages">
        {pages.length <= btns &&
          pages.map((item) => (
            <li key={item} className={item === currentPage ? "active" : ""}>
              <Link to={url.replace("page=n", `page=${item}`)}>{item}</Link>
            </li>
          ))}
        {pages.length > btns &&
          links.map((item) => {
            const remain = pages.length - btns;
            const middle = Math.ceil(btns / 2);
            let pivit = 0;
            if (currentPage > middle) {
              if (currentPage - middle + btns <= pages.length) {
                pivit = currentPage - middle;
              } else {
                pivit = remain;
              }
            }
            const num = item + pivit;
            return (
              <li key={num} className={num === currentPage ? "active" : ""}>
                <Link to={url.replace("page=n", `page=${num}`)}>{num}</Link>
              </li>
            );
          })}
      </ul>
      <Link
        className={currentPage === pages.length ? "disabled" : ""}
        to={url.replace("page=n", `page=${currentPage + 1}`)}
      >
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </Link>
    </div>
  );
}

export default SearchResult;
