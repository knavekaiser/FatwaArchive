import React, { useState, useEffect, useContext } from "react";
import { SiteContext } from "../Context";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { Link } from "react-router-dom";

function TableOfContent() {
  const { locale } = useContext(SiteContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const fetchData = () => {
    fetch("/api/getLinks")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setData(data.data);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(fetchData, []);
  if (loading) {
    return <div className="main tableOfContent">loading</div>;
  }
  return (
    <div className="main tableOfContent">
      <h2>
        <FormattedMessage id="tableOfContent" />
        {data.length > 0 && (
          <span>
            <FormattedMessage
              values={{ number: <FormattedNumber value={data.length} /> }}
              id="results.count"
              defaultMessage={`${data.length} Fatwa found.`}
            />
          </span>
        )}
      </h2>
      <ul>
        {data.map((item) => (
          <li key={item.link[locale]}>
            <Link to={`fatwa/${item.link[locale]}`}>
              {item.link[locale].replaceAll("-", " ")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TableOfContent;
