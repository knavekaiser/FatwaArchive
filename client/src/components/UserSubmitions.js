import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Textarea, $ } from "./FormElements";
function UserQuestion() {
  const [success, setSuccess] = useState(false);
  function submit(e) {
    e.preventDefault();
    const userInput = {
      name: $("#name input").value,
      email: $("#email input").value,
      mobile: $("#mobile input").value,
      topic: $("#topic input").value,
      ques: $("#question textarea").value,
    };
    fetch("/api/askFatwa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    }).then((res) => {
      if (res.status === 200) {
        setSuccess(true);
      } else {
        console.log(res);
      }
    });
  }
  return !success ? (
    <div className={`main userQuestion ${success ? "success" : ""}`}>
      <form onSubmit={submit}>
        <Input dataId="name" label="Full Name" required={true} />
        <Input dataId="email" label="Email" required={true} />
        <Input
          dataId="mobile"
          label="Mobile"
          type="text"
          validation={/^\+\d{0,13}$/}
          warning="+8801..."
        />
        <Input dataId="topic" label="Topic" required={true} />
        <Textarea dataId="question" label="Question" required={true} />
        <button>Submit</button>
      </form>
      <br />
      <br />
      <div className="note">
        <p>
          প্রশ্নের উত্তর ৭-১০ দিনের মধ্যে দেওয়ার চেষ্টা করা হবে। সে পর্যন্ত
          ধৈর্য সহকারে অপেক্ষা করার অনুরোধ রইল।
        </p>
        <br />
        <p>
          উত্তর দ্রুত পাওয়ার জন্য কল করুন{" "}
          <a href="tel:+8801305487161">+8801305487161</a>
        </p>
        <p className="mufti">
          মুফতি আব্দুর রহমান আব্দে রাব্বি{" "}
          <span>প্রধান মুফতি, ফতোয়া আর্কাইভ</span>
        </p>
      </div>
    </div>
  ) : (
    <div className="main userQuestion success">
      <div className="successPromt">
        <ion-icon name="checkmark-circle-outline"></ion-icon>
        <p>প্রশ্ন সাবমিট হয়ে গেছে ।</p>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}

export default UserQuestion;
