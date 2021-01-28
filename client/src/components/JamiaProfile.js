import React, { useState, useContext, useEffect, useRef } from "react";
import { Route, Switch, Link, Redirect, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import { Tabs, View, Sidebar, Actions, LoadingPost } from "./TableElements";
import {
  ID,
  Input,
  Combobox,
  Mobile,
  Textarea,
  topics,
  SS,
  Submit,
} from "./FormElements";
import "./CSS/JamiaProfile.min.css";
import "./CSS/AdminPanel.min.css";
import {
  FormattedDate,
  FormattedNumber,
  FormattedTimeParts,
  FormattedMessage,
  injectIntl,
} from "react-intl";
import {
  AddFatwaForm,
  DataEditForm,
  PasswordEditForm,
  UserQuestionAnswerForm,
  UserQuestionReportForm,
} from "./Forms";
import { Modal } from "./Modals";

const encodeURL = (obj) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&");

function JamiaDetail() {
  const { user } = useContext(SiteContext);
  const patchApi = `/api/source/edit`;
  return (
    <div className="view">
      <h1>
        <FormattedMessage id="jamiaProfile" defaultMessage="Jamia Profile" />
      </h1>
      <ul id="profileInfo">
        <li className="label">
          <FormattedMessage id="joined" defaultMessage="Joined" />
        </li>
        <li className="data">
          <FormattedDate
            value={user.joined}
            day="numeric"
            month="numeric"
            year="2-digit"
          />
        </li>
        <li className="label">
          <FormattedMessage id="fatwa" defaultMessage="Fatwa" />
        </li>
        <li className="data">
          <FormattedNumber value={user.fatwa} />
        </li>
        <li className="label">
          <FormattedMessage id="id" defaultMessage="ID" />
        </li>
        <li className="data">{user.id}</li>
        <li className="label">
          <FormattedMessage id="password" defaultMessage="Password" />
        </li>
        <li className="data">
          <PasswordEditForm api={patchApi} />
        </li>
        <li className="label">
          <FormattedMessage id="name" defaultMessage="Name (Bangla)" />{" "}
          <small>
            (<FormattedMessage id="ban" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            api={patchApi}
            defaultValue={user.name["bn-BD"]}
            Element={Input}
            fieldCode="name.bn-BD"
          />
        </li>
        <li className="label">
          <FormattedMessage id="name" defaultMessage="Name (English)" />{" "}
          <small>
            (<FormattedMessage id="eng" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            api={patchApi}
            defaultValue={user.name["en-US"]}
            Element={Input}
            fieldCode="name.en-US"
          />
        </li>
        <li className="label">
          <FormattedMessage
            id="primeMufti"
            defaultMessage="Prime Mufti (Bangla)"
          />{" "}
          <small>
            (<FormattedMessage id="ban" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.primeMufti["bn-BD"]}
            Element={Input}
            max={200}
            fieldCode="primeMufti.bn-BD"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage
            id="primeMufti"
            defaultMessage="Prime Mufti (English)"
          />{" "}
          <small>
            (<FormattedMessage id="ban" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.primeMufti["en-US"]}
            Element={Input}
            max={200}
            fieldCode="primeMufti.en-US"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="founder" defaultMessage="Founder" />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.founder}
            Element={Textarea}
            max={200}
            fieldCode="founder"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="add" defaultMessage="Address" />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.address}
            Element={Textarea}
            fieldCode="add"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="contact" defaultMessage="Contact" />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.contact}
            Element={Mobile}
            tel={true}
            fieldCode="contact"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="about" defaultMessage="About" />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.about}
            Element={Textarea}
            fieldCode="about"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="applName" defaultMessage="Applicant's Name" />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.appl.name}
            Element={Input}
            fieldCode="appl.name"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage
            id="applDes"
            defaultMessage="Applicant's Designation"
          />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.appl.des}
            Element={Input}
            fieldCode="appl.des"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="applMob" defaultMessage="Applicant's Moblie" />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.appl.mob}
            Element={Mobile}
            tel={true}
            fieldCode="appl.mob"
            api={patchApi}
          />
        </li>
      </ul>
    </div>
  );
}
function MuftiDetail() {
  const { user } = useContext(SiteContext);
  const patchApi = `/api/source/edit`;
  return (
    <div className="view">
      <h1>
        <FormattedMessage id="jamiaProfile" defaultMessage="Jamia Profile" />
      </h1>
      <ul id="profileInfo">
        <li className="label">
          <FormattedMessage id="joined" defaultMessage="Joined" />
        </li>
        <li className="data">
          <FormattedDate
            value={user.joined}
            day="numeric"
            month="numeric"
            year="2-digit"
          />
        </li>
        <li className="label">
          <FormattedMessage id="fatwa" defaultMessage="Fatwa" />
        </li>
        <li className="data">
          <FormattedNumber value={user.fatwa} />
        </li>
        <li className="label">
          <FormattedMessage id="id" defaultMessage="ID" />
        </li>
        <li className="data">{user.id}</li>
        <li className="label">
          <FormattedMessage id="password" defaultMessage="Password" />
        </li>
        <li className="data">
          <PasswordEditForm api={patchApi} />
        </li>
        <li className="label">
          <FormattedMessage id="name" defaultMessage="Name (Bangla)" />{" "}
          <small>
            (<FormattedMessage id="ban" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            api={patchApi}
            defaultValue={user.name["bn-BD"]}
            Element={Input}
            fieldCode="name.bn-BD"
          />
        </li>
        <li className="label">
          <FormattedMessage id="name" defaultMessage="Name (English)" />{" "}
          <small>
            (<FormattedMessage id="eng" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            api={patchApi}
            defaultValue={user.name["en-US"]}
            Element={Input}
            fieldCode="name.en-US"
          />
        </li>
        <li className="label">
          <FormattedMessage id="add" defaultMessage="Address" />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.add}
            Element={Textarea}
            fieldCode="add"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="contact" defaultMessage="Contact" />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.mob}
            Element={Mobile}
            tel={true}
            fieldCode="mob"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage
            id="gradFrom"
            defaultMessage="Graduated from Bangla"
          />{" "}
          <small>
            (<FormattedMessage id="ban" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.grad.versity["bn-BD"]}
            Element={Input}
            fieldCode="grad.versity.bn-BD"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage
            id="gradFrom"
            defaultMessage="Graduated from English"
          />{" "}
          <small>
            (<FormattedMessage id="eng" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.grad.versity["en-US"]}
            Element={Input}
            fieldCode="grad.versity.en-US"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="work" defaultMessage="Work (bangla)" />{" "}
          <small>
            (<FormattedMessage id="ban" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.inst["bn-BD"]}
            Element={Input}
            fieldCode="inst.bn-BD"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="work" defaultMessage="Work (English)" />{" "}
          <small>
            (<FormattedMessage id="eng" />)
          </small>
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.inst["en-US"]}
            Element={Input}
            fieldCode="inst.en-US"
            api={patchApi}
          />
        </li>
        <li className="label">
          <FormattedMessage id="about" defaultMessage="About" />
        </li>
        <li className="data">
          <DataEditForm
            defaultValue={user.about}
            Element={Textarea}
            fieldCode="about"
            api={patchApi}
          />
        </li>
      </ul>
    </div>
  );
}

