import React, { useState, useContext, useEffect, useRef } from "react";
import { Route, Switch, Link, Redirect, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import { Tabs, View, Sidebar, Actions } from "./TableElements";
import {
  ID,
  Input,
  Combobox,
  Textarea,
  Submit,
  topics,
  SS,
} from "./FormElements";
import "./CSS/JamiaProfile.min.css";
import {
  FormattedDate,
  FormattedNumber,
  FormattedTime,
  FormattedTimeParts,
  FormattedMessage,
} from "react-intl";
import {
  AddFatwaForm,
  DataEditForm,
  PasswordEditForm,
  UserQuestionAnswerForm,
} from "./Forms";
import { Modal } from "./Modals";

const encodeURL = (obj) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&");

function LoadingPost() {
  return (
    <div className="question loading">
      <div className="user"></div>
      <div className="ques"></div>
      <div className="tags"></div>
    </div>
  );
}

function Profile() {
  const { user } = useContext(SiteContext);
  const patchApi = `/api/source/edit`;
  return (
    <div className="view">
      <h1>Jamia Profile</h1>
      <ul id="profileInfo">
        <li className="label">Joined</li>
        <li className="data">
          <FormattedDate
            value={user.joined}
            day="numeric"
            month="numeric"
            year="2-digit"
          />
        </li>
        <li className="label">Fatwa</li>
        <li className="data">
          <FormattedNumber value={user.fatwa} />
        </li>
        <li className="label">ID</li>
        <li className="data">{user.id}</li>
        <li className="label">Password</li>
        <li className="data">
          <PasswordEditForm api={patchApi} />
        </li>
        <li className="label">Name (Bangla)</li>
        <li className="data">
          <DataEditForm
            api={patchApi}
            defaultValue={user.name["bn-BD"]}
            Element={Input}
            pattern={/^[ঀ-৾\s(),]+$/}
            fieldCode="name.bn-BD"
          />
        </li>
        <li className="label">Name (Enlish)</li>
        <li className="data">
          <DataEditForm
            api={patchApi}
            defaultValue={user.name["en-US"]}
            Element={Input}
            pattern={/^[a-zA-Z\s(),]+$/}
            fieldCode="name.en-US"
          />
        </li>
        <li className="label">Prime Mufti (Bangla)</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.primeMufti["bn-BD"]}
            Element={Input}
            max={200}
            fieldCode="primeMufti.bn-BD"
            api={patchApi}
          />
        </li>
        <li className="label">Prime Mufti (English)</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.primeMufti["en-US"]}
            Element={Input}
            max={200}
            fieldCode="primeMufti.en-US"
            api={patchApi}
          />
        </li>
        <li className="label">Founder</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.founder}
            Element={Textarea}
            max={200}
            fieldCode="founder"
            api={patchApi}
          />
        </li>
        <li className="label">Address</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.address}
            Element={Textarea}
            fieldCode="add"
            api={patchApi}
          />
        </li>
        <li className="label">Contact</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.contact}
            Element={Input}
            pattern={/^\+8801\d{0,9}$/}
            tel={true}
            fieldCode="contact"
            api={patchApi}
          />
        </li>
        <li className="label">About</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.about}
            Element={Textarea}
            pattern={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
            fieldCode="about"
            api={patchApi}
          />
        </li>
        <li className="label">Applicant's Name</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.appl.name}
            Element={Input}
            pattern={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
            fieldCode="appl.name"
            api={patchApi}
          />
        </li>
        <li className="label">Applicant's designation</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.appl.des}
            Element={Input}
            pattern={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
            fieldCode="appl.des"
            api={patchApi}
          />
        </li>
        <li className="label">Applicant's mobile</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.appl.mob}
            Element={Input}
            pattern={/^\+8801\d{0,9}$/}
            tel={true}
            fieldCode="appl.mob"
            api={patchApi}
          />
        </li>
      </ul>
    </div>
  );
}

function SingleFatwa({ data, setData }) {
  const { locale, setFatwaToEdit } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const fatwa = data;
  const history = useHistory();
  const [open, setOpen] = useState(false);
  function edit() {
    setFatwaToEdit(fatwa);
    history.push(`/jamia/add/${fatwa._id}`);
  }
  function deleteFatwa() {
    if (window.confirm("Do you want to delete this fatwa?")) {
      setLoading(true);
      fetch(`/api/source/fatwa/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fatwa: fatwa._id, source: fatwa.source }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            setData((prev) => {
              return prev.filter((item) => item._id !== fatwa._id);
            });
          } else {
            alert("something went wrong.");
          }
        })
        .catch((err) => {
          alert("something went wrong.");
          console.log(err);
        });
    }
  }
  return open ? (
    <tr className="full">
      <td className="label">Added</td>
      <td className="data">
        <FormattedDate
          value={fatwa.added}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td className="label">title</td>
      <td className="data">
        <Link target="_blank" to={`/fatwa/${fatwa.link[locale]}`}>
          {fatwa.title[locale]}
          <ion-icon name="open-outline"></ion-icon>
        </Link>
      </td>
      <td className="label">translate</td>
      <td className="data">{fatwa.translation ? "Yes" : "No"}</td>
      <td className="data btns">
        <button onClick={() => setOpen(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon> Hide Detail
        </button>
        <button onClick={edit}>
          <ion-icon name="pencil-outline"></ion-icon> Edit
        </button>
        <button onClick={deleteFatwa}>
          <ion-icon name="trash-outline"></ion-icon> Delete Fatwa
        </button>
      </td>
    </tr>
  ) : (
    <tr data-id={fatwa._id} onClick={() => setOpen(true)}>
      <td>{fatwa.topic[locale]}</td>
      <td>
        <FormattedDate
          value={fatwa.added}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td>{fatwa.title[locale]}</td>
      <td>{fatwa.translation ? "Yes" : "No"}</td>
    </tr>
  );
}
function JamiaSingleFatwaSubmission({ data, setData }) {
  const { locale, setFatwaToEdit } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const fatwa = data;
  const history = useHistory();
  function edit() {
    setFatwaToEdit(fatwa);
    history.push("/jamia/add");
  }
  function removeSubmission() {
    fetch(`/api/fatwaSubmissions/${fatwa._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((item) => item._id !== fatwa._id);
          });
        } else {
          alert("something went wrong");
        }
      })
      .catch((err) => {
        alert("something went wrong");
        console.log(err);
      });
  }
  return open ? (
    <tr data-id={fatwa._id} className="full">
      <td className="label">Submitted</td>
      <td className="data">
        <FormattedDate
          value={fatwa.submitted}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td className="label">topic</td>
      <td className="data">{fatwa.topic[locale]}</td>
      <td className="label">title (Bangla)</td>
      <td className="data">{fatwa.title["bn-BD"]}</td>
      {fatwa.title["en-US"] && (
        <>
          <td className="label">title (English)</td>
          <td className="data">{fatwa.title["en-US"]}</td>
        </>
      )}
      <td className="label">question (Bangla)</td>
      <td className="data">{fatwa.ques["bn-BD"]}</td>
      {fatwa.ques["en-US"] && (
        <>
          <td className="label">question (English)</td>
          <td>{fatwa.ques["en-US"]}</td>
        </>
      )}
      <td className="label">answer (Bangla)</td>
      <td className="data">{fatwa.ans["bn-BD"]}</td>
      {fatwa.ans["en-US"] && (
        <>
          <td className="label">answer (English)</td>
          <td className="data">{fatwa.ans["en-US"]}</td>
        </>
      )}
      <td className="label">Ref.</td>
      <td className="data">
        <ul>
          {fatwa.ref.map((item, i) =>
            item.book ? (
              <li key={item.book + item.part + item.page}>
                book: {item.book}, part: {item.part}, page: {item.page}
              </li>
            ) : (
              <li key={item.sura + item.aayat}>
                sura: {item.sura}, aayat: {item.aayat}
              </li>
            )
          )}
        </ul>
      </td>
      <td className="data btns">
        <button onClick={() => setOpen(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon> Hide Detail
        </button>
        <button onClick={edit}>
          <ion-icon name="pencil-outline"></ion-icon> Edit
        </button>
        <button onClick={removeSubmission}>
          <ion-icon name="trash-outline"></ion-icon> Remove
        </button>
      </td>
    </tr>
  ) : (
    <tr data-id={fatwa._id} onClick={() => setOpen(true)}>
      <td>
        <FormattedDate
          value={fatwa.submitted}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td>{fatwa.topic[locale]}</td>
      <td>{fatwa.title[locale]}</td>
    </tr>
  );
}
function JamiaAllFatwa() {
  const { locale } = useContext(SiteContext);
  return (
    <div className="view">
      <h1 className="viewTitle">Fatwa</h1>
      <Tabs page="/jamia/fatwa/" tabs={["Live", "Submissions"]} />
      <Switch>
        <Route path="/jamia/fatwa" exact>
          <View
            key="jamiaAllFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/source/allFatwa/filter?"
            categories={[
              {
                fieldName: "title",
                name: "Title",
                chip: "Title contains",
                input: <Input label="Title" type="text" required={true} />,
              },
              {
                fieldName: "topic",
                name: "Topic",
                chip: "Topic is",
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={300}
                    label="topic"
                    options={topics.map((option) => {
                      return {
                        label: option[locale],
                        value: option,
                      };
                    })}
                  />
                ),
              },
              {
                fieldName: "question",
                name: "Question",
                chip: "Question contains",
                input: <Input label="Question" type="text" required={true} />,
              },
              {
                fieldName: "answer",
                name: "Answer",
                display: "Answer contains",
                input: <Input label="Answer" type="text" required={true} />,
              },
              {
                fieldName: "translation",
                name: "Translation",
                chip: "Translation :",
                input: (
                  <Combobox
                    maxHeight={500}
                    label="Translation"
                    options={[
                      { label: "Generated", value: "generated" },
                      { label: "Manual", value: "manual" },
                    ]}
                  />
                ),
              },
            ]}
            columns={[
              { column: "topic", sort: true, colCode: "topic" },
              { column: "date", sort: true, colCode: "createdAt" },
              { column: "title", sort: false, colCode: "title" },
              { column: "translation", sort: true, colCode: "translation" },
            ]}
            defaultSort={{ column: "createdAt", order: "des" }}
          />
        </Route>
        <Route path="/jamia/fatwa/live">
          <View
            key="jamiaAllFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/source/allFatwa/filter?"
            categories={[
              {
                fieldName: "title",
                name: "Title",
                chip: "Title contains",
                input: <Input label="Title" type="text" required={true} />,
              },
              {
                fieldName: "topic",
                name: "Topic",
                chip: "Topic is",
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={300}
                    label="topic"
                    options={topics.map((option) => {
                      return {
                        label: option[locale],
                        value: option,
                      };
                    })}
                  />
                ),
              },
              {
                fieldName: "question",
                name: "Question",
                chip: "Question contains",
                input: <Input label="Question" type="text" required={true} />,
              },
              {
                fieldName: "answer",
                name: "Answer",
                display: "Answer contains",
                input: <Input label="Answer" type="text" required={true} />,
              },
              {
                fieldName: "translation",
                name: "Translation",
                chip: "Translation :",
                input: (
                  <Combobox
                    maxHeight={500}
                    label="Translation"
                    options={[
                      { label: "Generated", value: "generated" },
                      { label: "Manual", value: "manual" },
                    ]}
                  />
                ),
              },
            ]}
            columns={[
              { column: "topic", sort: true, colCode: "topic" },
              { column: "date", sort: true, colCode: "createdAt" },
              { column: "title", sort: false, colCode: "title" },
              { column: "translation", sort: true, colCode: "translation" },
            ]}
            defaultSort={{ column: "createdAt", order: "des" }}
          />
        </Route>
        <Route path="/jamia/fatwa/submissions">
          <View
            key="jamiaAllFatwaSubmission"
            Element={JamiaSingleFatwaSubmission}
            id="fatwaSubmissions"
            api="api/source/fatwaSubmissions/filter?"
            categories={[
              {
                name: "topic",
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={300}
                    label="topic"
                    options={topics.map((option) => {
                      return {
                        label: option[locale],
                        value: option,
                      };
                    })}
                  />
                ),
              },
              {
                name: "title",
                input: <Input label="Title" type="text" required={true} />,
              },
              {
                name: "question",
                input: <Input label="Question" type="text" required={true} />,
              },
              {
                name: "answer",
                input: <Input label="Answer" type="text" required={true} />,
              },
            ]}
            columns={[
              { column: "date", sort: true, colCode: "createdAt" },
              { column: "topic", sort: true, colCode: "topic" },
              { column: "title", sort: false },
            ]}
            defaultSort={{ column: "createdAt", order: "des" }}
          />
        </Route>
      </Switch>
    </div>
  );
}

