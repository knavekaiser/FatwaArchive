import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { SiteContext } from "../Context.js";
import "./CSS/AdminPanel.min.css";
import {
  Input,
  Textarea,
  ComboboxMulti,
  Combobox,
  MultipleInput,
  PasswordInput,
  Checkbox,
  topics,
  ID,
  $,
} from "./FormElements";
import { DataEditForm, PasswordEditForm } from "./Forms";
import { Tabs, Actions, Sidebar, View } from "./TableElements";
import {
  FormattedDate,
  FormattedDateParts,
  FormattedMessage,
  FormattedNumber,
} from "react-intl";

function SingleFatwa({ data, setData }) {
  const fatwa = data;
  const history = useHistory();
  const editFatwa = (path) => history.push(path);
  function deleteFatwa(id) {
    fetch(`/api/fatwa/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((item) => item._id !== id);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <tr data-id={fatwa._id}>
      <td>
        <Link
          title={`Show all Fatwa from ${fatwa.jamia}`}
          to={`/jamia/${fatwa.jamia}`}
        >
          {fatwa.jamia}
        </Link>
      </td>
      <td>
        <Link
          title={`Show all Fatwa about ${fatwa.topic}`}
          to={`/tableOfContent/${fatwa.topic}`}
        >
          {fatwa.topic}
        </Link>
      </td>
      <td>{fatwa.translation.split(" ")[0]}</td>
      <td>
        <FormattedDate
          value={new Date(fatwa.added)}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td>
        <Link target="_blank" title="Show Fatwa" to={`/fatwa/${fatwa.link}`}>
          {fatwa.title.length > 30
            ? fatwa.title.substring(0, 40) + "..."
            : fatwa.title}
        </Link>
      </td>
      <td>
        <Actions
          id={ID(8)}
          actions={[
            {
              action: () => editFatwa(`/admin/addFatwa/${fatwa._id}`),
              option: "Edit",
            },
            { action: () => deleteFatwa(fatwa._id), option: "Delete" },
          ]}
        />
      </td>
    </tr>
  );
}
function SingleFatwaSubmition({ data, setData }) {
  const { locale, setFatwaToEdit } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const fatwa = data;
  const history = useHistory();
  const editFatwa = (path) => history.push(path);
  function editFatwaSubmition(id) {
    setFatwaToEdit(fatwa);
    history.push("/admin/add");
  }
  function acceptFatwa() {
    fetch(`/api/admin/fatwaSubmitions/accept/${fatwa._id}`, { method: "POST" })
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
        alert("something went wrong!");
        console.log(err);
      });
  }
  function removeSubmition() {
    fetch(`/api/admin/fatwaSubmitions/remove/${fatwa._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((item) => item._id !== fatwa._id);
          });
        } else {
          alert("something went wrong!");
        }
      })
      .catch((err) => {
        alert("something went wrong!");
        console.log(err);
      });
  }
  return open ? (
    <tr data-id={fatwa._id} className="full">
      <td className="label">Submitted</td>
      <td className="data">
        <FormattedDate
          value={new Date(fatwa.submitted)}
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
          <td className="data">{fatwa.ques["en-US"]}</td>
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
      <td className="btns data">
        <button onClick={acceptFatwa}>
          <ion-icon name="checkmark-outline"></ion-icon> Accept
        </button>
        <button onClick={() => setOpen(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon> Hide Detail
        </button>
        <button onClick={editFatwaSubmition}>
          <ion-icon name="pencil-outline"></ion-icon> Edit
        </button>
        <button onClick={removeSubmition}>
          <ion-icon name="trash-outline"></ion-icon> Delete
        </button>
      </td>
    </tr>
  ) : (
    <tr data-id={fatwa._id} onClick={() => setOpen(true)}>
      <td>
        <FormattedDate
          value={new Date(fatwa.submitted)}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td>{fatwa.topic[locale]}</td>
      <td>{fatwa.jamia}</td>
      <td>{fatwa.title[locale]}</td>
    </tr>
  );
}
function AllFatwa({ history, location, match }) {
  return (
    <div className="view">
      <h1 className="viewTitle">Fatwa</h1>
      <Tabs page="/admin/fatwa/" tabs={["Live", "Submitions"]} />
      <Switch>
        <Route path="/admin/fatwa" exact>
          <View
            key="allFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/admin/allfatwa/filter?"
            categories={[
              {
                name: "topic",
                input: (
                  <ComboboxMulti
                    id={ID(8)}
                    maxHeight={300}
                    label="topic"
                    data={topics}
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
                name: "jamia",
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={500}
                    label="jamia"
                    data={["jamia 1", "jamia 2", "jamia 3"]}
                    required={true}
                  />
                ),
              },
              {
                name: "translation",
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={500}
                    label="jamia"
                    data={["Generated", "Manual"]}
                    required={true}
                  />
                ),
              },
            ]}
            columns={[
              { column: "jamia", sort: true, colCode: "jamia" },
              { column: "topic", sort: true, colCode: "topic" },
              { column: "translation", sort: false, colCode: "translation" },
              { column: "date", sort: true, colCode: "added" },
              { column: "title", sort: false, colCode: "title" },
            ]}
            defaultSort={{ column: "added", order: "des" }}
          />
        </Route>
        <Route path="/admin/fatwa/live">
          <View
            key="allFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/admin/allfatwa/filter?"
            categories={[
              {
                name: "topic",
                input: (
                  <ComboboxMulti
                    id={ID(8)}
                    maxHeight={300}
                    label="topic"
                    data={topics}
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
                name: "jamia",
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={500}
                    label="jamia"
                    data={["jamia 1", "jamia 2", "jamia 3"]}
                    required={true}
                  />
                ),
              },
              {
                name: "translation",
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={500}
                    label="jamia"
                    data={["Generated", "Manual"]}
                    required={true}
                  />
                ),
              },
            ]}
            columns={[
              { column: "jamia", sort: true, colCode: "jamia" },
              { column: "topic", sort: true, colCode: "topic" },
              { column: "translation", sort: false, colCode: "translation" },
              { column: "date", sort: true, colCode: "added" },
              { column: "title", sort: false, colCode: "title" },
            ]}
            defaultSort={{ column: "added", order: "des" }}
          />
        </Route>
        <Route path="/admin/fatwa/submitions">
          <View
            key="allFatwaSubmition"
            Element={SingleFatwaSubmition}
            id="fatwaSubmitions"
            api="api/admin/fatwaSubmitions/filter?"
            categories={[
              {
                name: "topic",
                input: (
                  <ComboboxMulti
                    id={ID(8)}
                    maxHeight={300}
                    label="topic"
                    data={topics}
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
                name: "jamia",
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={500}
                    label="jamia"
                    data={["jamia 1", "jamia 2", "jamia 3"]}
                    required={true}
                  />
                ),
              },
              {
                name: "translation",
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={500}
                    label="jamia"
                    data={["Generated", "Manual"]}
                    required={true}
                  />
                ),
              },
            ]}
            columns={[
              { column: "date", sort: true, colCode: "submitted" },
              { column: "topic", sort: true, colCode: "topic" },
              { column: "jamia", sort: true, colCode: "jamia" },
              { column: "title", sort: false },
            ]}
            defaultSort={{ column: "added", order: "des" }}
          />
        </Route>
      </Switch>
    </div>
  );
}

