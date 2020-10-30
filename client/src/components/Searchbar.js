import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/Searchbar.min.css";
import { FormattedMessage } from "react-intl";

const defaultValidation = /^[ঀ-৾ا-ﻰa-zA-Z0-9\s:;"',.।?-]+$/;

function Searchbar({ onFocus, children }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { searchInput, setSearchInput, locale } = useContext(SiteContext);
  const history = useHistory();
  const form = useRef(null);
  const input = useRef(null);
  function submit(e) {
    e.preventDefault();
    if (searchInput !== "") {
      input.current.blur();
      setShowSuggestion(false);
      history.push({
        pathname: "/search",
        search: "?" + new URLSearchParams({ q: searchInput }).toString(),
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
      e.target.value === "" ||
      defaultValidation.exec(e.target.value) !== null
    ) {
      setSearchInput(e.target.value);
    }
  }

  useEffect(() => {
    suggestions.length > 0 && setShowSuggestion(true);
  }, [suggestions]);
  const abortController = new AbortController();
  const signal = abortController.signal;
  useEffect(() => {
    if (searchInput !== "" && !form.current.classList.contains("wrong")) {
      fetch(`/api/searchSuggestions?q=${searchInput}`, {
        method: "GET",
        headers: { "Accept-Language": locale },
        signal: signal,
      })
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
        })
        .catch((err) => console.log("Error: " + err));
    }
    return () => abortController.abort();
  }, [searchInput]);

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
      <input
        ref={input}
        onFocus={handleFocus}
        className={
          suggestions.length === 0 || !showSuggestion ? "" : "suggestionVisible"
        }
        onChange={change}
        type="text"
        placeholder={
          locale === "bn-BD" ? "প্রশ্ন বা বিষয়বস্তু..." : "Question or topic..."
        }
        value={searchInput}
      />
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
                <Link to={`/fatwa/${item.link}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

export default Searchbar;
