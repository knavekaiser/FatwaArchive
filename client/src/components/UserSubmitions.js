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
  emptyFieldWarning,
} from "./FormElements";
import { FormattedMessage } from "react-intl";

function UserQuestion() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { locale } = useContext(SiteContext);
  function submit(e) {
    e.preventDefault();
    if (SS.get("askFatwa-name").length < 5) {
      emptyFieldWarning("#name", "input", "Enter your full name");
      return;
    }
    if (SS.get("askFatwa-add").length < 10) {
      emptyFieldWarning("#address", "input", "Enter valid address");
      return;
    }
    if (SS.get("askFatwa-mob").length < 14) {
      emptyFieldWarning("#mobile", "input", "Enter your mobile number");
      return;
    }
    if (!SS.get("askFatwa-topic")) {
      emptyFieldWarning("#topic", "", "Select a topic");
      return;
    }
    if (SS.get("askFatwa-ques").length < 15) {
      emptyFieldWarning("#question", "textarea", "Enter your question.");
      return;
    }
    const userInput = {
      user: {
        name: SS.get("askFatwa-name"),
        add: SS.get("askFatwa-add"),
        mob: SS.get("askFatwa-mob"),
      },
      ques: {
        topic: JSON.parse(SS.get("askFatwa-topic")),
        body: SS.get("askFatwa-ques"),
      },
    };
    setLoading(true);
    fetch("/api/askFatwa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInput),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setSuccess(true);
          SS.remove("askFatwa-name");
          SS.remove("askFatwa-add");
          SS.remove("askFatwa-mob");
          SS.remove("askFatwa-topic");
          SS.remove("askFatwa-ques");
        } else if (data.code === 11000) {
          emptyFieldWarning("#question", "textarea", "question already exists");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  }
  return !success ? (
    <div className={`main userQuestion ${success ? "success" : ""}`}>
      <h2>User Question</h2>
      <form onSubmit={submit}>
        <Input
          defaultValue={SS.get("askFatwa-name")}
          dataId="name"
          label=<FormattedMessage
            id="form.fullName"
            defaultMessage="Full name"
          />
          onChange={(target) => SS.set("askFatwa-name", target.value)}
        />
        <Input
          defaultValue={SS.get("askFatwa-add")}
          dataId="address"
          onChange={(target) => SS.set("askFatwa-add", target.value)}
          label=<FormattedMessage id="form.add" defaultMessage="Address" />
        />
        <Input
          dataId="mobile"
          onChange={(target) => SS.set("askFatwa-mob", target.value)}
          label=<FormattedMessage id="form.mobile" defaultMessage="Mobile" />
          type="text"
          pattern={/^\+\d{0,13}$/}
          defaultValue={SS.get("askFatwa-mob")}
          warning="+8801..."
        />
        <Combobox
          dataId="topic"
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
          defaultValue={
            SS.get("askFatwa-topic") && JSON.parse(SS.get("askFatwa-topic"))
          }
        />
        <Textarea
          onChange={(target) => SS.set("askFatwa-ques", target.value)}
          dataId="question"
          label=<FormattedMessage id="question" defaultMessage="Question" />
          defaultValue={SS.get("askFatwa-ques")}
        />
        <Submit
          label=<FormattedMessage id="submit" defaultMessage="Submit" />
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
