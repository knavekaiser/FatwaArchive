import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/Searchbar.min.css";

function Searchbar() {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { searchInput, setSearchInput, locale } = useContext(SiteContext);
  const history = useHistory();
  const form = useRef(null);
  const input = useRef(null);
  function submit(e) {
    e.preventDefault();
    if (searchInput !== "") {
      history.push({
        pathname: "/search",
        search: "?" + new URLSearchParams({ q: searchInput }).toString(),
      });
      setShowSuggestion(false);
    }
  }

  function change(e) {
    const validator = new RegExp("[a-z0-9~!@#$%^&*()_-{}|:;]", "i");
    if (validator.test(e.target.value)) {
      form.current.classList.add("wrong");
    } else {
      form.current.classList.remove("wrong");
    }
    setSearchInput(e.target.value);
  }

  useEffect(() => {
    suggestions.length > 0 && setShowSuggestion(true);
  }, [suggestions]);
  const abortController = new AbortController();
  const signal = abortController.signal;
  useEffect(() => {
    if (form.current.classList.contains("wrong")) {
      return;
    }
    if (searchInput !== "") {
      fetch(`/api/search?q=${searchInput}`, {
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
      <input
        ref={input}
        onFocus={(e) => e.target.value !== "" && setShowSuggestion(true)}
        className={
          suggestions.length === 0 || !showSuggestion ? "" : "suggestionVisible"
        }
        onChange={change}
        type="text"
        placeholder="প্রশ্ন বা বিষয়বস্তু..."
        value={searchInput}
      />
      <span className="warning">বাংলা লিখুন</span>
      <button type="submit">
        <ion-icon name="search-outline"></ion-icon>
      </button>
      {showSuggestion && suggestions.length > 0 && (
        <div className="suggestions">
          <ul>
            {suggestions.map((item) => (
              <li key={item._id}>
                <Link to={`/fatwa/${item._id}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

export default Searchbar;
