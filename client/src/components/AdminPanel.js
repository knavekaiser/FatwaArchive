import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { SiteContext } from "../Context.js";
import "./CSS/AdminPanel.min.css";
import {
  Input,
  Textarea,
  Combobox,
  topics,
  Submit,
  ID,
  SS,
} from "./FormElements";
import { DataEditForm, PasswordEditForm } from "./Forms";
import { Tabs, Sidebar, View, Actions, LoadingPost } from "./TableElements";
import {
  FormattedDate,
  FormattedNumber,
  FormattedMessage,
  FormattedTimeParts,
  injectIntl,
} from "react-intl";
import FourOFour from "./FourOFour";

const encodeURL = (obj) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&");

function AllSources() {
  return (
    <div className="view">
      <h1 className="viewTitle">
        <FormattedMessage id="source" defaultMessage="Source" />
      </h1>
      <Tabs
        page="/admin/sources/"
        tabs={[
          {
            label: <FormattedMessage id="active" defaultMessage="Active" />,
            link: "active",
          },
          {
            label: <FormattedMessage id="pending" defaultMessage="Pending" />,
            link: "Submissions",
          },
        ]}
      />
      <Switch>
        <Route path="/admin/sources" exact>
          <View
            key="allJamia"
            Element={SingleJamia}
            defaultSort={{ column: "joined", order: "des" }}
            id="allJamia"
            api="api/admin/sources/active/filter?"
            categories={[
              {
                name: "role",
                bridge: "is",
                input: (
                  <Combobox
                    label=<FormattedMessage id="type" defaultMessage="Type" />
                    options={[
                      { label: "Jamia", value: "jamia" },
                      { label: "Mufti", value: "mufti" },
                    ]}
                  />
                ),
              },
            ]}
            columns={[
              {
                column: <FormattedMessage id="id" defaultMessage="Id" />,
                sort: false,
                colCode: "id",
              },
              {
                column: <FormattedMessage id="type" defaultMessage="Type" />,
                sort: true,
                colCode: "role",
              },
              {
                column: <FormattedMessage id="name" defaultMessage="Name" />,
                sort: false,
                colCode: "name",
              },
              {
                column: (
                  <FormattedMessage
                    id="primeMufti"
                    defaultMessage="Prime Mufti"
                  />
                ),
                sort: false,
                colCode: "primeMufti",
              },
              {
                column: (
                  <FormattedMessage id="joined" defaultMessage="Joined" />
                ),
                sort: true,
                colCode: "joined",
              },
              {
                column: <FormattedMessage id="fatwa" defaultMessage="Fatwa" />,
                sort: true,
                colCode: "fatwa",
              },
              {
                column: (
                  <FormattedMessage id="contact" defaultMessage="Contact" />
                ),
                sort: false,
                colCode: "contact",
              },
            ]}
          />
        </Route>
        <Route path="/admin/sources/active">
          <View
            key="allJamia"
            Element={SingleJamia}
            defaultSort={{ column: "joined", order: "des" }}
            id="allJamia"
            api="api/admin/sources/active/filter?"
            categories={[
              {
                name: "role",
                bridge: "is",
                input: (
                  <Combobox
                    label=<FormattedMessage id="type" defaultMessage="Type" />
                    options={[
                      { label: "Jamia", value: "jamia" },
                      { label: "Mufti", value: "mufti" },
                    ]}
                  />
                ),
              },
            ]}
            columns={[
              {
                column: <FormattedMessage id="id" defaultMessage="Id" />,
                sort: false,
                colCode: "id",
              },
              {
                column: <FormattedMessage id="type" defaultMessage="Type" />,
                sort: true,
                colCode: "role",
              },
              {
                column: <FormattedMessage id="name" defaultMessage="Name" />,
                sort: false,
                colCode: "name",
              },
              {
                column: (
                  <FormattedMessage
                    id="primeMufti"
                    defaultMessage="Prime Mufti"
                  />
                ),
                sort: false,
                colCode: "primeMufti",
              },
              {
                column: (
                  <FormattedMessage id="joined" defaultMessage="Joined" />
                ),
                sort: true,
                colCode: "joined",
              },
              {
                column: <FormattedMessage id="fatwa" defaultMessage="Fatwa" />,
                sort: true,
                colCode: "fatwa",
              },
              {
                column: (
                  <FormattedMessage id="contact" defaultMessage="Contact" />
                ),
                sort: false,
                colCode: "contact",
              },
            ]}
          />
        </Route>
        <Route path="/admin/sources/submissions">
          <View
            key="allSourceSubmissions"
            Element={SingleSourceSubmission}
            defaultSort={{ column: "joined", order: "des" }}
            id="jamiaSubmissions"
            api="api/admin/sources/submissions/filter?"
            categories={[
              {
                name: "role",
                input: (
                  <Combobox
                    label=<FormattedMessage id="type" defaultMessage="Type" />
                    options={[
                      { label: "jamia", value: "jamia" },
                      { label: "mufti", value: "mufti" },
                    ]}
                  />
                ),
              },
            ]}
            columns={[
              {
                column: <FormattedMessage id="date" defaultMessage="Date" />,
                sort: true,
                colCode: "joined",
              },
              {
                column: <FormattedMessage id="name" defaultMessage="Name" />,
                sort: false,
                colCode: "name",
              },
              {
                column: <FormattedMessage id="type" defaultMessage="Type" />,
                sort: true,
                colCode: "role",
              },
              {
                column: (
                  <FormattedMessage
                    id="primeMufti"
                    defaultMessage="primeMufti"
                  />
                ),
                sort: false,
                colCode: "primeMufti",
              },
              {
                column: (
                  <FormattedMessage id="contact" defaultMessage="Contact" />
                ),
                sort: false,
                colCode: "contact",
              },
            ]}
          />
        </Route>
      </Switch>
    </div>
  );
}
function SingleSourceSubmission({ data, setData }) {
  const jamia = data;
  const { locale } = useContext(SiteContext);
  const [showFull, setShowFull] = useState(false);
  const [loading, setLoading] = useState(false);
  function accept() {
    setLoading(true);
    fetch(`/api/admin/source/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: jamia._id }),
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((submissions) => submissions._id !== jamia._id);
          });
        }
      })
      .catch((err) => console.log(err));
  }
  function reject() {
    setLoading(true);
    fetch(`/api/admin/source/reject`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: jamia._id }),
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setData((prev) => {
            return prev.filter((submissions) => submissions._id !== jamia._id);
          });
        }
      })
      .catch((err) => console.log(err));
  }
  return !showFull ? (
    <tr onClick={() => (showFull ? setShowFull(false) : setShowFull(true))}>
      <td>
        <FormattedDate
          value={new Date(jamia.joined)}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td>
        {jamia.name[locale]}
        <span>{jamia.address}</span>
      </td>
      <td>{jamia.role}</td>
      <td>{jamia.primeMufti[locale]}</td>
      <td>
        <a href={`tel:${jamia.contact}`}>{jamia.contact.replace("+88", "")}</a>
      </td>
    </tr>
  ) : (
    <tr className="full">
      <td className="label">Submitted</td>
      <td className="data">
        <FormattedDate
          value={new Date(jamia.joined)}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td className="label">ID</td>
      <td className="data">{jamia.id}</td>
      <td className="label">Name</td>
      <td className="data">{jamia.name[locale]}</td>
      <td className="label">Prime Mufti</td>
      <td className="data">{jamia.primeMufti[locale]}</td>
      <td className="label">Address</td>
      <td className="data">{jamia.address}</td>
      <td className="label">Contact</td>
      <td className="data">
        <a href={`tel:${jamia.contact}`}>{jamia.contact.replace("+88", "")}</a>
      </td>
      <td className="label">Applicant's Name</td>
      <td className="data">{jamia.appl.name}</td>
      <td className="label">Applicant's designation</td>
      <td className="data">{jamia.appl.designation}</td>
      <td className="label">Applicant's mobile</td>
      <td className="data">
        <a href={`tel:${jamia.appl.mob}`}>
          {jamia.appl.mob.replace("+88", "")}
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
    setLoading(true);
    if (window.confirm("You want to delete this jamia")) {
      fetch(`/api/admin/source/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: jamia._id }),
      })
        .then((res) => {
          setLoading(false);
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
      <td className="jamiaType">{jamia.role}</td>
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
          pattern={/^[ঀ-৾\s(),]+$/}
          fieldCode="name.bn-BD"
        />
      </td>
      <td className="label">Name (Enlish)</td>
      <td className="data">
        <DataEditForm
          api={patchApi}
          defaultValue={jamia.name["en-US"]}
          Element={Input}
          pattern={/^[a-zA-Z\s(),]+$/}
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
          pattern={/^\+8801\d{0,9}$/}
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
          pattern={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
          fieldCode="about"
          api={patchApi}
        />
      </td>
      <td className="label">Applicant's Name</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.appl.name}
          Element={Input}
          pattern={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
          fieldCode="appl.name"
          api={patchApi}
        />
      </td>
      <td className="label">Applicant's designation</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.appl.designation}
          Element={Input}
          pattern={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
          fieldCode="appl.designation"
          api={patchApi}
        />
      </td>
      <td className="label">Applicant's mobile</td>
      <td className="data">
        <DataEditForm
          defaultValue={jamia.appl.mob}
          Element={Input}
          pattern={/^\+8801\d{0,9}$/}
          tel={true}
          fieldCode="appl.mob"
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

const AllFatwa = injectIntl(({ history, location, match, intl }) => {
  const { locale } = useContext(SiteContext);
  return (
    <div className="view">
      <h1 className="viewTitle">
        <FormattedMessage id="fatwa" defaultMessage="Fatwa" />
      </h1>
      <Tabs
        page="/admin/fatwa/"
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
        <Route path="/admin/fatwa" exact>
          <View
            key="allFatwa"
            Element={SingleFatwa}
            id="allFatwa"
            api="api/admin/allfatwa/filter?"
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
                column: (
                  <FormattedMessage id="source" defaultMessage="Source" />
                ),
                sort: true,
                colCode: "source",
              },
              {
                column: <FormattedMessage id="topic" defaultMessage="Topic" />,
                sort: true,
                colCode: "topic",
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
            ]}
            defaultSort={{ column: "createdAt", order: "des" }}
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
                column: (
                  <FormattedMessage id="source" defaultMessage="Source" />
                ),
                sort: true,
                colCode: "source",
              },
              {
                column: <FormattedMessage id="topic" defaultMessage="Topic" />,
                sort: true,
                colCode: "topic",
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
            ]}
            defaultSort={{ column: "createdAt", order: "des" }}
          />
        </Route>
        <Route path="/admin/fatwa/pending">
          <View
            key="allFatwaSubmission"
            Element={SingleFatwaSubmission}
            id="fatwaSubmissions"
            api="api/admin/fatwaSubmissions/filter?"
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
                column: (
                  <FormattedMessage id="source" defaultMessage="Source" />
                ),
                sort: true,
                colCode: "jamia",
              },
              {
                column: <FormattedMessage id="title" defaultMessage="Title" />,
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
function SingleFatwaSubmission({ data, setData }) {
  const { locale, setFatwaToEdit } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fatwa = data;
  const history = useHistory();
  function editFatwaSubmission(id) {
    setFatwaToEdit(fatwa);
    history.push("/admin/add");
  }
  function acceptFatwa() {
    setLoading(true);
    fetch(`/api/admin/fatwaSubmissions/accept/${fatwa._id}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
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
  function removeSubmission() {
    setLoading(true);
    fetch(`/api/admin/fatwaSubmissions/remove/${fatwa._id}`, {
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
          value={new Date(fatwa.createdAt)}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td className="label">topic</td>
      <td className="data">{fatwa.topic[locale]}</td>
      <td className="label">translation</td>
      <td className="data">{fatwa.translation ? "Yes" : "No"}</td>
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
        <button disabled={loading} onClick={editFatwaSubmission}>
          <ion-icon name="pencil-outline"></ion-icon> Edit
        </button>
        <Submit
          loading={loading}
          onClick={removeSubmission}
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
          value={new Date(fatwa.createdAt)}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td>{fatwa.topic[locale]}</td>
      <td>{fatwa.source.name[locale]}</td>
      <td>{fatwa.title[locale]}</td>
    </tr>
  );
}
function SingleFatwa({ data, setData }) {
  const { locale } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fatwa = data;
  function deleteFatwa() {
    setLoading(true);
    fetch(`/api/admin/fatwa/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fatwa: fatwa._id, source: fatwa.source._id }),
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
          value={new Date(fatwa.createdAt)}
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
                  <FormattedMessage id="book" defaultMessage="Book" />:{" "}
                  {item.book},{" "}
                  <FormattedMessage id="part" defaultMessage="Part" />:{" "}
                  <FormattedNumber value={item.part} />,{" "}
                  <FormattedMessage id="page" defaultMessage="Page" />:{" "}
                  <FormattedNumber value={item.page} />
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
      <td>{fatwa.source.name[locale]}</td>
      <td>{fatwa.topic[locale]}</td>
      <td>{fatwa.translation ? "Yes" : "No"}</td>
      <td>
        <FormattedDate
          value={new Date(fatwa.createdAt)}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </td>
      <td>{fatwa.title[locale]}</td>
    </tr>
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

function UserReview() {
  const { locale } = useContext(SiteContext);
  return (
    <div className="view">
      <h1>
        <FormattedMessage id="review" defaultMessage="User Review" />
      </h1>
      <Tabs
        page="/admin/user/"
        tabs={[
          { label: "Questions", link: "questions" },
          { label: "Answered Question", link: "answeredQuestion" },
          { label: "Review", link: "review" },
          { label: "Report", link: "report" },
        ]}
      />
      <Switch>
        <Route path="/admin/user" exact>
          <View
            Element={SingleUserQuestions}
            defaultSort={{ column: "submitted", order: "des" }}
            id="userSubmissions"
            api="api/admin/userQuestion/filter?"
            categories={[
              {
                name: "topic",
                input: (
                  <Combobox
                    options={topics.map((option) => {
                      return {
                        label: option[locale],
                        value: option,
                      };
                    })}
                    required={true}
                  ></Combobox>
                ),
              },
              {
                name: "name",
                input: <Input label="Name" type="text" required={true} />,
              },
              {
                name: "answered",
                input: (
                  <Combobox
                    label="Answered"
                    options={[
                      { label: "Answered", value: true },
                      { label: "Not answered", value: false },
                    ]}
                    required={true}
                  />
                ),
              },
              {
                name: "taken",
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
              { column: "date", sort: true, colCode: "createdAt" },
              { column: "name", sort: false, colCode: "name" },
              { column: "question", sort: false, colCode: "ques" },
              { column: "answers", sort: true, colCode: "ansCount" },
            ]}
          />
        </Route>
        <Route path="/admin/user/questions">
          <View
            Element={SingleUserQuestions}
            defaultSort={{ column: "submitted", order: "des" }}
            id="userSubmissions"
            api="api/admin/userQuestion/filter?"
            columns={[
              { column: "date", sort: true, colCode: "submitted" },
              { column: "name", sort: false, colCode: "name" },
              { column: "question", sort: false, colCode: "ques" },
            ]}
          />
        </Route>
        <Route path="/admin/user/answeredQuestion">
          <View
            Element={SingleUserReview}
            defaultSort={{ column: "date", order: "des" }}
            id="answeredQuestion"
            api="api/admin/userReview/filter?"
            columns={[
              { column: "name", sort: false, colCode: "name" },
              { column: "date", sort: true, colCode: "date" },
              { column: "message", sort: false, colCode: "message" },
            ]}
          />
        </Route>
        <Route path="/admin/user/review">
          <View
            Element={SingleUserReview}
            defaultSort={{ column: "date", order: "des" }}
            id="answeredQuestion"
            api="api/admin/userReview/filter?"
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
            id="allReports"
            api="api/admin/userReview/filter?"
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
function SingleUserReview() {
  return (
    <tr>
      <td>Make user review rows</td>
    </tr>
  );
}
function SingleUserQuestions({ data, setData }) {
  const { locale } = useContext(SiteContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ques = data;
  function remove() {
    setLoading(true);
    fetch("/api/admin/removeUserQuestion", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: ques._id }),
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setData((prev) => prev.filter((item) => item._id !== ques._id));
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong!");
      });
  }
  return !open ? (
    <tr onClick={() => setOpen(true)}>
      <td>
        <FormattedDate
          value={ques.createdAt}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td>
        {ques.user.name}
        <span>{ques.user.add}</span>
      </td>
      <td>{ques.ques.body}</td>
      <td>
        <FormattedNumber value={ques.ansCount} />
      </td>
    </tr>
  ) : (
    <tr className="full">
      <td className="label">Submitted</td>
      <td className="data">
        <FormattedDate
          value={ques.createdAt}
          day="numeric"
          month="numeric"
          year="2-digit"
        />
      </td>
      <td className="label">Name</td>
      <td className="data">{ques.user.name}</td>
      <td className="label">Address</td>
      <td className="data">{ques.user.add}</td>
      <td className="label">Mobile</td>
      <td className="data">
        <a href={`tel:${ques.user.mob}`}>{ques.user.mob}</a>
      </td>
      <td className="label">Topic</td>
      <td className="data">{ques.ques.topic[locale]}</td>
      <td className="label">Question</td>
      <td className="data">{ques.ques.body}</td>
      <td className="data btns">
        <button className="hideDetail" onClick={() => setOpen(false)}>
          <ion-icon name="chevron-up-outline"></ion-icon>Hide Detail
        </button>
        <button disabled={loading} className="remove" onClick={remove}>
          <ion-icon name="trash-outline"></ion-icon>Remove
        </button>
      </td>
    </tr>
  );
}

function QuestionFeed() {
  return (
    <div className="view questionFeed">
      <h1 className="viewTitle">
        <FormattedMessage id="questionFeed" defaultMessage="Question Feed" />
      </h1>
      <Tabs
        page="/admin/questionFeed/"
        tabs={[{ label: "New Questions", link: "newQuestions" }]}
      />
      <Switch>
        <Route path="/admin/questionFeed" exact>
          <NewQuestions />
        </Route>
        <Route path="/admin/questionFeed/newQuestions">
          <NewQuestions />
        </Route>
      </Switch>
    </div>
  );
}
function NewQuestions() {
  const abortController = new AbortController();
  const signal = abortController.signal;
  const { locale } = useContext(SiteContext);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ column: "createdAt", order: "des" });
  const [data, setData] = useState([]);
  function fetchData() {
    setLoading(true);
    const sortOrder = encodeURL(sort);
    const options = { headers: { "Accept-Language": locale }, signal: signal };
    const url = `/api/admin/questionFeed/filter?&${sortOrder}`;
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
          data.map((item) => (
            <SingleQuestion key={item._id} ques={item} setQues={setData} />
          ))
        ) : (
          <LoadingPost />
        )}
      </ul>
    </>
  );
}
function SingleQuestion({ ques, setQues }) {
  const { locale } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const container = useRef(null);
  function remove() {
    setLoading(true);
    fetch("/api/admin/userQues", {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ _id: ques._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setQues((prev) => prev.filter((item) => item._id !== ques._id));
        } else {
          alert("something went wrong");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        alert("something went wrong");
      });
  }
  return (
    <li
      ref={container}
      className={`question mini`}
      onClick={(e) => {
        if (e.target === container.current) {
          history.push("/admin/questionFeed/" + ques._id);
        }
      }}
    >
      <div className="user">
        <p className="name">{ques.user.name}</p>
        <p className="date">
          {new Date(ques.submitted).getFullYear() !==
          new Date().getFullYear() ? (
            <FormattedDate
              value={ques.submitted}
              day="numeric"
              month="long"
              year="numeric"
            />
          ) : (
            <FormattedDate value={ques.submitted} day="numeric" month="long" />
          )}
          <span className="separator" />
          <FormattedTimeParts value={ques.submitted}>
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
              SS.set("userAns-ques", ques.ques.body);
              SS.set("userAns-topic", JSON.stringify(ques.ques.topic));
              history.push(`/admin/userQuestion/${ques._id}/add`);
            },
          },
          {
            label: "Remove",
            action: () => {
              remove();
            },
          },
        ]}
      />
      <p className="ques">{ques.ques.body}</p>
      <ul className="tags">
        <li className="tag">{ques.ques.topic[locale]}</li>
        <li className="tag">
          <FormattedMessage
            values={{ number: <FormattedNumber value={ques.ans.length} /> }}
            id="ans.tag.ansCount"
            defaultMessage={`${ques.ans.length} Answer(s)`}
          />
        </li>
        <li className="tag">
          <FormattedMessage
            values={{ number: <FormattedNumber value={ques.reports.length} /> }}
            id="ans.tag.reportCount"
            defaultMessage={`${ques.reports.length} Reports(s)`}
          />
        </li>
      </ul>
    </li>
  );
}

