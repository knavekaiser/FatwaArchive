import React, { useState, useContext, useEffect } from "react";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import { Tabs, View, Sidebar, Actions } from "./TableElements";
import {
  ID,
  Input,
  Combobox,
  Textarea,
  ComboboxMulti,
  Checkbox,
  MultipleInput,
  topics,
  $,
  GetGroupData,
} from "./FormElements";
import "./CSS/JamiaProfile.min.css";
import { FormattedDate, FormattedMessage } from "react-intl";

const refInputBook = [
  [
    {
      id: "book",
      type: "text",
      label: { en: "Book", bn: "কিতাব" },
      clone: true,
    },
    { id: "part", type: "number", label: { en: "Part", bn: "খন্ড" } },
    { id: "page", type: "number", label: { en: "Page", bn: "পৃষ্ঠা" } },
  ],
];
const refInputSura = [
  [
    {
      id: "sura",
      type: "text",
      label: { en: "Sura", bn: "সূরা" },
      clone: true,
    },
    { id: "aayat", type: "number", label: { en: "Aayat", bn: "আয়াত" } },
  ],
];
function AddFatwaForm({ match }) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { jamia } = useContext(SiteContext);
  const [preFill, setPreFill] = useState({
    translate: false,
    inputBooks: refInputBook,
    inputSura: refInputSura,
    topic: "",
    title: "",
    titleEn: "",
    ques: "",
    quesEn: "",
    ans: "",
    ansEn: "",
    ref: [],
    img: [],
  });
  function handleMount() {
    if (match.params && match.params.id) {
      fetch(`/api/fatwa/add/${match.params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data === null) {
            return;
          }
          setPreFill((prev) => {
            let inputBooks = [];
            let inputSura = [];
            if (data.ref.length > 0) {
              data.ref.forEach((item) => {
                if (item.book) {
                  inputBooks.push([
                    {
                      id: "book",
                      type: "text",
                      label: { en: "Book", bn: "কিতাব" },
                      clone: true,
                      value: item.book,
                    },
                    {
                      id: "part",
                      type: "number",
                      label: { en: "Part", bn: "খন্ড" },
                      value: item.part,
                    },
                    {
                      id: "page",
                      type: "number",
                      label: { en: "Page", bn: "পৃষ্ঠা" },
                      value: item.page,
                    },
                  ]);
                } else {
                  inputSura.push([
                    {
                      id: "sura",
                      type: "text",
                      label: { en: "Sura", bn: "সূরা" },
                      clone: true,
                      value: item.sura,
                    },
                    {
                      id: "aayat",
                      type: "number",
                      label: { en: "Aayat", bn: "আয়াত" },
                      value: item.aayat,
                    },
                  ]);
                }
              });
              inputBooks.push(...refInputBook);
              inputSura.push(...refInputSura);
            }
            return {
              ...prev,
              ...(data.ref.length > 0 && {
                inputBooks: [...inputBooks],
                inputSura: [...inputSura],
              }),
              translate: true,
              topic: data.topic,
              title: data.title["bn-BD"],
              titleEn: data.title["en-US"],
              ques: data.ques["bn-BD"],
              quesEn: data.ques["en-US"],
              ans: data.ans["bn-BD"],
              ansEn: data.ans["en-US"],
              ref: data.ref,
              img: data.img,
            };
          });
        })
        .catch((err) => console.log(err));
    }
  }
  useEffect(handleMount, []);
  function submit(e) {
    e.preventDefault();
    const data = {
      topicEn: $(".addFatwa #topic input").dataset.en,
      topic: $(".addFatwa #topic input").dataset.bn,
      title: $(".addFatwa #title input").value,
      ...(preFill.translate && {
        titleEn: $(".addFatwa #titleEn input").value,
      }),
      ques: $(".addFatwa #ques textarea").value,
      ...(preFill.translate && {
        quesEn: $(".addFatwa #quesEn textarea").value,
      }),
      ans: $(".addFatwa #ans textarea").value,
      ...(preFill.translate && { ansEn: $(".addFatwa #ansEn textarea").value }),
      ref: [
        ...GetGroupData($(".addFatwa .multipleInput#books")),
        ...GetGroupData($(".addFatwa .multipleInput#sura")),
      ],
      img: preFill.img,
      jamia: jamia.id,
    };
    const url = !match.params.id
      ? "/api/fatwa/add"
      : `/api/fatwa/add/${match.params.id}`;
    const options = {
      method: match.params.id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    setLoading(true);
    fetch(url, options)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          history.push("/admin/allfatwa");
          return;
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <form
      className={`addFatwa ${preFill.translate ? "translate" : ""}`}
      onSubmit={submit}
    >
      <ComboboxMulti
        defaultValue={preFill.topic}
        label=<FormattedMessage
          id="form.addFatwa.topic"
          defaultMessage="Topic"
        />
        id="topic"
        data={topics}
        maxHeight="15rem"
        required={true}
      />
      <Checkbox
        label=<ion-icon name="language-outline"></ion-icon>
        change={() =>
          setPreFill((prev) => {
            const newPrefill = { ...prev };
            newPrefill.translate = !newPrefill.translate;
            return newPrefill;
          })
        }
        defaultValue={preFill.translate}
      />
      <Input
        defaultValue={preFill.title}
        required={true}
        dataId="title"
        label=<FormattedMessage
          id="form.addFatwa.title"
          defaultMessage="Title"
        />
        max={200}
      />
      {preFill.translate && (
        <Input
          defaultValue={preFill.titleEn}
          required={true}
          dataId="titleEn"
          label="Title in English"
          max={200}
        />
      )}
      <Textarea
        defaultValue={preFill.ques}
        required={true}
        dataId="ques"
        label=<FormattedMessage
          id="form.addFatwa.ques"
          defaultMessage="Question"
        />
      />
      {preFill.translate && (
        <Textarea
          defaultValue={preFill.quesEn}
          required={true}
          dataId="quesEn"
          label="Question in English"
        />
      )}
      <Textarea
        defaultValue={preFill.ans}
        required={true}
        dataId="ans"
        label=<FormattedMessage
          id="form.addFatwa.ans"
          defaultMessage="Answer"
        />
      />
      {preFill.translate && (
        <Textarea
          defaultValue={preFill.ansEn}
          required={true}
          dataId="ansEn"
          label="Answer in Enlish"
        />
      )}
      <MultipleInput
        id="books"
        inputs={preFill.inputBooks}
        refInput={refInputBook}
      />
      <MultipleInput
        id="sura"
        inputs={preFill.inputSura}
        refInput={refInputSura}
      />
      <button disabled={loading} type="submit" className="btn">
        <FormattedMessage id="form.addFatwa.submit" defaultMessage="Submit" />
        {loading && <span className="spinner"></span>}
      </button>
    </form>
  );
}

function Profile() {
  const { jamia } = useContext(SiteContext);
  const [edit, setEdit] = useState(false);
  return (
    <div>
      <div id="profileInfo">
        asdg
        <p className="label">Jamia :</p>
        <p className="info">{jamia.name}</p>
        <p className="label">Est. :</p>
        <p className="info">{jamia.est}</p>
        <p className="label">Address :</p>
        <p className="info">
          {`${jamia.add.address}, ${jamia.add.area}, ${jamia.add.city}, ${jamia.add.region}`}
        </p>
        <p className="label">Phone :</p>
        <p className="info">{jamia.phone}</p>
        <p className="label">About :</p>
        <p className="info">{jamia.about}</p>
      </div>
      <button disabled={edit} onClick={() => setEdit(!edit)}>
        edit
      </button>
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
              action: () => editFatwa(`/jamia/addFatwa/${fatwa._id}`),
              option: "Edit",
            },
            { action: () => deleteFatwa(fatwa._id), option: "Delete" },
          ]}
        />
      </td>
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
            Element={SingleFatwa}
            id="allFatwa"
            api="api/allfatwa/filter?"
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
        <Route path="/jamia/fatwa/live">
          <View
            Element={SingleFatwa}
            id="allFatwa"
            api="api/allfatwa/filter?"
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
        <Route path="/jamia/fatwa/submitions">
          <View
            Element={SingleFatwa}
            id="fatwaSubmitions"
            api="api/fatwaSubmitions/filter?"
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
              { column: "date", sort: true },
              { column: "topic", sort: true },
              { column: "jamia", sort: true },
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
          { label: "Fatwa", path: "/jamia/fatwa", icon: "book" },
          { label: "About", path: "/jamia/about", icon: "ribbon" },
        ]}
      >
        <div className="profile">
          <h2>M</h2>
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
        <Route path="/jamia/about" component={Profile} />
      </Switch>
    </div>
  );
}

export default JamiaProfile;
