import React, { useEffect, Fragment, useState } from "react";
import "./CSS/Fatwa.min.css";

function Fatwa({ match }) {
  const [fatwa, setFatwa] = useState({
    ques: "",
    ans: "",
    ref: [],
  });
  useEffect(() => {
    fetch(`/api/fatwa/${match.params.id}`)
      .then((res) => res.json())
      .then((data) => setFatwa(data))
      .catch((err) => console.log(err));
  }, [match]);
  return (
    <div className="main fatwa">
      <h2>{fatwa.title}</h2>
      <br />
      {fatwa.ques.split("\n").map((para, i) => {
        return (
          <Fragment key={i}>
            <p className="ques">
              {i === 0 && <span>প্রশ্নঃ </span>}
              {para}
            </p>
            <br />
          </Fragment>
        );
      })}
      <br />
      {fatwa.ans.split("\n").map((para, i) => {
        return (
          <Fragment key={i}>
            <p className="ans">
              {i === 0 && <span> উত্তরঃ </span>}
              {para}
            </p>
            <br />
          </Fragment>
        );
      })}
      <br />
      <br />
      <br />
      <p>সূত্র</p>
      <br />
      {fatwa.ref.length > 0 && (
        <ul>
          {fatwa.ref.map((ref, i) => (
            <li key={i}>
              <span>{ref.book}</span> <span>{ref.part}</span>/
              <span>{ref.page}</span>
            </li>
          ))}
        </ul>
      )}
      <br />
      <br />
      <br />
    </div>
  );
}

export default Fatwa;

//1 fetch req           http://localhost:8080
