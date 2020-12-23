import React, { useState, useContext } from "react";
import { SiteContext } from "../Context";
import { Link } from "react-router-dom";
import {
  Input,
  Textarea,
  Mobile,
  Submit,
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
      <h2>
        <FormattedMessage id="askFatwa" defaultMessage="Ask Fatwa" />
      </h2>
      <form onSubmit={submit}>
        <Input
          defaultValue={SS.get("askFatwa-name")}
          dataId="name"
          label=<FormattedMessage id="fullName" defaultMessage="Full name" />
          onChange={(target) => SS.set("askFatwa-name", target.value)}
          required={true}
          validationMessage=<FormattedMessage
            id="fullNameValidation"
            defaultMessage="Enter your full name"
          />
        />
        <Input
          required={true}
          validationMessage=<FormattedMessage
            id="addValidation"
            defaultMessage="Enter your address"
          />
          defaultValue={SS.get("askFatwa-add")}
          dataId="address"
          onChange={(target) => SS.set("askFatwa-add", target.value)}
          label=<FormattedMessage id="add" defaultMessage="Address" />
        />
        <Mobile
          dataId="mobile"
          onChange={(target) => SS.set("askFatwa-mob", target.value)}
          label=<FormattedMessage id="mobile" defaultMessage="Mobile" />
          required={true}
          defaultValue={SS.get("askFatwa-mob")}
          validationMessage=<FormattedMessage
            id="contactValidation"
            defaultMessage="Enter your mobile number"
          />
        />
        <Combobox
          dataId="topic"
          maxHeight={200}
          required={true}
          validationMessage=<FormattedMessage
            id="topicValidation"
            defaultMessage="Select a topic"
          />
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
          required={true}
          validationMessage=<FormattedMessage
            id="quesValidation"
            defaultMessage="Enter your question"
          />
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
          <FormattedMessage id="askFatwaPs1" />
        </p>
        <br />
        <p>
          <FormattedMessage
            id="askFatwaContact"
            values={{ link: <a href="tel:+8801305487161">01305487161</a> }}
          />
        </p>
        <p className="mufti">
          <FormattedMessage
            id="arRabbi"
            defaultMessage="Mufti Abdur Rahman Abde rabbi"
          />
          <span>
            <FormattedMessage
              id="arRabbiDes"
              defaultMessage="Prime Mufti, Fatwa Archive"
            />
          </span>
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
