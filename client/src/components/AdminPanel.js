import React, { useState, useEffect } from "react";
import { Route, Link } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import "./CSS/AdminPanel.min.css";

const data = [
  {
    id: "23541wgtasgaasgaserq432d",
    title: "ইমিটেশনের হাকিকত",
    ques:
      "ইমিটেশনের হাকিকত কী? ইমিটেশনের অলংকার আংটি, চুড়ি, চেইন ইত্যাদি নারীদের জন্য বৈধ বলা হয় এবং নারীরা ব্যাপকভাবে ব্যবহারও করে। অথচ লোহা, পিতল, তামা ইত্যাদি ধাতু দিয়ে তৈরি আংটি পরিধান করা নারীদের জন্যও বৈধ নয়। ইমিটেশনও তো এসকল ধাতু দিয়ে তৈরি। তাহলে আসল ফরকটা কোথায়? ২. এলার্জির জন্য পিতলের তৈরি আংটি ব্যবহার করা জায়েয আছে কি ?",
    ans:
      "ইমিটেশন মূলত তামা, পিতল ও ব্রোঞ্জ ইত্যাদির মিশ্রণে তৈরী এক প্রকারের অলংকার। যার মধ্যে বিভিন্ন কেমিক্যাল প্রক্রিয়াজাত করে সোনালি কালারের প্রলেপ দেওয়া হয়। আর নিরেট লোহা, তামা কিংবা পিতলের আংটি ইত্যাদি মেয়েদের জন্য ব্যবহার করা নিষেধ হলেও এসবের ওপর যদি অন্য কোনো কিছুর  প্রলেপ থাকে তাহলে তা ব্যবহার করা যাবে। সেমতে নারীদের জন্য সোনা-রুপা ছাড়াও সাজ-সজ্জা হিসাবে লোহা, পিতল, তামা, কাচ-হীরা ইত্যাদি ধাতু দ্বারা তৈরী অলংকার পরিধান করা বৈধ । এলার্জির অযুহাতে নিরেট পিতলের আংটি ব্যবহার করা বৈধ নয়। তবে তার উপর যদি রুপার প্রলেপ থাকে তাহলে নারী-পুরুষ উভয়ে ব্যবহার করতে পারবে। আর স্বর্ণের প্রলেপ থাকলে শুধু নারীদের জন্য বৈধ হবে।",
    img: [],
    date: "2020-03-21",
    ref: [
      "আবু দাঊদ-৪/৯০",
      " এ’লাউস সুনান-১৭/৩১২",
      "মুসান্নাফে ইবনে আবী শায়বাহ-৫/১৯৪",
      " হেদায়া-৪/৩৬৭",
      " শামী-৬/৩৫৬",
      " আল-মুহীতুল বুরহানী-৫/৩৪৯",
      " ইমদাদুল ফাতাওয়া-৪/১৩৫; মাহমুদিয়া-১৪/৪২১",
    ],
  },
  {
    id: "23541wgt34523432d",
    title: "ভ্রু-প্লাক করার বিধান",
    ques: "ভ্রু-প্লাক করার বিধান কী?",
    ans:
      "ভ্রু যদি অতিরিক্ত বেশি হয়ে যায় যে দেখতে খারাপ দেখা যায়। তাহলে তা কেটে স্বাভাবিক অবস্থায় রাখা জায়েয আছে। তবে শুধুমাত্র ফ্যাশনের জন্য ভ্রু-প্লাক করা জায়েয নেই ।",
    img: [],
    date: "2020-03-21",
    ref: [
      "আবু দাঊদ-৪/৯০",
      " এ’লাউস সুনান-১৭/৩১২",
      "মুসান্নাফে ইবনে আবী শায়বাহ-৫/১৯৪",
      " হেদায়া-৪/৩৬৭",
      " শামী-৬/৩৫৬",
      " আল-মুহীতুল বুরহানী-৫/৩৪৯",
      " ইমদাদুল ফাতাওয়া-৪/১৩৫; মাহমুদিয়া-১৪/৪২১",
    ],
  },
  {
    id: "125143wgasdgaasgaserq432d",
    title: "মেসেজের মাধ্যমে তালাক",
    ques:
      "যদি কোন স্বামী তার স্ত্রীকে মেসেজের মাধ্যমে বলে ফেলে যে, ‘‘আজ থেকে তুই স্বাধীন” মানে তোর মনে যা চায়, তুই তাই কর। এখানে স্বামীর তালাকের কোন নিয়ত নেই তাহলে এটা কী হতে পারে?",
    ans:
      "স্বামী তার স্ত্রীকে “তুই স্বাধীন” বলার ক্ষেত্রে তালাকের নিয়ত না থাকলে স্ত্রীর উপর কোন তালাক পতিত হবেনা ।",
    img: [],
    date: "2020-03-21",
    ref: ["সহিহ্ বুখারী-৭/৪৩", "হিদায়া-২/৩৭৩", "মাউসূআতুল ফিকহিয়্যাহ-৩৫/১৩৮"],
  },
  {
    id: "afsdhawq3423sgaasgaserq432d",
    title: "সুন্নত কিংবা নফলের কাযা",
    ques:
      "হযরতের কাছে আমার জানার বিষয় হলো, যেসব ফরজ নামাযের কাযা পড়া হয় ঐসব নামাযের সুন্নত কিংবা নফলের কাযা আছে ? বিস্তারিত জানিয়ে বাধিত করবেন।",
    ans:
      "সুন্নত এবং নফলের কাযা আদায় করতে হয় না। তবে ফজরের সুন্নত এক্ষেত্রে ব্যতিক্রম। কখনো ফজরের সুন্নত নামায ফরজসহ কাযা হয়ে গেলে ওই দিন সূর্যোদয়ের পর থেকে দ্বিপ্রহরের পূর্বে কাযা পড়লে ফজরের সাথে সুন্নতও আদায় করে নিবে। আর শুধুমাত্র সুন্নত কাযা হয়ে গেলে সূর্যোদয়ের পর থেকে দ্বিপ্রহরের পূর্বে আদায় করে নেওয়া উত্তম ।",
    img: [],
    date: "2020-03-21",
    ref: [
      "বাদায়েউস সানায়ে ১/৬৪৩",
      "ফাতাওয়ায়ে তাতারখানিয়া ২/৩০২",
      "মআল বাহরুর রায়েক ২/১৩২",
      "রদ্দুল মুহতার ২/৫১৩",
      "সুনানে তিরমিযি, হাদিস ১৮৩",
    ],
  },
];

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
  const [inputs, setInputs] = useState(refInput);
  const [title, setTitle] = useState("");
  const [ques, setQues] = useState("");
  const [ans, setAns] = useState("");
  const [ref, setRef] = useState([]);
  const [img, setImg] = useState([]);
  const itemToEdit = null;
  useEffect(() => {
    if (itemToEdit) {
      let inputs = itemToEdit.products.map((item) => {
        return [
          { type: "text", label: "Book", clone: true, value: item.book },
          { type: "number", label: "Part", value: item.part },
          { type: "number", label: "Page", value: item.page },
        ];
      });
      inputs.push(...refInput);
      setInputs(inputs);
    }
  }, [itemToEdit]);

  function submit(e) {
    e.preventDefault();
    setRef(getGroupData(document.querySelector(".addFatwa .multipleInput")));
    const data = {
      title: title,
      ques: ques,
      ans: ans,
      ref: ref,
      img: img,
    };
    console.log(data);
    fetch("/admin/add", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => console.log(res))
      .then((data) => console.log(data));
  }
  useEffect(() => {
    if (match.params.id) {
      console.log("fetch data & update default values");
    }
  }, []);
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
  return (
    <tr>
      <td>
        {fatwa.title.length > 30
          ? fatwa.title.substring(0, 30) + "..."
          : fatwa.title}
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
        <Link to={`/admin/add/${fatwa.id}`}>
          <ion-icon name="create-outline"></ion-icon>
        </Link>
      </td>
      <td className="icon delete">
        <ion-icon name="trash-outline"></ion-icon>
      </td>
    </tr>
  );
}
function AllFatwa() {
  const [allFatwa, setAllFatwa] = useState(data);
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
          {data.map((fatwa) => (
            <SingleFatwa key={fatwa.id} fatwa={fatwa} />
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
