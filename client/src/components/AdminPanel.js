import React, { useState, useContext } from "react";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { SiteContext } from "../Context.js";
import "./CSS/AdminPanel.min.css";
import {
  Input,
  Textarea,
  ComboboxMulti,
  Combobox,
  topics,
  Submit,
  ID,
} from "./FormElements";
import { DataEditForm, PasswordEditForm } from "./Forms";
import { Tabs, Actions, Sidebar, View } from "./TableElements";
import { FormattedDate, FormattedNumber } from "react-intl";

function SingleFatwa({ data, setData }) {
  const { locale } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fatwa = data;
  const history = useHistory();
  const editFatwa = (path) => history.push(path);
  function deleteFatwa() {
    setLoading(true);
    fetch(`/api/fatwa/${fatwa._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((item) => item._id !== fatwa._id);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return open ? (
    <tr data-id={fatwa._id} className={`${open ? "full" : ""}`}>
      <td className="label">Added</td>
      <td className="data">
        <FormattedDate
          value={new Date(fatwa.added)}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td className="label">jamia</td>
      <td className="data">{fatwa.jamia}</td>
      <td className="label">topic</td>
      <td className="data">{fatwa.topic[locale]}</td>
      <td className="label">title (Bangla)</td>
      <td className="data">
        <Link target="_blank" to={`/fatwa/${fatwa.link["bn-BD"]}`}>
          {fatwa.title["bn-BD"]}
        </Link>
      </td>
      {fatwa.title["en-US"] && (
        <>
          <td className="label">title (English)</td>
          <td className="data">
            <Link to={`/fatwa/${fatwa.link["en-US"]}`}>
              {fatwa.title["en-US"]}
            </Link>
          </td>
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
          {fatwa.ref &&
            fatwa.ref.map((item, i) =>
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
        <button onClick={() => setOpen(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon> Hide Detail
        </button>
        <Submit
          loading={loading}
          onClick={deleteFatwa}
          label={
            <>
              <ion-icon name="trash-outline"></ion-icon> Delete
            </>
          }
        />
      </td>
    </tr>
  ) : (
    <tr data-id={fatwa._id} onClick={() => setOpen(true)}>
      <td>{fatwa.jamia}</td>
      <td>{fatwa.topic[locale]}</td>
      <td>{fatwa.translation.split(" ")[0]}</td>
      <td>
        <FormattedDate
          value={new Date(fatwa.added)}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td>{fatwa.title[locale]}</td>
    </tr>
  );
}
function SingleFatwaSubmition({ data, setData }) {
  const { locale, setFatwaToEdit } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fatwa = data;
  const history = useHistory();
  const editFatwa = (path) => history.push(path);
  function editFatwaSubmition(id) {
    setFatwaToEdit(fatwa);
    history.push("/admin/add");
  }
  function acceptFatwa() {
    setLoading(true);
    fetch(`/api/admin/fatwaSubmitions/accept/${fatwa._id}`, { method: "POST" })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
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
    setLoading(true);
    fetch(`/api/admin/fatwaSubmitions/remove/${fatwa._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        setLoading(false);
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
    <tr data-id={fatwa._id} className={`full ${loading ? "loading" : ""}`}>
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
        <Submit
          loading={loading}
          onClick={acceptFatwa}
          label={
            <>
              <ion-icon name="checkmark-outline"></ion-icon> Accept
            </>
          }
        />
        <button disabled={loading} onClick={() => setOpen(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon> Hide Detail
        </button>
        <button disabled={loading} onClick={editFatwaSubmition}>
          <ion-icon name="pencil-outline"></ion-icon> Edit
        </button>
        <Submit
          loading={loading}
          onClick={removeSubmition}
          label={
            <>
              <ion-icon name="trash-outline"></ion-icon> Delete
            </>
          }
        />
      </td>
    </tr>
  ) : (
    <tr
      className={loading ? "loading" : ""}
      data-id={fatwa._id}
      onClick={() => setOpen(true)}
    >
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
            ]}
            columns={[
              { column: "date", sort: true, colCode: "submitted" },
              { column: "topic", sort: true, colCode: "topic" },
              { column: "jamia", sort: true, colCode: "jamia" },
              { column: "title", sort: false },
            ]}
            defaultSort={{ column: "submitted", order: "des" }}
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
  const [loading, setLoading] = useState(false);
  function accept() {
    setLoading(true);
    fetch(`/api/admin/jamia/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: jamia._id }),
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((submitions) => submitions._id !== jamia._id);
          });
        }
      })
      .catch((err) => console.log(err));
  }
  function reject() {
    setLoading(true);
    fetch(`/api/admin/jamia/reject`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: jamia._id }),
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((submitions) => submitions._id !== jamia._id);
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
    <tr className="full">
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
      <td className="data btns">
        <Submit
          loading={loading}
          onClick={accept}
          label={
            <>
              <ion-icon name="checkmark-outline"></ion-icon> Accept
            </>
          }
        />
        <Submit
          loading={loading}
          onClick={reject}
          label={
            <>
              <ion-icon name="close-outline"></ion-icon> Reject
            </>
          }
        />
      </td>
    </tr>
  );
}
function SingleJamia({ data, setData }) {
  const jamia = data;
  const { locale } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);
  function ghost(_id) {
    console.log(_id);
  }
  function remove() {
    if (window.confirm("You want to delete this jamia")) {
      fetch(`/api/admin/jamia/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: jamia._id }),
      })
        .then((res) => {
          if (res.status === 200) {
            setData((prev) => {
              return prev.filter((item) => item._id !== jamia._id);
            });
          } else {
            alert("something went wrong");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("something went wrong");
        });
    }
  }
  const patchApi = `/api/admin/jamia/edit/${jamia._id}`;
  return !showFull ? (
    <tr onClick={() => setShowFull(true)}>
      <td className="jamiaId">{jamia.id}</td>
      <td className="jamiaName">
        {jamia.name[locale]}
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
    <tr className="full">
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
      <td className="data btns">
        <Submit
          loading={loading}
          onClick={ghost}
          label={
            <>
              <ion-icon name="skull-outline"></ion-icon> Ghost
            </>
          }
        />
        <button className="hideDetail" onClick={() => setShowFull(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon>Hide Detail
        </button>
        <Submit
          loading={loading}
          onClick={remove}
          label={
            <>
              <ion-icon name="trash-outline"></ion-icon> Remove
            </>
          }
        />
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
function SingleUserQuestions({ data, setData }) {
  const [open, setOpen] = useState(false);
  const ques = data;
  function remove() {
    console.log("remove question here");
  }
  return !open ? (
    <tr onClick={() => setOpen(true)}>
      <td>
        <FormattedDate
          value={ques.submitted}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td>
        {ques.name}
        <span>{ques.email}</span>
      </td>
      <td>{ques.ques}</td>
    </tr>
  ) : (
    <tr className="full">
      <td className="label">Submitted</td>
      <td className="data">
        <FormattedDate
          value={ques.submitted}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td className="label">Name</td>
      <td className="data">{ques.name}</td>
      <td className="label">Email</td>
      <td className="data">{ques.email}</td>
      <td className="label">Mobile</td>
      <td className="data">
        <a href={`tel:${ques.mobile}`}>{ques.mobile}</a>
      </td>
      <td className="label">Question</td>
      <td className="data">{ques.ques}</td>
      <td className="data btns">
        <button className="hideDetail" onClick={() => setOpen(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon>Hide Detail
        </button>
        <button className="remove" onClick={remove}>
          <ion-icon name="trash-outline"></ion-icon>Remove
        </button>
      </td>
    </tr>
  );
}
function UserReview() {
  return (
    <div className="view">
      <h1>User Review</h1>
      <Tabs
        page="/admin/user/"
        tabs={["Questions", "Answered Question", "Review", "report"]}
      />
      <Switch>
        <Route path="/admin/user" exact>
          <View
            Element={SingleUserQuestions}
            defaultSort={{ column: "submitted", order: "des" }}
            id="allQuestions"
            api="api/admin/userQuestion/filter?"
            columns={[
              { column: "date", sort: true, colCode: "submitted" },
              { column: "name", sort: false, colCode: "name" },
              { column: "question", sort: false, colCode: "ques" },
            ]}
          />
        </Route>
        <Route path="/admin/user/questions">
          <View
            Element={SingleUserQuestions}
            defaultSort={{ column: "submitted", order: "des" }}
            id="allQuestions"
            api="api/admin/userQuestion/filter?"
            columns={[
              { column: "date", sort: true, colCode: "submitted" },
              { column: "name", sort: false, colCode: "name" },
              { column: "question", sort: false, colCode: "ques" },
            ]}
          />
        </Route>
        <Route path="/admin/user/review">
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
        <Route path="/admin/user/report">
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
            label: "User Submitions",
            path: "/admin/user",
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
        <Route path="/admin/user" component={UserReview} />
      </Switch>
    </div>
  );
}

export default AdminPanel;
