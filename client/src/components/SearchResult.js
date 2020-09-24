import React, { useEffect, useState } from "react";
import decodeURIComponent from "decode-uri-component";
import { Link } from "react-router-dom";
import "./CSS/SearchResult.min.css";

let maxChar = window.innerWidth > 480 ? 180 : 70;
function SearchResult({ location }) {
  const [results, setResults] = useState([]);
  useEffect(() => {
    const query = decodeURIComponent(location.search);
    fetch(`/api/search${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.log("Error: " + err));
  }, [location]);
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
                <Link to={`/fatwa/${item._id}`} className="ques">
                  {item.ques.length < maxChar
                    ? item.ques
                    : item.ques.substring(0, maxChar) + "..."}
                </Link>
                <p className="ans">
                  {item.ans.length < maxChar
                    ? item.ans
                    : item.ans.substring(0, maxChar) + "..."}
                </p>
              </div>
            );
          })
        ) : (
          <p>You can always submit question.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResult;

//1 fetch req           http://localhost:8080
