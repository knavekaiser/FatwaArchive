import React, { useState, useContext } from "react";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import { Tabs, View, Sidebar } from "./TableElements";
import {
  ID,
  Input,
  Combobox,
  Textarea,
  ComboboxMulti,
  topics,
} from "./FormElements";
import "./CSS/JamiaProfile.min.css";
import { FormattedDate, FormattedNumber } from "react-intl";
import { AddFatwaForm, DataEditForm, PasswordEditForm } from "./Forms";

function Profile() {
  const { user } = useContext(SiteContext);
  const patchApi = `/api/jamia/edit/${user._id}`;
  return (
    <div className="view">
      <ul id="profileInfo">
        <li className="label">Joined</li>
        <li className="data">
          <FormattedDate
            value={new Date(user.joined)}
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
            validation={/^[ঀ-৾\s(),]+$/}
            fieldCode="name.bn-BD"
          />
        </li>
        <li className="label">Name (Enlish)</li>
        <li className="data">
          <DataEditForm
            api={patchApi}
            defaultValue={user.name["en-US"]}
            Element={Input}
            validation={/^[a-zA-Z\s(),]+$/}
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
            validation={/^\+8801\d{0,9}$/}
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
            validation={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
            fieldCode="about"
            api={patchApi}
          />
        </li>
        <li className="label">Applicant's Name</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.applicant.name}
            Element={Input}
            validation={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
            fieldCode="applicant.name"
            api={patchApi}
          />
        </li>
        <li className="label">Applicant's designation</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.applicant.designation}
            Element={Input}
            validation={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
            fieldCode="applicant.designation"
            api={patchApi}
          />
        </li>
        <li className="label">Applicant's mobile</li>
        <li className="data">
          <DataEditForm
            defaultValue={user.applicant.mobile}
            Element={Input}
            validation={/^\+8801\d{0,9}$/}
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
      <td>{fatwa.topic}</td>
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
          {fatwa.title}
        </Link>
      </td>
      <td>{fatwa.translation.split(" ")[0]}</td>
    </tr>
  );
}
function JamiaSingleFatwaSubmition({ data, setData }) {
  const { locale, setFatwaToEdit } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const fatwa = data;
  const history = useHistory();
  const editFatwa = (path) => history.push(path);
  function edit() {
    setFatwaToEdit(fatwa);
    history.push("/jamia/add");
  }
  function removeSubmition(id) {
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
  return open ? (
    <tr data-id={fatwa._id} className="full">
      <td className="label">Submitted</td>
      <td>
        <FormattedDate
          value={new Date(fatwa.submitted)}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td className="label">topic</td>
      <td>{fatwa.topic[locale]}</td>
      <td className="label">title (Bangla)</td>
      <td>{fatwa.title["bn-BD"]}</td>
      {fatwa.title["en-US"] && (
        <>
          <td className="label">title (English)</td>
          <td>{fatwa.title["en-US"]}</td>
        </>
      )}
      <td className="label">question (Bangla)</td>
      <td>{fatwa.ques["bn-BD"]}</td>
      {fatwa.ques["en-US"] && (
        <>
          <td className="label">question (English)</td>
          <td>{fatwa.ques["en-US"]}</td>
        </>
      )}
      <td className="label">answer (Bangla)</td>
      <td>{fatwa.ans["bn-BD"]}</td>
      {fatwa.ans["en-US"] && (
        <>
          <td className="label">answer (English)</td>
          <td>{fatwa.ans["en-US"]}</td>
        </>
      )}
      <td className="label">Ref.</td>
      <td>
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
      <td className="btns">
        <button onClick={() => setOpen(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon> Hide Detail
        </button>
        <button onClick={edit}>
          <ion-icon name="pencil-outline"></ion-icon> Edit
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
      <td>{fatwa.title[locale]}</td>
    </tr>
  );
}
function JamiaAllFatwa() {
  return (
    <div className="view">
      <h1 className="viewTitle">Fatwa</h1>
      <Tabs page="/jamia/fatwa/" tabs={["Live", "Submitions"]} />
      <Switch>
        <Route path="/jamia/fatwa" exact>
          <View
            key="jamiaAllFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/jamia/allFatwa/filter?"
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
            api="api/jamia/allFatwa/filter?"
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
              { column: "topic", sort: true, colCode: "topic" },
              { column: "date", sort: true, colCode: "added" },
              { column: "title", sort: false, colCode: "title" },
              { column: "translation", sort: true, colCode: "translation" },
            ]}
            defaultSort={{ column: "added", order: "des" }}
          />
        </Route>
        <Route path="/jamia/fatwa/submitions">
          <View
            key="jamiaAllFatwaSubmition"
            Element={JamiaSingleFatwaSubmition}
            id="fatwaSubmitions"
            api="api/jamia/fatwaSubmitions/filter?"
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
              { column: "title", sort: false },
            ]}
            defaultSort={{ column: "added", order: "des" }}
          />
        </Route>
      </Switch>
    </div>
  );
}

function JamiaProfile() {
  return (
    <div className="main jamiaProfile">
      <Sidebar
        views={[
          { label: "New Fatwa", path: "/jamia/add", icon: "add" },
          { label: "Fatwa", path: "/jamia/fatwa", icon: "reader" },
        ]}
      >
        <div className="profile">
          <Link to="/jamia/profile">
            <h2>M</h2>
          </Link>
        </div>
      </Sidebar>
      <Switch>
        <Route
          path="/jamia/add"
          component={(props) => (
            <div className="view">
              <AddFatwaForm {...props} />
            </div>
          )}
        />
        <Route path="/jamia" exact component={JamiaAllFatwa} />
        <Route path="/jamia/fatwa" component={JamiaAllFatwa} />
        <Route path="/jamia/profile" component={Profile} />
      </Switch>
    </div>
  );
}

export default JamiaProfile;