const JamiaAllFatwa = injectIntl(({ intl }) => {
  const { locale } = useContext(SiteContext);
  return (
    <div className="view">
      <h1 className="viewTitle">
        <FormattedMessage id="fatwa" defaultMessage="Fatwa" />
      </h1>
      <Tabs
        page="/source/fatwa/"
        tabs={[
          {
            label: <FormattedMessage id="live" defaultMessage="Live" />,
            link: "live",
          },
          {
            label: <FormattedMessage id="pending" defaultMessage="pending" />,
            link: "pending",
          },
        ]}
      />
      <Switch>
        <Route path="/source/fatwa" exact>
          <View
            key="jamiaAllFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/source/allFatwa/filter?"
            categories={[
              {
                default: true,
                fieldName: "title",
                name: intl.formatMessage({
                  id: "title",
                  defaultMessage: "Title",
                }),
                chip: intl.formatMessage({
                  id: "titleChip",
                  defaultMessage: "Title contains:",
                }),
                input: (
                  <Input
                    autoFocus={true}
                    label=<FormattedMessage
                      id="titleChip"
                      defaultMessage="Title contains:"
                    />
                    required={true}
                  />
                ),
              },
              {
                fieldName: "topic",
                name: intl.formatMessage({
                  id: "topic",
                  defaultMessage: "Topic",
                }),
                chip: intl.formatMessage({
                  id: "topicChip",
                  defaultMessage: "Topic is",
                }),
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={300}
                    label=<FormattedMessage
                      id="topicChip"
                      defaultMessage="topic is"
                    />
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
                fieldName: "ques",
                name: intl.formatMessage({
                  id: "question",
                  defaultMessage: "Question",
                }),
                chip: intl.formatMessage({
                  id: "quesChip",
                  defaultMessage: "Question contains",
                }),
                input: (
                  <Input
                    autoFocus={true}
                    label=<FormattedMessage
                      id="quesChip"
                      defaultMessage="Question contains"
                    />
                    required={true}
                  />
                ),
              },
              {
                fieldName: "ans",
                name: intl.formatMessage({
                  id: "answer",
                  defaultMessage: "Answer",
                }),
                display: intl.formatMessage({
                  id: "ansChip",
                  defaultMessage: "Answer contains",
                }),
                input: (
                  <Input
                    autoFocus={true}
                    label=<FormattedMessage
                      id="ansChip"
                      defaultMessage="Answer contains"
                    />
                    required={true}
                  />
                ),
              },
              {
                fieldName: "translation",
                name: intl.formatMessage({
                  id: "translation",
                  defaultMessage: "Translation",
                }),
                chip: intl.formatMessage({
                  id: "translationChip",
                  defaultMessage: "Translation:",
                }),
                input: (
                  <Combobox
                    maxHeight={500}
                    label=<FormattedMessage
                      id="translation"
                      defaultMessage="Translation:"
                    />
                    options={[
                      {
                        label: intl.formatMessage({
                          id: "translationAuto",
                          defaultMessage: "Auto",
                        }),
                        value: "generated",
                      },
                      {
                        label: intl.formatMessage({
                          id: "translationManual",
                          defaultMessage: "Manual",
                        }),
                        value: "manual",
                      },
                    ]}
                  />
                ),
              },
            ]}
            columns={[
              {
                column: <FormattedMessage id="topic" defaultMessage="Topic" />,
                sort: true,
                colCode: "topic",
              },
              {
                column: <FormattedMessage id="date" defaultMessage="Date" />,
                sort: true,
                colCode: "createdAt",
              },
              {
                column: <FormattedMessage id="title" defaultMessage="Title" />,
                sort: false,
                colCode: "title",
              },
              {
                column: (
                  <FormattedMessage
                    id="translation"
                    defaultMessage="Translation"
                  />
                ),
                sort: true,
                colCode: "translation",
              },
            ]}
            defaultSort={{ column: "createdAt", order: "des" }}
          />
        </Route>
        <Route path="/source/fatwa/live">
          <View
            key="jamiaAllFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/source/allFatwa/filter?"
            categories={[
              {
                default: true,
                fieldName: "title",
                name: intl.formatMessage({
                  id: "title",
                  defaultMessage: "Title",
                }),
                chip: intl.formatMessage({
                  id: "titleChip",
                  defaultMessage: "Title contains:",
                }),
                input: (
                  <Input
                    autoFocus={true}
                    label=<FormattedMessage
                      id="titleChip"
                      defaultMessage="Title contains:"
                    />
                    required={true}
                  />
                ),
              },
              {
                fieldName: "topic",
                name: intl.formatMessage({
                  id: "topic",
                  defaultMessage: "Topic",
                }),
                chip: intl.formatMessage({
                  id: "topicChip",
                  defaultMessage: "Topic is",
                }),
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={300}
                    label=<FormattedMessage
                      id="topicChip"
                      defaultMessage="topic is"
                    />
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
                fieldName: "ques",
                name: intl.formatMessage({
                  id: "question",
                  defaultMessage: "Question",
                }),
                chip: intl.formatMessage({
                  id: "quesChip",
                  defaultMessage: "Question contains",
                }),
                input: (
                  <Input
                    autoFocus={true}
                    label=<FormattedMessage
                      id="quesChip"
                      defaultMessage="Question contains"
                    />
                    required={true}
                  />
                ),
              },
              {
                fieldName: "ans",
                name: intl.formatMessage({
                  id: "answer",
                  defaultMessage: "Answer",
                }),
                display: intl.formatMessage({
                  id: "ansChip",
                  defaultMessage: "Answer contains",
                }),
                input: (
                  <Input
                    autoFocus={true}
                    label=<FormattedMessage
                      id="ansChip"
                      defaultMessage="Answer contains"
                    />
                    required={true}
                  />
                ),
              },
              {
                fieldName: "translation",
                name: intl.formatMessage({
                  id: "translation",
                  defaultMessage: "Translation",
                }),
                chip: intl.formatMessage({
                  id: "translationChip",
                  defaultMessage: "Translation:",
                }),
                input: (
                  <Combobox
                    maxHeight={500}
                    label=<FormattedMessage
                      id="translation"
                      defaultMessage="Translation:"
                    />
                    options={[
                      {
                        label: intl.formatMessage({
                          id: "translationAuto",
                          defaultMessage: "Auto",
                        }),
                        value: "generated",
                      },
                      {
                        label: intl.formatMessage({
                          id: "translationManual",
                          defaultMessage: "Manual",
                        }),
                        value: "manual",
                      },
                    ]}
                  />
                ),
              },
            ]}
            columns={[
              {
                column: <FormattedMessage id="topic" defaultMessage="Topic" />,
                sort: true,
                colCode: "topic",
              },
              {
                column: <FormattedMessage id="date" defaultMessage="Date" />,
                sort: true,
                colCode: "createdAt",
              },
              {
                column: <FormattedMessage id="title" defaultMessage="Title" />,
                sort: false,
                colCode: "title",
              },
              {
                column: (
                  <FormattedMessage
                    id="translation"
                    defaultMessage="Translation"
                  />
                ),
                sort: true,
                colCode: "translation",
              },
            ]}
            defaultSort={{ column: "createdAt", order: "des" }}
          />
        </Route>
        <Route path="/source/fatwa/pending">
          <View
            key="jamiaAllFatwaSubmission"
            Element={JamiaSingleFatwaSubmission}
            id="fatwaSubmissions"
            api="api/source/fatwaSubmissions/filter?"
            categories={[
              {
                default: true,
                fieldName: "title",
                name: intl.formatMessage({
                  id: "title",
                  defaultMessage: "Title",
                }),
                chip: intl.formatMessage({
                  id: "titleChip",
                  defaultMessage: "Title contains:",
                }),
                input: (
                  <Input
                    autoFocus={true}
                    label=<FormattedMessage
                      id="titleChip"
                      defaultMessage="Title contains:"
                    />
                    required={true}
                  />
                ),
              },
              {
                fieldName: "topic",
                name: intl.formatMessage({
                  id: "topic",
                  defaultMessage: "Topic",
                }),
                chip: intl.formatMessage({
                  id: "topicChip",
                  defaultMessage: "Topic is",
                }),
                input: (
                  <Combobox
                    id={ID(8)}
                    maxHeight={300}
                    label=<FormattedMessage
                      id="topicChip"
                      defaultMessage="topic is"
                    />
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
                fieldName: "ques",
                name: intl.formatMessage({
                  id: "question",
                  defaultMessage: "Question",
                }),
                chip: intl.formatMessage({
                  id: "quesChip",
                  defaultMessage: "Question contains",
                }),
                input: (
                  <Input
                    autoFocus={true}
                    label=<FormattedMessage
                      id="quesChip"
                      defaultMessage="Question contains"
                    />
                    required={true}
                  />
                ),
              },
              {
                fieldName: "ans",
                name: intl.formatMessage({
                  id: "answer",
                  defaultMessage: "Answer",
                }),
                display: intl.formatMessage({
                  id: "ansChip",
                  defaultMessage: "Answer contains",
                }),
                input: (
                  <Input
                    autoFocus={true}
                    label=<FormattedMessage
                      id="ansChip"
                      defaultMessage="Answer contains"
                    />
                    required={true}
                  />
                ),
              },
            ]}
            columns={[
              {
                column: <FormattedMessage id="date" defaultMessage="Date" />,
                sort: true,
                colCode: "createdAt",
              },
              {
                column: <FormattedMessage id="topic" defaultMessage="Topic" />,
                sort: true,
                colCode: "topic",
              },
              {
                column: <FormattedMessage id="title" defaultMessage="title" />,
                sort: false,
              },
            ]}
            defaultSort={{ column: "createdAt", order: "des" }}
          />
        </Route>
      </Switch>
    </div>
  );
});
function JamiaSingleFatwaSubmission({ data, setData }) {
  const { locale, setFatwaToEdit } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const fatwa = data;
  const history = useHistory();
  function edit() {
    setFatwaToEdit(fatwa);
    history.push("/source/editFatwa/" + fatwa._id);
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
          year="2-digit"
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
          {fatwa.ref.map((item, i) => {
            if (item.book) {
              return (
                <li key={item.book + item.part + item.page}>
                  <FormattedMessage id="book" defaultMessage="Book" />:{" "}
                  {item.book},{" "}
                  <FormattedMessage id="part" defaultMessage="Part" />:{" "}
                  <FormattedNumber value={item.part} />,{" "}
                  <FormattedMessage id="page" defaultMessage="Page" />:{" "}
                  <FormattedNumber value={item.page} />
                </li>
              );
            } else if (item.sura) {
              return (
                <li key={item.sura + item.aayat}>
                  <FormattedMessage id="sura" defaultMessage="Sura" />:{" "}
                  {item.sura},
                  <FormattedMessage id="aayat" defaultMessage="Aayat" />:{" "}
                  <FormattedNumber value={item.aayat} />
                </li>
              );
            } else {
              return (
                <li key={item.hadith + item.hadithNo}>
                  <FormattedMessage id="hadith" defaultMessage="hadith book" />:{" "}
                  {item.hadith},{" "}
                  <FormattedMessage id="hadithNo" defaultMessage="Hadith No" />:{" "}
                  <FormattedNumber value={item.hadithNo} />
                </li>
              );
            }
          })}
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
          year="2-digit"
        />
      </td>
      <td>{fatwa.topic[locale]}</td>
      <td>{fatwa.title[locale]}</td>
    </tr>
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
    history.push("/source/editFatwa/" + fatwa._id);
  }
  function deleteFatwa() {
    if (window.confirm("Do you want to delete this fatwa?")) {
      setLoading(true);
      fetch(`/api/source/fatwa/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fatwa: fatwa._id, source: fatwa.source }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.code === "ok") {
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
          year="2-digit"
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
        <Submit
          label={
            <>
              <ion-icon name="trash-outline"></ion-icon> Delete Fatwa
            </>
          }
          loading={loading}
          setLoading={setLoading}
          onClick={deleteFatwa}
        />
      </td>
    </tr>
  ) : (
    <tr data-id={fatwa._id} onClick={() => setOpen(true)}>
      <td>{fatwa.topic[locale]}</td>
      <td>
        <FormattedDate
          value={fatwa.createdAt}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td>{fatwa.title[locale]}</td>
      <td>{fatwa.translation ? "Yes" : "No"}</td>
    </tr>
  );
}

function UserSubmissions() {
  return (
    <div className="view">
      <h1 className="viewTitle">
        <FormattedMessage id="review" defaultMessage="Review" />
      </h1>
      <Tabs
        page="/source/userSubmissions/"
        tabs={[
          { label: "Reviews", link: "reviews" },
          { label: "Reports", link: "reports" },
        ]}
      />
      <Switch></Switch>
    </div>
  );
}

function QuestionFeed() {
  return (
    <div className="view questionFeed">
      <h1 className="viewTitle">
        <FormattedMessage id="questionFeed" defaultMessage="Question Feed" />
      </h1>
      <Tabs
        page="/source/questionFeed/"
        tabs={[
          {
            label: (
              <FormattedMessage
                id="newQuestions"
                defaultMessage="New Questions"
              />
            ),
            link: "newQuestions",
          },
        ]}
      />
      <Switch>
        <Route path="/source/questionFeed" exact>
          <NewQuestions />
        </Route>
        <Route path="/source/questionFeed/newQuestions">
          <NewQuestions />
        </Route>
      </Switch>
    </div>
  );
}
const NewQuestions = injectIntl(({ intl }) => {
  const abortController = new AbortController();
  const signal = abortController.signal;
  const { locale } = useContext(SiteContext);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ column: "createdAt", order: "asc" });
  const [data, setData] = useState([]);
  function fetchData() {
    setLoading(true);
    const sortOrder = encodeURL(sort);
    const options = { headers: { "Accept-Language": locale }, signal: signal };
    const url = `/api/source/questionFeed/filter?&${sortOrder}`;
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
  useEffect(fetchData, [sort]);
  if (!loading && data.length === 0) {
    return (
      <div className="noQuestion">
        <ion-icon name="file-tray-outline"></ion-icon>
        <p>
          <FormattedMessage id="nothingHere" />
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="filters">
        <Combobox
          disabled={loading}
          defaultValue={1}
          onChange={(option) => setSort(option.value)}
          maxHeight={200}
          id="questionFeedSort"
          icon="layers"
          options={[
            {
              label: intl.formatMessage({ id: "newFirts" }),
              value: { column: "createdAt", order: "des" },
            },
            {
              label: intl.formatMessage({ id: "oldFirst" }),
              value: { column: "createdAt", order: "asc" },
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
});
function SingleQuestion({ data }) {
  const { locale, user } = useContext(SiteContext);
  const history = useHistory();
  const container = useRef(null);
  return (
    <li
      ref={container}
      className={`question mini`}
      onClick={(e) => {
        if (e.target === container.current) {
          history.push("/source/userQuestion/" + data._id);
        }
      }}
    >
      <div className="user">
        <p className="name">{data.user.name}</p>
        <p className="date">
          {new Date(data.createdAt).getFullYear() !==
          new Date().getFullYear() ? (
            <FormattedDate
              value={data.createdAt}
              day="numeric"
              month="long"
              year="2-digit"
            />
          ) : (
            <FormattedDate value={data.createdAt} day="numeric" month="long" />
          )}
          <span className="separator" />
          <FormattedTimeParts value={data.createdAt}>
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
        icon="reorder-two-outline"
        actions={[
          {
            label: "Answer now",
            action: () => {
              SS.set("userAns-ques", data.ques.body);
              SS.set("userAns-topic", JSON.stringify(data.ques.topic));
              history.push(`/source/userQuestion/${data._id}/add`);
            },
          },
          {
            label: "Report",
            action: () => {
              history.push(`/source/userQuestion/${data._id}/report`);
            },
          },
        ]}
      />
      <p className="ques">{data.ques.body}</p>
      <ul className="tags">
        <li className="tag">{data.ques.topic[locale]}</li>
        <li className="tag">
          <FormattedMessage
            values={{ number: <FormattedNumber value={data.ans.length} /> }}
            id="ans.tag.ansCount"
            defaultMessage={`${data.ans.length} Answer(s)`}
          />
        </li>
        {data.ans.filter((ans) => ans.source === user._id).length > 0 && (
          <li className="tag">
            <FormattedMessage
              id="ans.tag.iAnswered"
              defaultMessage="I answered"
            />
          </li>
        )}
      </ul>
    </li>
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
                  year="2-digit"
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
            <div className="HR">
              <span className="hr" />
              <span className="content">নিবেদিত উত্তর সমূহ</span>
              <span className="hr" />
            </div>
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
              <ion-icon
                name="close-outline"
                onClick={() => history.push(match.url)}
              ></ion-icon>
              <UserQuestionAnswerForm
                setQues={setUserQues}
                ques={userQues.ques}
                _id={userQues._id}
              />
            </Modal>
          </Route>
          <Route path={`${match.url}/report`}>
            <Modal
              open={true}
              setOpen={() => history.push(match.url)}
              className="answerForm"
            >
              <UserQuestionReportForm _id={userQues._id} />
            </Modal>
          </Route>
        </div>
      </div>
    );
  }
  return (
    <div className="view">
      {loading ? <h1>loading</h1> : <p>Question not found!</p>}
    </div>
  );
}
function Answer({ ques, ans, setQues }) {
  const { locale, user } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [voted, setVoted] = useState(() => {
    let vote =
      ans.vote.voters.some(
        (voter) => voter.source === user._id && voter.vote
      ) || false;
    return vote;
  });
  useEffect(() => {
    setVoted(
      ans.vote.voters.some(
        (voter) => voter.source === user._id && voter.vote
      ) || false
    );
  }, [ans, user._id]);
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
    SS.set("ansFatwa-date", ans.meta.date);
    SS.set("ansFatwa-write", ans.meta.write);
    SS.set("ansFatwa-atts", ans.meta.atts);
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
      <div className="vote" disabled={loading}>
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
              year="2-digit"
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
              {ans.ref.map((item, i) => {
                if (item.book) {
                  return (
                    <li key={item.book + item.part + item.page}>
                      <FormattedMessage id="book" defaultMessage="Book" />:{" "}
                      {item.book},{" "}
                      {item.part && (
                        <>
                          <FormattedMessage id="part" defaultMessage="Part" />:{" "}
                          <FormattedNumber value={item.part} />,
                        </>
                      )}{" "}
                      <FormattedMessage id="page" defaultMessage="Page" />:{" "}
                      <FormattedNumber value={item.page} />
                    </li>
                  );
                } else if (item.sura) {
                  return (
                    <li key={item.sura + item.aayat}>
                      <FormattedMessage id="sura" defaultMessage="Sura" />:{" "}
                      {item.sura},{" "}
                      <FormattedMessage id="aayat" defaultMessage="Aayat" />:{" "}
                      <FormattedNumber value={item.aayat} />
                    </li>
                  );
                } else {
                  return (
                    <li key={item.hadith + item.hadithNo}>
                      <FormattedMessage
                        id="hadith"
                        defaultMessage="hadith book"
                      />
                      : {item.hadith},{" "}
                      <FormattedMessage
                        id="hadithNo"
                        defaultMessage="Hadith No"
                      />
                      : <FormattedNumber value={item.hadithNo} />
                    </li>
                  );
                }
              })}
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
            <p className="tag">
              <FormattedMessage
                values={{
                  number: <FormattedNumber value={ans.vote.voters.length} />,
                }}
                id="ans.tag.voteCount"
                defaultMessage={`${ans.vote.voters.length} Vote(s)`}
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

function JamiaProfile() {
  const { user, locale, setSidebarSize } = useContext(SiteContext);
  if (!user || user.role === "admin") return <Redirect to="/login" />;
  return (
    <div className="main jamiaProfile">
      <Sidebar
        views={[
          {
            label: (
              <FormattedMessage id="newFatwa" defaultMessage="New Fatwa" />
            ),
            path: "/source/newFatwa",
            icon: "add",
          },
          {
            label: <FormattedMessage id="fatwa" defaultMessage="Fatwa" />,
            path: "/source/fatwa",
            icon: "reader",
          },
          {
            label: (
              <FormattedMessage
                id="questionFeed"
                defaultMessage="Question Feed"
              />
            ),
            path: "/source/questionFeed",
            icon: "mail",
          },
          // {
          //   label: <FormattedMessage id="review" defaultMessage="review" />,
          //   path: "/source/userSubmissions",
          //   icon: "people",
          // },
        ]}
      >
        <div className="profile">
          <Link
            to="/source/profile"
            onClick={() => {
              if (window.innerWidth < 1080) {
                setSidebarSize("mini");
              }
            }}
          >
            <h2>{user.name[locale][0]}</h2>
          </Link>
          <p>{user.name[locale]}</p>
          <p className="add">{user.add}</p>
        </div>
      </Sidebar>
      <Switch>
        <Route
          path="/source/newFatwa"
          component={(props) => (
            <div className="view">
              <h1>
                <FormattedMessage
                  id="addNewFatwa"
                  defaultMessage="Add new Fatwa"
                />
              </h1>
              <AddFatwaForm {...props} />
            </div>
          )}
        />
        <Route
          path="/source/editFatwa/:id"
          component={(props) => (
            <div className="view">
              <h1>
                <FormattedMessage id="editFatwa" defaultMessage="Edit Fatwa" />
              </h1>
              <AddFatwaForm {...props} />
            </div>
          )}
        />
        <Route path="/source/questionFeed" component={QuestionFeed} />
        <Route path="/source/userQuestion/:_id" component={UserQuestion} />
        <Route path="/source" exact component={JamiaAllFatwa} />
        <Route path="/source/fatwa" component={JamiaAllFatwa} />
        {user.role === "jamia" ? (
          <Route path="/source/profile" component={JamiaDetail} />
        ) : (
          <Route path="/source/profile" component={MuftiDetail} />
        )}

        <Route path="/source/userSubmissions" component={UserSubmissions} />
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