function UserQuestion({ history, match }) {
  const [loading, setLoading] = useState(true);
  const [userQues, setUserQues] = useState({});
  useEffect(getData, []);
  function getData() {
    fetch("/api/admin/userQues/" + match.params._id)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setUserQues(data.content);
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
          <Tabs
            page={`/admin/questionFeed/${userQues._id}/`}
            tabs={[
              { label: "Answers", link: "answers" },
              { label: "Reports", link: "reports" },
              { label: "Add answer", link: "addAnswer" },
            ]}
          />
          <Switch>
            <Route path={`/admin/questionFeed/${userQues._id}`} exact>
              {userQues.ans.map((item) => (
                <Answer
                  key={item._id}
                  ques={userQues}
                  ans={item}
                  setQues={setUserQues}
                />
              ))}
            </Route>
            <Route path={`/admin/questionFeed/${userQues._id}/answers`}>
              {userQues.ans.map((item) => (
                <Answer
                  key={item._id}
                  ques={userQues}
                  ans={item}
                  setQues={setUserQues}
                />
              ))}
            </Route>
            <Route path={`/admin/questionFeed/${userQues._id}/reports`}>
              {userQues.reports.map((report) => (
                <Report key={report._id} report={report} />
              ))}
            </Route>
          </Switch>
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
function Answer({ ques, ans, setQues }) {
  const { locale, user } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  function approve() {
    setLoading(true);
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ans_id: ans._id }),
    };
    fetch(`/api/admin/userQues/approveAns/${ques._id}`, options)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          history.push("/admin/questionFeed");
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
  function remove() {
    const options = {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ source: ans.source._id, _id: ans._id }),
    };
    setLoading(true);
    fetch(`/api/admin/userQues/answer/${ques._id}`, options)
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
        <div className={`content`}>
          <ion-icon name="chevron-up-outline"></ion-icon>
          <p className="voteCount">
            <FormattedNumber value={ans.vote.count} />
          </p>
          <ion-icon name="chevron-down-outline"></ion-icon>
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
            {loading && <p>loading</p>}
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
      <Actions
        icon="reorder-two-outline"
        actions={[
          { label: "Edit", action: edit },
          { label: "Approve", action: approve },
          { label: "Remove", action: remove },
        ]}
      />
    </div>
  );
}
function Report({ report }) {
  const { locale } = useContext(SiteContext);
  return (
    <div className="quesReports">
      <div className="user">
        <p className="name">
          <b>{report.source.name[locale]}</b>
        </p>
        <p className="date">
          <FormattedDate
            value={report.createdAt}
            day="numeric"
            month="long"
            year="numeric"
          />
          <span className="separator" />
          <FormattedTimeParts value={report.createdAt}>
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
      <div className="contect">
        <p className="subject">{report.message.subject}</p>
        <p className="body">{report.message.body}</p>
      </div>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="main adminPanel">
      <Sidebar
        views={[
          {
            label: <FormattedMessage id="source" defaultMessage="Source" />,
            path: "/admin/sources",
            icon: "book",
          },
          {
            label: <FormattedMessage id="fatwa" defaultMessage="Fatwa" />,
            path: "/admin/fatwa",
            icon: "reader",
          },
          {
            label: (
              <FormattedMessage id="userArea" defaultMessage="User Area" />
            ),
            path: "/admin/user",
            icon: "people",
          },
          {
            label: <FormattedMessage id="patreons" defaultMessage="Patreons" />,
            path: "/admin/patreons",
            icon: "umbrella",
          },
          {
            label: (
              <FormattedMessage
                id="questionFeed"
                defaultMessage="Question Feed"
              />
            ),
            path: "/admin/questionFeed",
            icon: "mail",
          },
        ]}
      >
        <div className="profile">
          <h2>A</h2>
        </div>
      </Sidebar>
      <Switch>
        <Route path="/admin" exact component={AllSources} />
        <Route path="/admin/sources" component={AllSources} />
        <Route path="/admin/fatwa/:filter?" component={AllFatwa} />
        <Route path="/admin/patreons" component={Patreons} />
        <Route path="/admin/user" component={UserReview} />
        <Route path="/admin/questionFeed/:_id" component={UserQuestion} />
        <Route path="/admin/questionFeed" component={QuestionFeed} />
        <Route path="/" component={FourOFour} />
      </Switch>
    </div>
  );
}

export default AdminPanel;
