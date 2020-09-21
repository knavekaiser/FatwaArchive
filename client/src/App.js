import React, { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    fetch("/api/users")
      .then((value) => {
        console.log(value);
        value.json();
      })
      .then((data) => console.log(data));
  }, []);
  return (
    <div className="App">
      <h1>hello</h1>
    </div>
  );
}

export default App;