function UserSubmissions() {
  const { locale } = useContext(SiteContext);
  return (
    <div className="view">
      <h1 className="viewTitle">User Submissions</h1>
      <Tabs
        page="/jamia/userSubmissions/"
        tabs={["Question Feed", "Our Questions", "Reviews", "Reports"]}
      />
      <Switch>
        <Route path="/jamia/fatwa" exact>
          <View
            key="jamiaAllFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/source/allFatwa/filter?"
            categories={[
              {
                name: "topic",
                input: (
                  <Combobox
                    maxHeight={300}
                    label="topic"
                    data={topics.map((item) => {
                      return {
                        label: item[locale],
                        value: item,
                      };
                    })}
                    required={true}
                  />
                ),
              },
              {
                name: "title",
                input: <Input label="Title" type="text" required={true} />,
              },
              {
                name: "question",
                input: <Input label="Question" type="text" required={true} />,
              },
              {
                name: "answer",
                input: <Input label="Answer" type="text" required={true} />,
              },
              {
                name: "translation",
                input: (
                  <Combobox
                    maxHeight={500}
                    label="by"
                    options={[
                      { label: "Generated", value: "generated" },
                      { label: "Manual", value: "manual" },
                    ]}
                    required={true}
                  />
                ),
              },
            ]}
            columns={[
              { column: "topic", sort: true, colCode: "topic" },
              { column: "date", sort: true, colCode: "added" },
              { column: "title", sort: false, colCode: "title" },
              { column: "translation", sort: true, colCode: "translation" },
            ]}
            defaultSort={{ column: "added", order: "des" }}
          />
        </Route>
        <Route path="/jamia/fatwa/live">
          <View
            key="jamiaAllFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/source/allFatwa/filter?"
            categories={[
              {
                name: "topic",
                input: (
                  <></>
                  // <ComboboxMulti
                  //   id={ID(8)}
                  //   maxHeight={300}
                  //   label="topic"
                  //   data={topics}
                  //   required={true}
                  // />
                ),
              },
              {
                name: "title",
                input: <Input label="Title" type="text" required={true} />,
              },
              {
                name: "question",
                input: <Input label="Question" type="text" required={true} />,
              },
              {
                name: "answer",
                input: <Input label="Answer" type="text" required={true} />,
              },
              {
                name: "translation",
                input: (
                  <Combobox
                    maxHeight={500}
                    label="by"
                    options={[
                      { label: "Generated", value: "generated" },
                      { label: "Manual", value: "manual" },
                    ]}
                    required={true}
                  />
                ),
              },
            ]}
            columns={[
              { column: "topic", sort: true, colCode: "topic" },
              { column: "date", sort: true, colCode: "added" },
              { column: "title", sort: false, colCode: "title" },
              { column: "translation", sort: true, colCode: "translation" },
            ]}
            defaultSort={{ column: "added", order: "des" }}
          />
        </Route>
        <Route path="/jamia/fatwa/submissions">
          <View
            key="jamiaAllFatwaSubmission"
            Element={JamiaSingleFatwaSubmission}
            id="fatwaSubmissions"
            api="api/source/fatwaSubmissions/filter?"
            categories={[
              {
                name: "topic",
                input: (
                  <></>
                  // <ComboboxMulti
                  //   id={ID(8)}
                  //   maxHeight={300}
                  //   label="topic"
                  //   data={topics}
                  //   required={true}
                  // />
                ),
              },
              {
                name: "title",
                input: <Input label="Title" type="text" required={true} />,
              },
              {
                name: "question",
                input: <Input label="Question" type="text" required={true} />,
              },
              {
                name: "answer",
                input: <Input label="Answer" type="text" required={true} />,
              },
            ]}
            columns={[
              { column: "date", sort: true, colCode: "submitted" },
              { column: "topic", sort: true, colCode: "topic" },
              { column: "title", sort: false },
            ]}
            defaultSort={{ column: "submitted", order: "des" }}
          />
        </Route>
      </Switch>
    </div>
  );
}

