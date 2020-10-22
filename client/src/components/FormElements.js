import React, { useState, useContext, useEffect } from "react";
import { SiteContext } from "../Context";
import TextareaAutosize from "react-textarea-autosize";
import { FormattedMessage, FormattedNumber } from "react-intl";

export const topics = [
  { "bn-BD": "আকীদা", "en-US": "belief" },
  { "bn-BD": "খুলা-তালাক", "en-US": "divorce" },
  { "bn-BD": "জায়েয-নাজায়েয", "en-US": "permissible" },
  { "bn-BD": "নামায", "en-US": "salat" },
  { "bn-BD": "রোজা", "en-US": "fest" },
  { "bn-BD": "হজ্জ", "en-US": "hajj" },
  { "bn-BD": "যাকাত", "en-US": "zakat" },
  { "bn-BD": "হেবা-ফারায়েজ", "en-US": "distribution of property" },
  { "bn-BD": "কুরবানী", "en-US": "kurbani" },
  { "bn-BD": "দান-সাদাকাহ", "en-US": "charity" },
  { "bn-BD": "কসম-মান্নত", "en-US": "swear" },
  { "bn-BD": "ক্রয়-বিক্রয়", "en-US": "buying and selling" },
  { "bn-BD": "পবিত্রতা", "en-US": "holiness" },
  { "bn-BD": "বিবাহ-রাজয়াত", "en-US": "wedding" },
  { "bn-BD": "ব্যাংক-বিমা", "en-US": "bank insurance" },
  { "bn-BD": "ভাড়া-লিজ", "en-US": "rent-lease" },
  { "bn-BD": "ইতিহাস", "en-US": "history" },
];
export const GetGroupData = (multipleInput) => {
  const allData = [];
  for (var i = 0; i < multipleInput.children.length; i++) {
    const group = multipleInput.children[i];
    const data = {};
    for (var j = 0; j < group.children.length; j++) {
      const section = group.children[j];
      const input = section.querySelector("input");
      if (input.value === "" || section.classList.contains("disabled")) {
        continue;
      } else {
        data[section.id] = input.value;
      }
    }
    Object.keys(data).length > 0 && allData.push(data);
  }
  return allData;
};

