import React, { useState, useEffect } from "react";
import { Route, Link, useHistory } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import "./CSS/AdminPanel.min.css";

const ID = (length) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  result += characters.charAt(
    Math.floor(Math.random() * charactersLength - 10)
  );
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const Input = ({
  defaultValue,
  type,
  label,
  required,
  style,
  onChange,
  id,
  disabled,
  min,
}) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);
  const changeHandler = (e) => {
    setValue(e.target.value);
    onChange && onChange(e.target);
  };
  return (
    <input
      value={value}
      required={required}
      type={type}
      onChange={changeHandler}
      id={id ? id : ID(8)}
      disabled={disabled}
      min={min}
      placeholder={label}
    />
  );
};
const Group = ({ id, inputs, clone, setGroupCount }) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    setGroupCount((prev) => {
      const newGroup = [...prev];
      newGroup.push(`${id}:${inputs[0].value || ""}`);
      return newGroup;
    });
    return () => {
      setGroupCount((prev) => {
        return prev.filter((item) => item.split(":")[0] !== id);
      });
    };
  }, []);
  function handleChange(e) {
    clone(e);
    setValue(e.value);
  }
  return (
    <div className="group">
      {inputs.map((input) => {
        return (
          <React.Fragment key={input.label}>
            <Input
              warning={"Letters & numbers only!"}
              defaultValue={input.value}
              required={input.clone ? false : true}
              type={input.type}
              label={input.label}
              id={input.clone ? id : ""}
              onChange={input.clone && handleChange}
              disabled={
                input.clone ? false : input.value ? false : value === ""
              }
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
const MultipleInput = ({ setRef, inputs, refInput }) => {
  const [groupCount, setGroupCount] = useState([]);
  useEffect(() => {
    if (inputs[0][0].value) {
      setGroupCount([]);
    }
  }, [inputs]);
  useEffect(() => {}, [groupCount]);
  function clone(e) {
    setGroupCount((prev) => {
      const newGroup = [...prev];
      let current = 0;
      for (var i = 0; i < newGroup.length; i++) {
        if (newGroup[i].split(":")[0] === e.id) {
          newGroup.splice(i, 1);
          current = i;
          break;
        }
      }
      newGroup.splice(current, 0, `${e.id}:${e.value}`);
      const currentValue = newGroup[current].split(":")[1];
      const nextGroup = newGroup[current + 1];
      if (currentValue.length >= 1 && nextGroup === undefined) {
        setFinal((prev) => {
          const newFinal = [...prev];
          newFinal.push(
            <Group
              id={ID(8)}
              key={ID(8)}
              inputs={refInput[0]}
              clone={clone}
              groupCount={groupCount}
              setGroupCount={setGroupCount}
            />
          );
          return newFinal;
        });
      } else if (currentValue.length === 0) {
        setFinal((prev) => {
          const newFinal = [...prev];
          for (var i = 0; i < newGroup.length; i++) {
            const value = newGroup[i].split(":")[1];
            if (value === "" && i < current) {
              newFinal.splice(i, 1);
            } else if (value === "" && i > current) {
              newFinal.splice(i, 1);
            }
          }
          return newFinal;
        });
      }
      return newGroup;
    });
  }
  const [final, setFinal] = useState([]);
  useEffect(() => {
    setFinal(
      inputs.map((input) => {
        return (
          <Group
            id={ID(8)}
            key={ID(8)}
            inputs={input}
            clone={clone}
            groupCount={groupCount}
            setGroupCount={setGroupCount}
          />
        );
      })
    );
  }, [inputs]);
  return <div className="multipleInput">{final}</div>;
};
function getGroupData(multipleInput) {
  const allData = [];
  Array.from(multipleInput.children).forEach((group, i) => {
    const data = {};
    Array.from(group.children).forEach((input) => {
      data[input.placeholder.toLowerCase()] = input.value;
    });
    data.book !== "" && allData.push(data);
  });
  return allData;
}

const refInput = [
  [
    { type: "text", label: "Book", clone: true },
    { type: "number", label: "Part" },
    { type: "number", label: "Page" },
  ],
];
function AddFatwaForm({ match }) {
  const history = useHistory();
  const [inputs, setInputs] = useState(refInput);
  const [title, setTitle] = useState("");
  const [ques, setQues] = useState("");
  const [ans, setAns] = useState("");
  const [ref, setRef] = useState([]);
  const [img, setImg] = useState([]);
  useEffect(() => {
    if (match.params.id) {
      fetch(`/api/fatwa/${match.params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setQues(data.ques);
          setAns(data.ans);
          setRef(data.ref);
          setImg(data.img);
        })
        .catch((err) => console.log(err));
    }
  }, []);
  useEffect(() => {
    if (ref.length > 0) {
      let inputs = ref.map((item) => {
        return [
          { type: "text", label: "Book", clone: true, value: item.book },
          { type: "number", label: "Part", value: item.part },
          { type: "number", label: "Page", value: item.page },
        ];
      });
      inputs.push(...refInput);
      setInputs(inputs);
    }
  }, [ref]);
  function submit(e) {
    e.preventDefault();
    const data = {
      title: title,
      ques: ques,
      ans: ans,
      ref: getGroupData(document.querySelector(".addFatwa .multipleInput")),
      img: img,
    };
    const url = !match.params.id
      ? "/api/fatwa/add"
      : `/api/fatwa/add/${match.params.id}`;
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        history.push("/admin");
        return;
      }
    });
  }
  return (
    <div>
      <form className="addFatwa" onSubmit={submit}>
        <section>
          <p className="label">Title</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="title"
          />
        </section>
        <section>
          <p className="label">Question</p>
          <TextareaAutosize
            value={ques}
            onChange={(e) => setQues(e.target.value)}
            aria-label="minimum height"
          />
        </section>
        <section>
          <p className="label">Answer</p>
          <TextareaAutosize
            value={ans}
            onChange={(e) => setAns(e.target.value)}
            aria-label="minimum height"
          />
        </section>
        <section>
          <p className="label">Ref.</p>
          <MultipleInput setRef={setRef} inputs={inputs} refInput={refInput} />
        </section>
        <section className="btns">
          <Link to="/admin" className="btn">
            Cancel
          </Link>
          <button type="submit" className="btn">
            Add Fatwa
          </button>
        </section>
      </form>
    </div>
  );
}
function SingleFatwa({ fatwa }) {
  function deleteFatwa(e) {
    const id = e.target.parentElement.dataset.id;
    fetch(`/api/fatwa/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === "200") {
          console.log("item deleted");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <tr data-id={fatwa._id}>
      <td>
        <Link to={`/fatwa/${fatwa._id}`}>
          {fatwa.title.length > 30
            ? fatwa.title.substring(0, 30) + "..."
            : fatwa.title}
        </Link>
      </td>
      <td>
        {fatwa.ques.length > 30
          ? fatwa.ques.substring(0, 30) + "..."
          : fatwa.ques}
      </td>
      <td>
        {fatwa.ans.length > 30 ? fatwa.ans.substring(0, 40) + "..." : fatwa.ans}
      </td>
      <td className="icon edit">
        <Link to={`/admin/add/${fatwa._id}`}>
          <ion-icon name="create-outline"></ion-icon>
        </Link>
      </td>
      <td onClick={deleteFatwa} className="icon delete">
        <ion-icon name="trash-outline"></ion-icon>
      </td>
    </tr>
  );
}
function AllFatwa() {
  const [allFatwa, setAllFatwa] = useState([]);
  useEffect(() => {
    fetch("/api/allfatwa")
      .then((res) => res.json())
      .then((data) => {
        setAllFatwa(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="allFatwa">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Question</th>
            <th>Answer</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allFatwa.map((fatwa) => (
            <SingleFatwa key={fatwa._id} fatwa={fatwa} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="main adminPanel">
      <h2>Admin Panel</h2>
      <Link to="/admin/allfatwa">Show all Fatwa</Link>
      <Link to="/admin/add">Add Fatwa</Link>
      <Route path="/admin/add" exact component={AddFatwaForm} />
      <Route path="/admin/add/:id" component={AddFatwaForm} />
      <Route path="/admin/allfatwa" component={AllFatwa} />
    </div>
  );
}

export default AdminPanel;

// delete fatwa -
// allfatwa fetch -            http://localhost:8080
// allfatwa form 3 -
