import React, { useState, useContext, useEffect, useRef } from "react";
import { SiteContext } from "../Context";
import TextareaAutosize from "react-textarea-autosize";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { OutsideClick } from "./TableElements";

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
        const num = +input.value
          .replaceAll("০", "0")
          .replaceAll("১", "1")
          .replaceAll("২", "2")
          .replaceAll("৩", "3")
          .replaceAll("৪", "4")
          .replaceAll("৫", "5")
          .replaceAll("৬", "6")
          .replaceAll("৭", "7")
          .replaceAll("৮", "8")
          .replaceAll("৯", "9");
        data[section.id] = isNaN(num) ? input.value : num;
      }
    }
    Object.keys(data).length > 0 && allData.push(data);
  }
  return allData;
};
// const defaultValidation = /^[ঀ-৾؀-ۿa-zA-Z0-9\s():;"',.।!?/\\-]+$/;
const defaultValidation = /./;
export const SS = {
  set: (key, value) => sessionStorage.setItem(key, value),
  get: (key) => sessionStorage.getItem(key) || "",
  remove: (key) => sessionStorage.removeItem(key),
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
export const $$ = (selector) => document.querySelectorAll(selector);
export const emptyFieldWarning = (selector, inputType, warning) => {
  const emptyFieldWarning = document.createElement("p");
  emptyFieldWarning.classList.add("emptyFieldWarning");
  emptyFieldWarning.textContent = warning;
  if ($(`${selector} .emptyFieldWarning`) === null) {
    $(`${selector}`).appendChild(emptyFieldWarning);
  }
  $(`${selector} ${inputType}`).focus();
};
export const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};
export const Input = ({
  id,
  dataId,
  label,
  type,
  defaultValue,
  pattern,
  strict,
  warning,
  required,
  onChange,
  disabled,
  max,
  min,
  children,
  placeholder,
  className,
  validationMessage,
  autoFocus,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [showLabel, setShowLabel] = useState(!defaultValue);
  const [invalidChar, setInvalidChar] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const changeHandler = (e) => {
    e.target.setCustomValidity("");
    setInvalidInput(false);
    const regex = strict || defaultValidation;
    if (e.target.value === "" || regex.exec(e.target.value) !== null) {
      setValue(e.target.value);
      onChange && onChange(e.target);
    } else {
      if (!invalidChar) {
        setInvalidChar(true);
        setTimeout(() => setInvalidChar(false), 2000);
      }
    }
  };
  const focus = () => setShowLabel(false);
  const blur = () => !value && setShowLabel(true);
  return (
    <section
      id={dataId}
      className={`input ${className || ""} ${invalidChar ? "invalid" : ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      <label className={`label ${showLabel ? "active" : ""}`}>
        {invalidChar ? (warning ? warning : "অকার্যকর অক্ষর!") : label}
      </label>
      <input
        autoFocus={autoFocus}
        onInvalid={(e) => {
          e.target.setCustomValidity(" ");
          setInvalidInput(true);
        }}
        minLength={min}
        value={value || ""}
        required={required}
        type={type || "text"}
        onChange={changeHandler}
        onFocus={focus}
        onBlur={blur}
        maxLength={max || 100}
        id={id ? id : ID(8)}
        disabled={disabled}
        placeholder={placeholder}
        pattern={pattern}
      />
      {children}
      {invalidInput && <p className="emptyFieldWarning">{validationMessage}</p>}
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
  defaultValue,
  id,
  pattern,
  children,
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
      id={id}
      defaultValue={defaultValue}
      strict={/./}
      pattern={pattern}
      min={8}
      dataId={dataId}
      type={showPass ? "text" : "password"}
      required={true}
      label={label}
      max={32}
      onChange={change}
      placeholder={placeholder}
      validationMessage={
        !passwordStrength && match
          ? pass.length > 0
            ? "পাসওয়ার্ড মেলেনি"
            : "পাসওয়ার্ড নিশ্চিত করুন"
          : "পাসওয়ার্ড প্রবেশ করুন"
      }
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
      {children}
    </Input>
  );
};
export const Textarea = ({
  type,
  label,
  required,
  id,
  min,
  max,
  dataId,
  defaultValue,
  pattern,
  warning,
  onChange,
  className,
  children,
  disabled,
  validationMessage,
  strict,
  autoFocus,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [showLabel, setShowLabel] = useState(true);
  const [invalidChar, setInvalidChar] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  useEffect(() => {
    defaultValue && setValue(defaultValue);
    defaultValue && setShowLabel(false);
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
    setInvalidInput(false);
    e.target.setCustomValidity("");
    const regex = strict || defaultValidation;
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
      className={`input textarea ${className ? className : ""} ${
        invalidChar ? "invalid" : ""
      }`}
    >
      <label className={`label ${showLabel ? "active" : ""}`}>
        {invalidChar ? (warning ? warning : "অকার্যকর অক্ষর!") : label}
      </label>
      <TextareaAutosize
        autoFocus={autoFocus}
        onInvalid={(e) => {
          e.target.setCustomValidity(" ");
          setInvalidInput(true);
        }}
        disabled={disabled}
        required={required}
        value={value}
        onFocus={focus}
        onBlur={blur}
        onChange={change}
        aria-label="minimum height"
        minLength={min}
        maxLength={max}
        pattern={pattern}
      />
      {max && showLimit && (
        <p className="charLimit">
          <FormattedMessage
            id="charLimit"
            values={{ number: <FormattedNumber value={max - value.length} /> }}
            defaultValue={`${max - value.length} characters left!`}
          />
        </p>
      )}
      {children}
      {invalidInput && <p className="emptyFieldWarning">{validationMessage}</p>}
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
  return (
    <div className="group">
      {inputs.map((input) => {
        return (
          <Input
            dataId={input.id}
            key={input.id}
            warning={input.type === "number" && "0-9, ০-৯"}
            defaultValue={input.value}
            required={input.clone ? false : true}
            strict={input.type === "number" && /^[০-৯0-9]+$/g}
            label={input.label}
            id={input.clone ? id : ""}
            onChange={(e) => {
              clone(e);
              setValue(e.value);
            }}
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
export const Combobox = ({
  label,
  icon,
  options,
  defaultValue,
  onChange,
  maxHeight,
  required,
  disabled,
  dataId,
  validationMessage,
}) => {
  const { locale } = useContext(SiteContext);
  const [value, setValue] = useState(() => {
    if (defaultValue > -1 && options[defaultValue]) {
      return options[defaultValue].label;
    } else if (typeof defaultValue === "object") {
      return defaultValue[locale];
    } else {
      return "";
    }
  });
  const [invalidInput, setInvalidInput] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState("");
  const input = useRef();
  return (
    <OutsideClick
      className={`combobox ${disabled ? "disabled" : ""}`}
      setOpen={setOpen}
      open={open}
      style={{ position: "relative" }}
      id={dataId ? dataId : ""}
    >
      <label className={`${value === "" ? "active" : ""}`}>{label}</label>
      <input
        ref={input}
        required={required}
        data={JSON.stringify(data)}
        value={value}
        onFocus={(e) => e.target.blur()}
        onInvalid={(e) => {
          setInvalidInput(true);
          e.target.setCustomValidity(" ");
        }}
        onChange={() => {}}
      />
      {invalidInput && <p className="emptyFieldWarning">{validationMessage}</p>}
      <ion-icon
        onClick={() => setOpen(!open)}
        name={`${icon ? icon : "chevron-down"}-outline`}
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
        {options.map((option) => (
          <li
            key={option.label}
            onClick={(e) => {
              setData(option.value);
              setValue(option.label);
              onChange && onChange(option);
              setOpen(false);
              setInvalidInput(false);
              input.current.setCustomValidity("");
            }}
            className={`option ${value === option.label ? "selected" : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </OutsideClick>
  );
};
export const Checkbox = ({
  label,
  onChange,
  checked,
  required,
  validationMessage,
  children,
}) => {
  const [value, setValue] = useState(checked);
  function handleChange(e) {
    e.target.setCustomValidity("");
    setValue(!checked);
    onChange && onChange(e.target);
  }
  return (
    <section className={`checkbox ${checked ? "checked" : ""}`}>
      <input
        onChange={handleChange}
        type="Checkbox"
        required={required}
        defaultChecked={value}
        onInvalid={(e) => {
          e.target.setCustomValidity(validationMessage || "");
        }}
      />
      <label>
        {label}
        {children}
      </label>
    </section>
  );
};

export const Submit = ({ className, label, loading, onClick }) => {
  return (
    <button
      className={`${className} ${loading ? "loading" : ""}`}
      type="submit"
      disabled={loading}
      onClick={onClick}
    >
      {loading && (
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {label}
    </button>
  );
};