function SingleQuestion({ data }) {
  const { locale } = useContext(SiteContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  return (
    <li
      ref={container}
      className={`question ${!open ? "mini" : ""}`}
      onClick={(e) => {
        if (e.target === container.current) {
          history.push("/jamia/userQuestion/" + data._id);
        }
      }}
    >
      <div className="user">
        <p className="name">{data.user.name}</p>
        <p className="date">
          {new Date(data.submitted).getFullYear() !==
          new Date().getFullYear() ? (
            <FormattedDate
              value={data.submitted}
              day="numeric"
              month="long"
              year="numeric"
            />
          ) : (
            <FormattedDate value={data.submitted} day="numeric" month="long" />
          )}
          <span className="separator" />
          <FormattedTimeParts value={data.submitted}>
            {(parts) => (
              <>
                {parts[0].value}
                {parts[1].value}
                {parts[2].value}
                <small>{parts[4].value.toLowerCase()}</small>
              </>
            )}
          </FormattedTimeParts>
        </p>
      </div>
      <Actions
        actions={[
          {
            label: "Answer now",
            action: () => {
              SS.set("userAns-ques", data.ques.body);
              SS.set("userAns-topic", JSON.stringify(data.ques.topic));
              history.push("/jamia/answerUserQuestion/" + data._id);
            },
          },
        ]}
      />
      <p className="ques">{data.ques.body}</p>
      <ul className="tags">
        <li className="tag">{data.ques.topic[locale]}</li>
        <li className="tag">#2021</li>
      </ul>
    </li>
  );
}
function NewQuestions() {
  const abortController = new AbortController();
  const signal = abortController.signal;
  const { locale } = useContext(SiteContext);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ column: "createdAt", order: "des" });
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  function fetchData() {
    !loading && setLoading(true);
    const query = encodeURL(filters);
    const sortOrder = encodeURL(sort);
    const options = { headers: { "Accept-Language": locale }, signal: signal };
    const url = `/api/source/questionFeed/filter?${query}&${sortOrder}`;
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        console.log(data);
        setData(data);
      })
      .catch((err) => {
        console.log(err);
        console.log("handle error!!");
      });
    return () => abortController.abort();
  }
  useEffect(fetchData, [sort, filters]);
  return (
    <>
      <div className="filters">
        <Combobox
          disabled={loading}
          defaultValue={1}
          change={setSort}
          maxHeight={200}
          id="questionFeedSort"
          icon="layers"
          options={[
            {
              label: "New first",
              value: { column: "submitted", order: "asc" },
            },
            {
              label: "Old first",
              value: { column: "submitted", order: "des" },
            },
          ]}
        />
      </div>
      <ul className="feed">
        {!loading ? (
          data.map((item) => <SingleQuestion key={item._id} data={item} />)
        ) : (
          <LoadingPost />
        )}
      </ul>
    </>
  );
}
function QuestionFeed() {
  return (
    <div className="view questionFeed">
      <h1 className="viewTitle">Question feed</h1>
      <Tabs page="/jamia/questionFeed/" tabs={["New Questions"]} />
      <Switch>
        <Route path="/jamia/questionFeed" exact>
          <NewQuestions />
        </Route>
        <Route path="/jamia/questionFeed/newQuestions">
          <NewQuestions />
        </Route>
      </Switch>
    </div>
  );
}

