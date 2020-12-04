import React, { useState, useContext } from "react";
import { SiteContext } from "../Context";
import { Link } from "react-router-dom";
import {
  Input,
  Textarea,
  Submit,
  $,
  Combobox,
  topics,
  SS,
} from "./FormElements";
import { FormattedMessage } from "react-intl";

function UserQuestion() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { locale } = useContext(SiteContext);
  function submit(e) {
    e.preventDefault();
    // ---------------------  Validate each field here!!!
    const userInput = {
      user: {
        name: SS.get("askFatwa-name"),
        email: SS.get("askFatwa-email"),
        mobile: SS.get("askFatwa-mobile"),
      },
      ques: {
        topic: JSON.parse(SS.get("askFatwa-topic")),
        body: SS.get("askFatwa-question"),
      },
    };
    console.log(userInput);
    fetch("/api/askFatwa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInput),
    }).then((res) => {
      if (res.status === 200) {
        setSuccess(true);
      } else {
        alert("something went wrong");
        console.log(res);
      }
    });
  }
  return !success ? (
    <div className={`main userQuestion ${success ? "success" : ""}`}>
      <h2>User Question</h2>
      <form onSubmit={submit}>
        <Input
          dataId="name"
          label=<FormattedMessage
            id="form.fullName"
            defaultMessage="Full name"
          />
          onChange={(target) => SS.set("askFatwa-name", target.value)}
          required={true}
        />
        <Input
          dataId="email"
          onChange={(target) => SS.set("askFatwa-email", target.value)}
          label=<FormattedMessage id="form.email" defaultMessage="Email" />
          required={true}
        />
        <Input
          dataId="mobile"
          onChange={(target) => SS.set("askFatwa-mobile", target.value)}
          label=<FormattedMessage id="form.mobile" defaultMessage="Mobile" />
          type="text"
          pattern={/^\+\d{0,13}$/}
          defaultValue="+8801"
          warning="+8801..."
        />
        <Combobox
          maxHeight={200}
          options={topics.map((topic) => {
            return {
              label: topic[locale],
              value: topic,
            };
          })}
          onChange={(target) =>
            SS.set("askFatwa-topic", JSON.stringify(target.value))
          }
          label=<FormattedMessage id="topic" defaultMessage="Topic" />
          required={true}
        />
        <Textarea
          onChange={(target) => SS.set("askFatwa-question", target.value)}
          dataId="question"
          label=<FormattedMessage id="question" defaultMessage="Question" />
          required={true}
        />
        <Submit
          label=<FormattedMessage id="form.submit" defaultMessage="Submit" />
          loading={loading}
          setLoading={setLoading}
        />
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
