import React, { useState, useContext, useEffect, useRef } from "react";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import { Tabs, View, Sidebar } from "./TableElements";
import {
  ID,
  Input,
  Combobox,
  Textarea,
  // ComboboxMulti,
  Submit,
  topics,
} from "./FormElements";
import "./CSS/JamiaProfile.min.css";
import {
  FormattedDate,
  FormattedNumber,
  FormattedTime,
  FormattedTimeParts,
} from "react-intl";
import { AddFatwaForm, DataEditForm, PasswordEditForm } from "./Forms";

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
  const patchApi = `/api/source/edit/${user._id}`;
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
            max={200}
            fieldCode="address"
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
            fieldCode="applicant.name"
            api={patchApi}
          />
        </li>
        <li className="label">Applicant's designation</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.appl.des}
            Element={Input}
            pattern={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
            fieldCode="applicant.designation"
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
            fieldCode="applicant.mobile"
            api={patchApi}
          />
        </li>
      </ul>
    </div>
  );
}

function SingleFatwa({ data, setData }) {
  const { locale, setFatwaToEdit } = useContext(SiteContext);
  const fatwa = data;
  const history = useHistory();
  const [open, setOpen] = useState(false);
  function edit() {
    setFatwaToEdit(fatwa);
    history.push(`/jamia/add/${fatwa._id}`);
  }
  function deleteFatwa() {
    if (window.confirm("Do you want to delete this fatwa?")) {
      fetch(`/api/fatwa/${fatwa._id}`, {
        method: "DELETE",
      })
        .then((res) => {
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
              {
                name: "translation",
                input: (
                  <Combobox
                    maxHeight={500}
                    label="jamia"
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
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  //add button for instant answer.
  //use useLayoutEffect to show/hide "...more/...less"
  return (
    <li
      ref={container}
      className={`question ${!open ? "mini" : ""}`}
      onClick={(e) => {
        if (e.target === container.current) {
          setOpen(!open);
        }
      }}
    >
      <div className="user">
        <p className="name">{data.name}</p>
        {open && (
          <p className="contact">
            {data.mobile ? (
              <a href={`tel:${data.mobile}`}>{data.mobile}</a>
            ) : (
              <a href={`email:${data.email}`}>{data.email}</a>
            )}
          </p>
        )}
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
      <p className="ques">{data.ques}</p>
      <ul className="tags">
        <li className="tag">{data.topic}</li>
        <li className="tag">#2021</li>
      </ul>
      <div className="btns">
        {open && (
          <>
            <Submit
              label={
                <>
                  <ion-icon name="checkmark-outline"></ion-icon> Accept
                </>
              }
              onClick={() => setLoading(true)}
              loading={loading}
            />
            <button type="submit">
              <ion-icon name="star-outline"></ion-icon> Answer
            </button>
          </>
        )}
        <button className="more" onClick={() => setOpen(!open)}>
          {open ? (
            <>
              <ion-icon name="chevron-up-outline"></ion-icon>
            </>
          ) : (
            <>
              <ion-icon name="chevron-down-outline"></ion-icon>
            </>
          )}
        </button>
      </div>
    </li>
  );
}
function NewQuestions() {
  const abortController = new AbortController();
  const signal = abortController.signal;
  const { locale } = useContext(SiteContext);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ column: "submitted", order: "dsc" });
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
        setData(data);
      })
      .catch((err) => {
        console.log(err);
        console.log("handle error!!");
      });
    return () => abortController.abort();
  }
  useEffect(() => {});
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
              value: { column: "submitted", order: "dsc" },
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
        <Route path="/jamia" exact component={JamiaAllFatwa} />
        <Route path="/jamia/fatwa" component={JamiaAllFatwa} />
        <Route path="/jamia/profile" component={Profile} />
        <Route path="/jamia/userSubmissions" component={UserSubmissions} />
      </Switch>
    </div>
  );
}

export default JamiaProfile;