function Answer({ ques, ans, setQues }) {
  const { locale, user } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [voted, setVoted] = useState(() => {
    let vote = false;
    ans.vote.voters.some((voter) => {
      if (voter.source === user._id) {
        vote = voter.vote;
      }
    });
    return vote;
  });
  useEffect(() => {
    let vote = false;
    ans.vote.voters.some((voter) => {
      if (voter.source === user._id) {
        vote = voter.vote;
      }
    });
    setVoted(vote);
  }, [ans]);
  const history = useHistory();
  function vote(e) {
    setLoading(true);
    const options = {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        voter: user._id,
        ans_id: ans._id,
        vote: e.target.getAttribute("name").includes("up") ? "up" : "down",
      }),
    };
    fetch(`/api/source/userQues/vote/${ques._id}`, options)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setQues(data.content);
        } else {
          throw data.code;
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  }
  function edit() {
    SS.set("ansFatwa-ans", ans.body);
    SS.set("ansFatwa-title", ans.title);
    SS.set("ansFatwa-ref", JSON.stringify(ans.ref));
    history.push(history.location.pathname + "/add");
  }
  function report() {
    console.log("report here");
  }
  function remove() {
    const options = {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ source: ans.source._id, _id: ans._id }),
    };
    setLoading(true);
    fetch(`/api/source/userQues/answer/${ques._id}`, options)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setQues(data.content);
        } else {
          throw data.code;
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  }
  return (
    <div
      className={`ans ${ans.source._id === user._id ? "mine" : ""} ${
        !open ? "mini" : ""
      }`}
    >
      <div className="vote">
        <div className={`content ${voted}`}>
          <ion-icon onClick={vote} name="chevron-up-outline"></ion-icon>
          <p className="voteCount">
            <FormattedNumber value={ans.vote.count} />
          </p>
          <ion-icon onClick={vote} name="chevron-down-outline"></ion-icon>
        </div>
      </div>
      <div className="content">
        <div className="source">
          <p className="name">
            <b>{ans.source.name[locale]}</b>
          </p>
          <p className="date">
            <FormattedDate
              value={ans.createdAt}
              day="numeric"
              month="long"
              year="numeric"
            />
            <span className="separator" />
            <FormattedTimeParts value={ans.createdAt}>
              {(parts) => (
                <>
                  {parts[0].value}
                  {parts[1].value}
                  {parts[2].value}
                  <small>{parts[4].value.toLowerCase()}</small>
                </>
              )}
            </FormattedTimeParts>
          </p>
        </div>
        <div className="body">
          <p className="title">
            {ans.topic[locale]}: {ans.title}
          </p>
          <p className="answer">{ans.body}</p>
        </div>
        {open && ans.ref.length > 0 && (
          <div className="ref">
            <p>
              <FormattedMessage id="ref" value="Ref." />
            </p>
            <ul className="ref">
              {ans.ref.map((ref, i) =>
                ref.book ? (
                  <li key={i}>
                    <span>{ref.book}</span>,{" "}
                    <FormattedMessage id="page" defaultMessage="Page" />{" "}
                    <span>
                      <FormattedNumber value={ref.part} />
                    </span>
                    , <FormattedMessage id="part" defaultMessage="Part" />{" "}
                    <span>
                      <FormattedNumber value={ref.page} />
                    </span>
                  </li>
                ) : (
                  <li key={i}>
                    <span>{ref.sura}</span>,{" "}
                    <FormattedMessage id="aayat" defaultMessage="Aayat" />{" "}
                    <span>
                      <FormattedNumber value={ref.aayat} />
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        {!open && (
          <div className="tags">
            <p className="tag">
              <FormattedMessage
                values={{ number: <FormattedNumber value={ans.ref.length} /> }}
                id="ans.tag.refCount"
                defaultMessage={`${ans.ref.length} Reference(s)`}
              />
            </p>
          </div>
        )}
        <span onClick={() => setOpen(!open)} className="showFull">
          {open ? "পুরো উত্তর গোপন করুন" : "পুরো উত্তর দেখুন"}
        </span>
      </div>
      {ans.source._id === user._id ? (
        <Actions
          icon="reorder-two-outline"
          actions={[
            { label: "Edit", action: edit },
            { label: "Remove", action: remove },
          ]}
        />
      ) : (
        <Actions
          icon="reorder-two-outline"
          actions={[{ label: "Report", action: report }]}
        />
      )}
    </div>
  );
}

function UserQuestion({ history, match }) {
  const { user } = useContext(SiteContext);
  const [loading, setLoading] = useState(true);
  const [userQues, setUserQues] = useState({});
  const [answered, setAnswered] = useState(false);
  useEffect(getData, []);
  function getData() {
    fetch("/api/source/userQues/" + match.params._id)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setUserQues(data.content);
          if (
            data.content.ans.filter((item) => item.source._id === user._id)
              .length > 0
          ) {
            setAnswered(true);
          }
        } else {
          throw data;
        }
      })
      .catch((err) => {
        alert("something went wrong");
        console.log(err);
      });
  }
  if (userQues.ques) {
    return (
      <div className="view userQues">
        <div className="container">
          <div className="ques">
            <div className="user">
              <p className="name">
                <b>{userQues.user.name}</b>
                <span className="separator" />
                <i>
                  <span className="add">{userQues.user.add}</span>
                </i>
              </p>
              <p className="date">
                <FormattedDate
                  value={userQues.createdAt}
                  day="numeric"
                  month="long"
                  year="numeric"
                />
                <span className="separator" />
                <FormattedTimeParts value={userQues.createdAt}>
                  {(parts) => (
                    <>
                      {parts[0].value}
                      {parts[1].value}
                      {parts[2].value}
                      <small>{parts[4].value.toLowerCase()}</small>
                    </>
                  )}
                </FormattedTimeParts>
              </p>
            </div>
            <p className="body">{userQues.ques.body}</p>
          </div>
          {!answered ? (
            <Link className="addAns" to={`${match.url}/add`}>
              Add Answer
            </Link>
          ) : (
            <div className="hr" />
          )}
          {userQues.ans.map((item) => (
            <Answer
              key={item._id}
              ques={userQues}
              ans={item}
              setQues={setUserQues}
            />
          ))}
          <Route path={`${match.url}/add`}>
            <Modal
              open={true}
              setOpen={() => history.push(match.url)}
              className="answerForm"
            >
              <UserQuestionAnswerForm
                setQues={setUserQues}
                ques={userQues.ques}
                _id={userQues._id}
              />
            </Modal>
          </Route>
        </div>
      </div>
    );
  }
  return (
    <div className="view">
      {loading ? <h1>loading</h1> : <p>Question did not found!</p>}
    </div>
  );
}

function JamiaProfile() {
  const { user, locale } = useContext(SiteContext);
  return (
    <div className="main jamiaProfile">
      <Sidebar
        views={[
          { label: "New Fatwa", path: "/jamia/add", icon: "add" },
          {
            label: "Question feed",
            path: "/jamia/questionFeed",
            icon: "chatbox-ellipses",
          },
          { label: "Fatwa", path: "/jamia/fatwa", icon: "reader" },
          {
            label: "User Submissions",
            path: "/jamia/userSubmissions",
            icon: "people",
          },
        ]}
      >
        <div className="profile">
          <Link to="/jamia/profile">
            <h2>{user.name[locale][0]}</h2>
          </Link>
          <p>{user.name[locale]}</p>
          <p className="add">{user.add}</p>
        </div>
      </Sidebar>
      <Switch>
        <Route
          path="/jamia/add"
          component={(props) => (
            <div className="view">
              <h1>Add new Fatwa</h1>
              <AddFatwaForm {...props} />
            </div>
          )}
        />
        <Route path="/jamia/questionFeed" component={QuestionFeed} />
        <Route path="/jamia/userQuestion/:_id" component={UserQuestion} />
        <Route path="/jamia" exact component={JamiaAllFatwa} />
        <Route path="/jamia/fatwa" component={JamiaAllFatwa} />
        <Route path="/jamia/profile" component={Profile} />
        <Route path="/jamia/userSubmissions" component={UserSubmissions} />
        <Route path="/">
          <div className="view">
            <h3>404</h3>
            <p>broken link</p>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default JamiaProfile;
