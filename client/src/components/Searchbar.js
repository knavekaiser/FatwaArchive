import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/Searchbar.min.css";
import { FormattedMessage } from "react-intl";
import { $$ } from "./FormElements";

const defaultValidation = /^[ঀ-৾ا-ﻰa-zA-Z0-9\s:;"',.।?-]+$/;

function Searchbar({ onFocus, children }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { searchInput, setSearchInput, locale } = useContext(SiteContext);
  const [visibleInput, setVisibleInput] = useState(searchInput);
  const history = useHistory();
  const form = useRef(null);
  const input = useRef(null);
  function submit(e) {
    e.preventDefault();
    setSearchInput((prev) => prev.replaceAll(/\s{2,}/g, " ").trim());
    setVisibleInput((prev) => prev.replaceAll(/\s{2,}/g, " ").trim());
    if (searchInput !== "") {
      input.current.blur();
      setShowSuggestion(false);
      history.push({
        pathname: "/search",
        search:
          "?" +
          new URLSearchParams({
            q: searchInput.replaceAll(/\s{2,}/g, " ").trim(),
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
    if (
      (locale === "bn-BD" && /[a-z0-9]/gi.test(e.target.value)) ||
      (locale === "en-US" && /[ঀ-৾]/gi.test(e.target.value))
    ) {
      form.current.classList.add("wrong");
    } else {
      form.current.classList.remove("wrong");
    }
    if (
      e.target.value.trim() === "" ||
      defaultValidation.exec(e.target.value) !== null
    ) {
      setSearchInput(e.target.value);
      setVisibleInput(e.target.value);
    }
  }
  function getQueryFromUrl() {
    if (history.location.pathname === "/search") {
      const params = JSON.parse(
        '{"' +
          decodeURI(history.location.search.substring(1))
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );
      setVisibleInput(params.q.replaceAll("+", " "));
    }
  }
  useEffect(getQueryFromUrl, []);
  function suggestionEffect() {
    history.location.pathname === "/" &&
      suggestions.length > 0 &&
      setShowSuggestion(true);
  }
  useEffect(suggestionEffect, [suggestions]);
  const abortController = new AbortController();
  const signal = abortController.signal;
  const fetchData = () => {
    if (
      searchInput.trim() !== "" &&
      !form.current.classList.contains("wrong")
    ) {
      fetch(`/api/searchSuggestions?q=${searchInput}`, {
        method: "GET",
        headers: { "Accept-Language": locale },
        signal: signal,
      })
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => console.log("Error: " + err));
    }
    return () => abortController.abort();
  };
  useEffect(fetchData, [searchInput]);

  useEffect(() => {
    const outsideClick = (e) => {
      !e.path.includes(input.current) && setShowSuggestion(false);
    };
    document.addEventListener("click", outsideClick);
    return () => {
      document.removeEventListener("click", outsideClick);
    };
  }, []);
  return (
    <form ref={form} id="searchbar" onSubmit={submit}>
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
                    } else {
                      suggestions[0].querySelector("a").classList.add("hover");
                    }
                    break;
                  }
                }
              } else if (e.keyCode === 13) {
                setSearchInput(visibleInput);
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
      <button type="submit">
        <ion-icon name="search-outline"></ion-icon>
      </button>
      {showSuggestion && suggestions.length > 0 && (
        <div className="suggestions">
          <ul>
            {suggestions.map((item, i) => (
              <li key={i}>
                <Link
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
                  to={`/fatwa/${item.link}`}
                >
                  {item.title}
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
