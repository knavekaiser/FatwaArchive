import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/Searchbar.min.css";
import { FormattedMessage } from "react-intl";
import { OutsideClick } from "./TableElements";
import { $$ } from "./FormElements";

const defaultValidation = /^[ঀ-৾ا-ﻰa-zA-Z0-9\s:;"',.।?-]+$/;
const getLan = (sentence, i) => {
  const str = sentence.replace(/[\s\-\.?।]/gi, "");
  if ((str.match(/[a-z0-9]/gi) || []).length / str.length > 0.9) {
    return !i ? "en-US" : "bn-BD";
  } else {
    return !i ? "bn-BD" : "en-US";
  }
};
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

function Searchbar({ onFocus, children }) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [value, setValue] = useState("");
  const { locale } = useContext(SiteContext);
  const [visibleInput, setVisibleInput] = useState(value);
  const [wrongLan, setWrongLan] = useState(false);
  const history = useHistory();
  const form = useRef(null);
  const input = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    if (getLan(value) !== locale) {
      setWrongLan(true);
    } else {
      setWrongLan(false);
    }
  }, [value]);
  function submit(e) {
    e.preventDefault();
    setShowSuggestion(false);
    if (value !== "") {
      input.current.blur();
      history.push({
        pathname: "/search",
        search:
          "?" +
          new URLSearchParams({
            q: value.replaceAll(/\s{2,}/g, " ").trim(),
            page: 1,
          }).toString(),
      });
    }
  }
  function handleFocus(e) {
    e.target.value !== "" && setShowSuggestion(true);
    onFocus && onFocus(e.target);
  }
  function change(e) {
    setValue(e.target.value);
    setVisibleInput(e.target.value);
  }
  function getQueryFromUrl() {
    if (history.location.pathname === "/search") {
      const params = parseParams(history.location.search);
      setVisibleInput(params.q.replaceAll("+", " "));
    }
  }
  useEffect(getQueryFromUrl, []);
  function suggestionEffect() {
    suggestions.length > 0 && setShowSuggestion(true);
  }
  useEffect(suggestionEffect, [suggestions]);
  const abortController = new AbortController();
  const signal = abortController.signal;
  const fetchData = () => {
    if (wrongLan || value.trim() === "") {
      return;
    }
    fetch(`/api/searchSuggestions?q=${value}`, {
      method: "GET",
      headers: { "Accept-Language": locale },
      signal: signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setSuggestions(data.data);
        }
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
    return () => abortController.abort();
  };
  useEffect(fetchData, [value]);
  useEffect(() => {
    if (window.location.pathname === "/" && window.innerWidth > 480) {
      input.current.focus();
    }
    const outsideClick = (e) => {
      !e.path.includes(input.current) && setShowSuggestion(false);
    };
    document.addEventListener("click", outsideClick);
    return () => {
      document.removeEventListener("click", outsideClick);
    };
  }, []);
  return (
    <form
      ref={form}
      id="searchbar"
      onSubmit={submit}
      className={`${wrongLan ? "wrong" : ""}`}
    >
      {children}
      <FormattedMessage
        id="searchbar.placeholder"
        defaultMessage="Question or topic..."
      >
        {(msg) => (
          <input
            ref={input}
            onFocus={handleFocus}
            onKeyDown={(e) => {
              if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
                const suggestions = $$(".suggestions ul li");
                for (var i = 0; i < suggestions.length; i++) {
                  const currentItem = suggestions[i].children[0];
                  const nextItem =
                    suggestions[i + 1] && suggestions[i + 1].children[0];
                  const prevItem =
                    suggestions[i - 1] && suggestions[i - 1].children[0];
                  if (currentItem.classList.contains("hover")) {
                    currentItem.classList.remove("hover");
                    if (e.keyCode === 38) {
                      if (i > 0) {
                        prevItem.classList.add("hover");
                        setVisibleInput(prevItem.textContent);
                      }
                    } else {
                      if (i < suggestions.length - 1) {
                        nextItem.classList.add("hover");
                        setVisibleInput(nextItem.textContent);
                      }
                    }
                    break;
                  } else if (i === suggestions.length - 1) {
                    if (e.keyCode === 38) {
                      suggestions[suggestions.length - 1]
                        .querySelector("a")
                        .classList.add("hover");
                      setVisibleInput(
                        suggestions[suggestions.length - 1].querySelector("a")
                          .textContent
                      );
                    } else {
                      suggestions[0].querySelector("a").classList.add("hover");
                      setVisibleInput(
                        suggestions[0].querySelector("a").textContent
                      );
                    }
                    break;
                  }
                }
              } else if (e.keyCode === 13) {
                setValue(visibleInput);
              } else if (e.keyCode === 27) {
                setShowSuggestion(false);
              }
            }}
            className={
              suggestions.length === 0 || !showSuggestion
                ? ""
                : "suggestionVisible"
            }
            onChange={change}
            type="text"
            placeholder={msg}
            value={visibleInput}
          />
        )}
      </FormattedMessage>
      <span className="warning">
        {locale === "bn-BD" ? "বাংলায় খুঁজুন" : "Search in English"}
      </span>
      <button type="submit" disabled={wrongLan}>
        <ion-icon name="search-outline"></ion-icon>
      </button>
      {showSuggestion && suggestions.length > 0 && (
        <div className="suggestions">
          <ul>
            {suggestions.map((item, i) => (
              <li key={i}>
                <a
                  onClick={() => {
                    setVisibleInput(item.title[locale]);
                    history.push(`/search?q=${item.title[locale]}&page=1`);
                  }}
                  onMouseEnter={(e) => {
                    e.target.classList.add("hover");
                  }}
                  onMouseMove={(e) => {
                    if (!e.target.classList.contains("hover")) {
                      Array.from(
                        e.target.parentElement.parentElement.children
                      ).forEach((li, i) => {
                        li.querySelector("a").classList.remove("hover");
                      });
                      e.target.classList.add("hover");
                    }
                  }}
                  onMouseLeave={(e) => e.target.classList.remove("hover")}
                >
                  {item.title[locale]}
                </a>
                <Link className="direct" to={`/fatwa/${item.link[locale]}`}>
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

export default Searchbar;