function SingleJamiaSubmition({ data, setData }) {
  const jamia = data;
  const { locale } = useContext(SiteContext);
  const [showFull, setShowFull] = useState(false);
  function accept(_id) {
    fetch(`/api/admin/jamia/accept/${_id}`, {
      method: "POST",
    })
      .then((res) => {
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((submitions) => submitions._id !== _id);
          });
        }
      })
      .catch((err) => console.log(err));
  }
  function reject(_id) {
    fetch(`/api/admin/jamia/reject/${_id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((submitions) => submitions._id !== _id);
          });
        }
      })
      .catch((err) => console.log(err));
  }
  return !showFull ? (
    <tr onClick={() => (showFull ? setShowFull(false) : setShowFull(true))}>
      <td>
        <FormattedDate
          value={new Date(jamia.submitted)}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td>
        {jamia.name}
        <span>{jamia.address}</span>
      </td>
      <td>{jamia.primeMufti}</td>
      <td>
        <a href={`tel:${jamia.contact}`}>{jamia.contact.replace("+88", "")}</a>
      </td>
    </tr>
  ) : (
    <tr
      className="fullDetail"
      onClick={() => (showFull ? setShowFull(false) : setShowFull(true))}
    >
      <td className="label">Submitted</td>
      <td className="data">
        <FormattedDate
          value={new Date(jamia.submitted)}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td className="label">ID</td>
      <td className="data">{jamia.id}</td>
      <td className="label">Name</td>
      <td className="data">{jamia.name}</td>
      <td className="label">Prime Mufti</td>
      <td className="data">{jamia.primeMufti}</td>
      <td className="label">Address</td>
      <td className="data">{jamia.address}</td>
      <td className="label">Contact</td>
      <td className="data">
        <a href={`tel:${jamia.contact}`}>{jamia.contact.replace("+88", "")}</a>
      </td>
      <td className="label">Applicant's Name</td>
      <td className="data">{jamia.applicant.name}</td>
      <td className="label">Applicant's designation</td>
      <td className="data">{jamia.applicant.designation}</td>
      <td className="label">Applicant's mobile</td>
      <td className="data">
        <a href={`tel:${jamia.applicant.mobile}`}>
          {jamia.applicant.mobile.replace("+88", "")}
        </a>
      </td>
      <td className="btns">
        <button className="accept" onClick={() => accept(jamia._id)}>
          <ion-icon name="checkmark-outline"></ion-icon>Accept
        </button>
        <button className="reject" onClick={() => reject(jamia._id)}>
          <ion-icon name="close-outline"></ion-icon>Reject
        </button>
      </td>
    </tr>
  );
}
function SingleJamia({ data, setData }) {
  const jamia = data;
  const { locale } = useContext(SiteContext);
  const [showFull, setShowFull] = useState(false);
  function ghost(_id) {
    console.log(_id);
  }
  function remove(_id) {
    console.log(_id);
  }
  const patchApi = `/api/admin/jamia/edit/${jamia._id}`;
  return !showFull ? (
    <tr onClick={() => setShowFull(true)}>
      <td className="jamiaId">{jamia.id}</td>
      <td className="jamiaName">
        <Link
          title={`view ${jamia.name["en-US"]}`}
          to={`/jamia/${jamia.id}`}
          target="_black"
        >
          {jamia.name[locale]}
          <ion-icon name="open-outline"></ion-icon>
        </Link>
        <span>{jamia.address}</span>
      </td>
      <td className="jamiaPrimeMufti">{jamia.primeMufti[locale]}</td>
      <td className="jamiaJoined">
        <FormattedDate
          value={new Date(jamia.joined)}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td className="jamiaFatwaCount">
        <FormattedNumber value={new Date(jamia.fatwa)} />
      </td>
      <td className="jamiaContact">
        <a title="Call Jamia" href={`tel:${jamia.contact}`}>
          {jamia.contact.replace("+88", "")}
        </a>
      </td>
    </tr>
  ) : (
    <tr className="fullDetail">
      <td className="label">Joined</td>
      <td className="data">
        <FormattedDate
          value={new Date(jamia.joined)}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td className="label">Fatwa</td>
      <td className="data">
        <FormattedNumber value={jamia.fatwa} />
      </td>
      <td className="label">ID</td>
      <td className="data">{jamia.id}</td>
      <td className="label">Password</td>
      <td className="data">
        <PasswordEditForm api={patchApi} />
      </td>
      <td className="label">Name (Bangla)</td>
      <td className="data">
        <DataEditForm
          api={patchApi}
          defaultValue={jamia.name["bn-BD"]}
          Element={Input}
          validation={/^[ঀ-৾\s(),]+$/}
          fieldCode="name.bn-BD"
        />
      </td>
      <td className="label">Name (Enlish)</td>
      <td className="data">
        <DataEditForm
          api={patchApi}
          defaultValue={jamia.name["en-US"]}
          Element={Input}
          validation={/^[a-zA-Z\s(),]+$/}
          fieldCode="name.en-US"
        />
      </td>
      <td className="label">Prime Mufti (Bangla)</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.primeMufti["bn-BD"]}
          Element={Input}
          max={200}
          fieldCode="primeMufti.bn-BD"
          api={patchApi}
        />
      </td>
      <td className="label">Prime Mufti (English)</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.primeMufti["en-US"]}
          Element={Input}
          max={200}
          fieldCode="primeMufti.en-US"
          api={patchApi}
        />
      </td>
      <td className="label">Founder</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.founder}
          Element={Textarea}
          max={200}
          fieldCode="founder"
          api={patchApi}
        />
      </td>
      <td className="label">Address</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.address}
          Element={Textarea}
          max={200}
          fieldCode="address"
          api={patchApi}
        />
      </td>
      <td className="label">Contact</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.contact}
          Element={Input}
          validation={/^\+8801\d{0,9}$/}
          tel={true}
          fieldCode="contact"
          api={patchApi}
        />
      </td>
      <td className="label">About</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.about}
          Element={Textarea}
          validation={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
          fieldCode="about"
          api={patchApi}
        />
      </td>
      <td className="label">Applicant's Name</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.applicant.name}
          Element={Input}
          validation={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
          fieldCode="applicant.name"
          api={patchApi}
        />
      </td>
      <td className="label">Applicant's designation</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.applicant.designation}
          Element={Input}
          validation={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
          fieldCode="applicant.designation"
          api={patchApi}
        />
      </td>
      <td className="label">Applicant's mobile</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.applicant.mobile}
          Element={Input}
          validation={/^\+8801\d{0,9}$/}
          tel={true}
          fieldCode="applicant.mobile"
          api={patchApi}
        />
      </td>
      <td className="btns">
        <button className="ghost" onClick={() => ghost(jamia._id)}>
          <ion-icon name="skull-outline"></ion-icon>Ghost
        </button>
        <button className="hideDetail" onClick={() => setShowFull(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon>Hide Detail
        </button>
        <button className="remove" onClick={() => remove(jamia._id)}>
          <ion-icon name="trash-outline"></ion-icon>Remove
        </button>
      </td>
    </tr>
  );
}
function AllJamia() {
  return (
    <div className="view">
      <h1 className="viewTitle">Jamia</h1>
      <Tabs page="/admin/jamia/" tabs={["Active", "Submitions"]} />
      <Switch>
        <Route path="/admin/jamia" exact>
          <View
            key="allJamia"
            Element={SingleJamia}
            defaultSort={{ column: "joined", order: "des" }}
            id="allJamia"
            api="api/admin/jamia/active/filter?"
            columns={[
              { column: "id", sort: false, colCode: "id" },
              { column: "name", sort: false, colCode: "name" },
              { column: "prime mufti", sort: false, colCode: "primeMufti" },
              { column: "joined", sort: true, colCode: "joined" },
              { column: "fatwa", sort: true, colCode: "fatwa" },
              { column: "contact", sort: false, colCode: "contact" },
            ]}
          />
        </Route>
        <Route path="/admin/jamia/active">
          <View
            key="allActiveJamia"
            Element={SingleJamia}
            defaultSort={{ column: "joined", order: "des" }}
            id="allJamia"
            api="api/admin/jamia/active/filter?"
            columns={[
              { column: "id", sort: false, colCode: "id" },
              { column: "name", sort: false, colCode: "name" },
              { column: "founder", sort: false, colCode: "founder" },
              { column: "joined", sort: true, colCode: "joined" },
              { column: "fatwa", sort: true, colCode: "fatwa" },
              { column: "contact", sort: false, colCode: "contact" },
            ]}
          />
        </Route>
        <Route path="/admin/jamia/submitions">
          <View
            key="allSubmittedJamia"
            Element={SingleJamiaSubmition}
            defaultSort={{ column: "submitted", order: "des" }}
            id="jamiaSubmitions"
            api="api/admin/jamia/submitions/filter?"
            columns={[
              { column: "submitted", sort: true, colCode: "submitted" },
              { column: "name & address", sort: false, colCode: "name" },
              { column: "prime mufti", sort: false, colCode: "primeMufti" },
              { column: "contact", sort: false, colCode: "contact" },
            ]}
          />
        </Route>
      </Switch>
    </div>
  );
}

function SinglePatreon() {
  return (
    <tr>
      <td>Make patreon rows</td>
    </tr>
  );
}
function Patreons() {
  return (
    <div className="view">
      <h1>Patreons</h1>
      <Tabs page="/admin/patreons/" tabs={["All"]} />
      <Switch>
        <Route path="/admin/patreons">
          <View
            Element={SinglePatreon}
            defaultSort={{ column: "date", order: "des" }}
            id="allPatreons"
            api="api/admin/patreons/filter?"
            categories={[]}
            columns={[
              { column: "name", sort: false, colCode: "name" },
              { column: "amount", sort: true, colCode: "amount" },
              { column: "date", sort: true, colCode: "date" },
            ]}
          />
        </Route>
      </Switch>
    </div>
  );
}

function SingleUserReview() {
  return (
    <tr>
      <td>Make user review rows</td>
    </tr>
  );
}
function UserReview() {
  //this will have 3 tabs. 1) user submitted question, 2) review, 3) report
  return (
    <div className="view">
      <h1>User Review</h1>
      <Tabs
        page="/admin/userReview/"
        tabs={["Review", "Questions", "report"]}
      />
      <Switch>
        <Route path="/admin/userReview">
          <View
            Element={SingleUserReview}
            defaultSort={{ column: "date", order: "des" }}
            id="allPatreons"
            api="api/admin/userReview/filter?"
            categories={[]}
            columns={[
              { column: "name", sort: false, colCode: "name" },
              { column: "date", sort: true, colCode: "date" },
              { column: "message", sort: false, colCode: "message" },
            ]}
          />
        </Route>
        <Route path="/admin/questions">
          <View
            Element={SingleUserReview}
            defaultSort={{ column: "date", order: "des" }}
            id="allPatreons"
            api="api/admin/userReview/filter?"
            categories={[]}
            columns={[
              { column: "name", sort: false, colCode: "name" },
              { column: "date", sort: true, colCode: "date" },
              { column: "message", sort: false, colCode: "message" },
            ]}
          />
        </Route>
        <Route path="/admin/report">
          <View
            Element={SingleUserReview}
            defaultSort={{ column: "date", order: "des" }}
            id="allPatreons"
            api="api/admin/userReview/filter?"
            categories={[]}
            columns={[
              { column: "name", sort: false, colCode: "name" },
              { column: "date", sort: true, colCode: "date" },
              { column: "message", sort: false, colCode: "message" },
            ]}
          />
        </Route>
      </Switch>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="main adminPanel">
      <Sidebar
        views={[
          { label: "Jamia", path: "/admin/jamia", icon: "book" },
          { label: "Fatwa", path: "/admin/fatwa", icon: "reader" },
          {
            label: "Patreons",
            path: "/admin/patreons",
            icon: "umbrella",
          },
          {
            label: "User Review",
            path: "/admin/userreview",
            icon: "people",
          },
        ]}
      >
        <div className="profile">
          <h2>A</h2>
        </div>
      </Sidebar>
      <Switch>
        <Route path="/admin" exact component={AllJamia} />
        <Route path="/admin/jamia" component={AllJamia} />
        <Route path="/admin/fatwa/:filter?" component={AllFatwa} />
        <Route path="/admin/patreons" component={Patreons} />
        <Route path="/admin/userReview" component={UserReview} />
      </Switch>
    </div>
  );
}

export default AdminPanel;
