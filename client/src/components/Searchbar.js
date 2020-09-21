import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/Searchbar.min.css";

const data = [
  "ইমিটেশনের হাকিকত কী?",
  "ভ্রু-প্লাক করার বিধান কী?",
  "যদি কোন স্বামী তার স্ত্রীকে মেসেজের মাধ্যমে বলে ফেলে যে",
  "হযরতের কাছে আমার জানার বিষয় হলো",
  "যেসব ফরজ নামাযের কাযা পড়া হয় ঐসব নামাযের সুন্নত কিংবা নফলের কাযা আছে",
  "বিস্তারিত জানিয়ে বাধিত করবেন। নিবেদক,",
  "আরিফুল ইসলাম, সিরাজগঞ্জ",
  "এখানে স্বামীর তালাকের কোন নিয়ত নেই তাহলে এটা কী হতে পারে?",
  "স্বামী তার স্ত্রীকে “তুই স্বাধীন”",
  "সফরে থাকা অবস্থায় যদি এমন হয় যে স্বপ্নদোষ",
  "হয়ে গেছে কিন্তু ফরয গোসল করার কোন উপায় নাই",
  "কিন্তু যাকে ইমাম বানায় তার ক্বেরাত শুদ্ধ নয়",
  "শুক্রবার সকালে মসজিদে আসে",
  "আমাদের পরীক্ষার খাতায় লুজের মধ্যে মাদ্রাসার লোগো জলছাপা দেয়া আছে",
  "কিন্তু পরবর্তীতে গোসল করে না",
  "ওই কাগজে লেখার সময় আয়াতের উপর স্পর্শ লেগে যায় স্বাভাবিকভাবেই",
  "আমাদের পরীক্ষার খাতায় লুজের মধ্যে মাদ্রাসার  লোগো জলছাপা দেয়া",
  "এটাও ছাপা আছে খাতায়। ওই কাগজে লেখার সময় আয়াতের উপর স্পর্শ লেগে যায় স্বাভাবিকভাবেই",
  "আমরা বিভিন্ন মজলিসে ও মাহফিলের প্রারম্ভে বরকতের",
  "জন্য পবিত্র কোরআনে পাকের তিলাওয়াত করে থাকি",
];

function Searchbar() {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { searchInput, setSearchInput } = useContext(SiteContext);
  const history = useHistory();
  function submit(e) {
    e.preventDefault();
    searchInput !== "" &&
      history.push({
        pathname: "/search",
        search: "?" + new URLSearchParams({ q: searchInput }).toString(),
      });
  }

  function change(e) {
    setSearchInput(e.target.value);
    const newSuggestions = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].includes(e.target.value)) {
        newSuggestions.push(
          data[i].length < 50 ? data[i] : data[i].substring(0, 50) + "..."
        );
      }
    }
    newSuggestions.length > 8 && (newSuggestions.length = 8);
    setSuggestions(newSuggestions);
  }

  useEffect(() => {
    suggestions.length > 0 && setShowSuggestion(true);
  }, [suggestions]);

  return (
    <div>
      <form id="searchbar" onSubmit={submit}>
        <input
          onFocus={(e) => e.target.value !== "" && setShowSuggestion(true)}
          className={
            suggestions.length === 0 || !showSuggestion
              ? ""
              : "suggestionVisible"
          }
          onChange={change}
          onBlur={() => setShowSuggestion(false)}
          type="text"
          placeholder="ভ্রু-প্লাক করার বিধান..."
          value={searchInput}
        />
        <button type="submit">
          <ion-icon name="search-outline"></ion-icon>
        </button>
        {showSuggestion && suggestions.length > 0 && (
          <div className="suggestions">
            <ul>
              {suggestions.map((item) => (
                <li key={item}>
                  <Link to="">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}

export default Searchbar;