export const ID = (length) => {
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
export const $ = (selector) => document.querySelector(selector);
export const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};
export const Input = ({
  warning,
  validation,
  defaultValue,
  type,
  label,
  required,
  id,
  max,
  onChange,
  disabled,
  dataId,
  min,
  children,
  placeholder,
}) => {
  const [value, setValue] = useState("");
  const [showLabel, setShowLabel] = useState(true);
  const [invalidChar, setInvalidChar] = useState(false);
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      setShowLabel(false);
    }
  }, [defaultValue]);
  const changeHandler = (e) => {
    if (type === "text" || type === "password") {
      const regex = validation || /^[ঀ-৾a-zA-Z0-9\s():;"'\-,.।?/\\]+$/;
      if (e.target.value === "" || regex.exec(e.target.value) !== null) {
        setValue(e.target.value);
        onChange && onChange(e.target);
      } else {
        if (!invalidChar) {
          setInvalidChar(true);
          setTimeout(() => setInvalidChar(false), 2000);
        }
      }
    } else {
      setValue(e.target.value);
      onChange && onChange(e.target);
    }
  };
  const focus = () => setShowLabel(false);
  const blur = () => value === "" && setShowLabel(true);
  return (
    <section
      id={dataId}
      className={`input ${invalidChar ? "invalid" : ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      <label className={`label ${showLabel ? "active" : ""}`}>
        {invalidChar ? (warning ? warning : "অকার্যকর অক্ষর!") : label}
      </label>

      <input
        minLength={min}
        value={value}
        required={required}
        type={type}
        onChange={changeHandler}
        onFocus={focus}
        onBlur={blur}
        maxLength={max || 100}
        id={id ? id : ID(8)}
        disabled={disabled}
        placeholder={placeholder}
      />
      {children}
    </section>
  );
};
export const PasswordInput = ({
  label,
  dataId,
  passwordStrength,
  match,
  placeholder,
  onChange,
}) => {
  const [showPass, setShowPass] = useState(false);
  const [style, setStyle] = useState({ width: 0 });
  const [pass, setPass] = useState("");
  function change(target) {
    let strength = 0;
    setPass(target.value);
    const pass = target.value;
    pass.length >= 1 && (strength += 1);
    pass.length > 3 && (strength += 1);
    pass.length > 5 && (strength += 1);
    if (pass.match(/[a-z]/g)) {
      pass.match(/[a-z]/g).length >= 1 && (strength += 1);
      pass.match(/[a-z]/g).length > 2 && (strength += 1);
    }
    if (pass.match(/[A-Z]/g)) {
      pass.match(/[A-Z]/g).length >= 1 && (strength += 1);
      pass.match(/[A-Z]/g).length > 2 && (strength += 1);
    }
    if (pass.match(/[0-1]/g)) {
      pass.match(/[0-1]/g).length >= 1 && (strength += 1);
      pass.match(/[0-1]/g).length > 2 && (strength += 1);
    }
    if (pass.match(/~|!|@|#|\$|%|\^|&|\*|\(|\)|_|\+|<|>\s/g)) {
      pass.match(/~|!|@|#|\$|%|\^|&|\*|\(|\)|_|\+|<|>\s/g).length >= 1 &&
        (strength += 1);
      pass.match(/~|!|@|#|\$|%|\^|&|\*|\(|\)|_|\+|<|>\s/g).length > 2 &&
        (strength += 1);
    }
    setStyle({
      width: `calc((100% / 11) * ${strength})`,
      background: `hsl(${(110 / 100) * ((100 / 11) * strength)}, 69%, 48%)`,
    });
    if (dataId === "pass" && match) {
      if (document.querySelector(match).value !== pass) {
        document.querySelector(match).nextElementSibling.style.background =
          "rgb(245, 7, 0)";
      } else {
        document.querySelector(match).nextElementSibling.style.background =
          "rgb(12, 232, 100)";
      }
    }
    onChange && onChange(target);
  }
  function handleIconClick(e) {
    setShowPass(!showPass);
    e.target.parentElement.querySelector("input").focus();
  }
  return (
    <Input
      validation={/./}
      min={8}
      dataId={dataId}
      type={showPass ? "text" : "password"}
      required={true}
      label={label}
      max={32}
      onChange={change}
      placeholder={placeholder}
    >
      {passwordStrength && (
        <span style={style} className="passwordStrength"></span>
      )}
      {!passwordStrength && match && (
        <span
          style={{
            background:
              document.querySelector(match) &&
              (document.querySelector(match).value === pass
                ? "rgb(12, 232, 100)"
                : "rgb(245, 7, 0)"),
            width: pass.length === 0 ? 0 : "100%",
          }}
          className="passwordConfirm"
        ></span>
      )}
      {showPass ? (
        <ion-icon onClick={handleIconClick} name="eye-outline"></ion-icon>
      ) : (
        <ion-icon onClick={handleIconClick} name="eye-off-outline"></ion-icon>
      )}
    </Input>
  );
};
export const Textarea = ({
  type,
  label,
  required,
  id,
  max,
  dataId,
  defaultValue,
  validation,
  warning,
  onChange,
}) => {
  const [value, setValue] = useState("");
  const [showLabel, setShowLabel] = useState(true);
  const [invalidChar, setInvalidChar] = useState(false);
  useEffect(() => {
    defaultValue && setValue(defaultValue);
    defaultValue && defaultValue.length > 10 && setShowLabel(false);
  }, [defaultValue]);
  const [showLimit, setShowLimit] = useState(false);
  const focus = () => {
    setShowLabel(false);
    setShowLimit(true);
  };
  const blur = () => {
    value === "" && setShowLabel(true);
    setShowLimit(false);
  };
  function change(e) {
    const regex = validation || /^[ঀ-৾a-zA-Z0-9\s():;"',.।?/\\]+$/;
    if (e.target.value === "" || regex.exec(e.target.value) !== null) {
      setValue(e.target.value);
      onChange && onChange(e.target);
    } else {
      if (!invalidChar) {
        setInvalidChar(true);
        setTimeout(() => setInvalidChar(false), 2000);
      }
    }
  }
  return (
    <section
      id={dataId}
      className={`input textarea ${invalidChar ? "invalid" : ""}`}
    >
      <label className={`label ${showLabel ? "active" : ""}`}>
        {invalidChar ? (warning ? warning : "অকার্যকর অক্ষর!") : label}
      </label>
      <TextareaAutosize
        required={required}
        value={value}
        onFocus={focus}
        onBlur={blur}
        onChange={change}
        aria-label="minimum height"
        maxLength={max}
      />
      {max && showLimit && (
        <p className="charLimit">
          <FormattedMessage
            id="form.jamiaReg.warning.charLimit"
            values={{ number: <FormattedNumber value={max - value.length} /> }}
            defaultValue={`${max - value.length} characters left!`}
          />
        </p>
      )}
    </section>
  );
};
const Group = ({ id, inputs, clone, setGroupCount }) => {
  const { lan } = useContext(SiteContext);
  const [value, setValue] = useState("");
  function handleMount() {
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
  }
  useEffect(handleMount, []);
  function handleChange(e) {
    clone(e);
    setValue(e.value);
  }
  return (
    <div className="group">
      {inputs.map((input) => {
        return (
          <Input
            key={lan === "en" ? input.label.en : input.label.bn}
            warning={"Letters & numbers only!"}
            defaultValue={input.value}
            required={input.clone ? false : true}
            type={input.type}
            label={lan === "en" ? input.label.en : input.label.bn}
            id={input.clone ? id : ""}
            className={input.id}
            onChange={input.clone && handleChange}
            disabled={input.clone ? false : input.value ? false : value === ""}
          />
        );
      })}
    </div>
  );
};
export const MultipleInput = ({ inputs, refInput, id }) => {
  const [groupCount, setGroupCount] = useState([]);
  useEffect(() => {
    if (inputs[0].value) {
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
  function handleInputChange() {
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
  }
  useEffect(handleInputChange, [inputs]);
  return (
    <div id={id} className={`multipleInput`}>
      {final}
    </div>
  );
};
export const ComboboxMulti = ({
  label,
  data,
  defaultValue,
  id,
  maxHeight,
  required,
}) => {
  const { locale } = useContext(SiteContext);
  const [value, setValue] = useState(defaultValue || { [locale]: "" });
  const [open, setOpen] = useState(false);
  function handleClick(e) {
    Array.from(e.target.parentElement.children).forEach((item, i) => {
      if (item === e.target) {
        item.classList.add("selected");
        setValue(data[i]);
      } else {
        item.classList.remove("selected");
      }
    });
    setOpen(false);
  }
  useEffect(() => {
    const outsideClick = (e) => {
      !e.path.includes(document.querySelector(`#${id}`)) && setOpen(false);
    };
    document.addEventListener("click", outsideClick);
    return () => {
      document.removeEventListener("click", outsideClick);
    };
  }, [id]);
  return (
    <section id={id} className="combobox" style={{ position: "relative" }}>
      <label className={`${value[locale] === "" ? "active" : ""}`}>
        {label}
      </label>
      <input
        required={required}
        value={value[locale]}
        data-en={value["en-US"]}
        data-bn={value["bn-BD"]}
        onFocus={(e) => e.target.blur()}
        onChange={(e) => e.target.blur()}
      />
      <ion-icon
        onClick={() => setOpen(true)}
        name="chevron-down-outline"
      ></ion-icon>
      <ul
        style={{
          width: "100%",
          position: "absolute",
          maxHeight: open ? maxHeight : 0,
          zIndex: 100,
          overflow: "auto",
        }}
        className="options"
      >
        {data.map((option) => (
          <li key={option[locale]} onClick={handleClick} className="option">
            {option[locale]}
          </li>
        ))}
      </ul>
    </section>
  );
};
export const Combobox = ({
  label,
  data,
  defaultValue,
  id,
  maxHeight,
  required,
}) => {
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  function handleClick(e) {
    Array.from(e.target.parentElement.children).forEach((item, i) => {
      if (item === e.target) {
        item.classList.add("selected");
        setValue(data[i]);
      } else {
        item.classList.remove("selected");
      }
    });
    setOpen(false);
  }
  useEffect(() => {
    const outsideClick = (e) => {
      !e.path.includes(document.querySelector(`#${id}`)) && setOpen(false);
    };
    document.addEventListener("click", outsideClick);
    return () => {
      document.removeEventListener("click", outsideClick);
    };
  }, [id]);
  return (
    <section id={id} className="combobox" style={{ position: "relative" }}>
      <label className={`${value === "" ? "active" : ""}`}>{label}</label>
      <input
        required={required}
        value={value}
        onFocus={(e) => e.target.blur()}
        onChange={(e) => e.target.blur()}
      />
      <ion-icon
        onClick={() => setOpen(!open)}
        name="chevron-down-outline"
      ></ion-icon>
      <ul
        style={{
          width: "100%",
          position: "absolute",
          maxHeight: open ? maxHeight : 0,
          zIndex: 100,
          overflow: "auto",
        }}
        className="options"
      >
        {data.map((option) => (
          <li key={option} onClick={handleClick} className="option">
            {option}
          </li>
        ))}
      </ul>
    </section>
  );
};
export const Checkbox = ({
  label,
  change,
  defaultValue,
  required,
  children,
}) => {
  const [checked, setChecked] = useState();
  useEffect(() => {
    setChecked(defaultValue);
  }, [defaultValue]);
  function handleChange() {
    setChecked(!checked);
    change && change();
  }
  return (
    <section className={`checkbox ${checked ? "checked" : ""}`}>
      <input
        onChange={handleChange}
        type="Checkbox"
        required={required}
        defaultChecked={checked}
      />
      <label>
        {label}
        {children}
      </label>
    </section>
  );
};
