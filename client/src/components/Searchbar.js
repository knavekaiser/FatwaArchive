import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/Searchbar.min.css";

function Searchbar() {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { searchInput, setSearchInput } = useContext(SiteContext);
  const history = useHistory();
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
    setSearchInput(e.target.value);
  }

  useEffect(() => {
    suggestions.length > 0 && setShowSuggestion(true);
  }, [suggestions]);

  useEffect(() => {
    if (searchInput !== "") {
      fetch(`/api/search?q=${searchInput}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
        })
        .catch((err) => console.log("Error: " + err));
    }
  }, [searchInput]);

  useEffect(() => {
    const outsideClick = (e) => {
      !e.path.includes(document.querySelector("#searchbar input")) &&
        setShowSuggestion(false);
    };
    document.addEventListener("click", outsideClick);
    return () => {
      document.removeEventListener("click", outsideClick);
    };
  }, []);
  return (
    <form id="searchbar" onSubmit={submit}>
      <input
        onFocus={(e) => e.target.value !== "" && setShowSuggestion(true)}
        className={
          suggestions.length === 0 || !showSuggestion ? "" : "suggestionVisible"
        }
        onChange={change}
        type="text"
        placeholder="প্রশ্ন বা বিষয়বস্তু..."
        value={searchInput}
      />
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

//1 fetch req           http://localhost:8080
