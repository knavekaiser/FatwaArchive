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
String.prototype.strReverse = function () {
  var newstring = "";
  for (var s = 0; s < this.length; s++) {
    newstring = this.charAt(s) + newstring;
  }
  return newstring;
  //strOrig = ' texttotrim ';
  //strReversed = strOrig.revstring();
};
function chkPass(pwd) {
  // Simultaneous variable declaration and value assignment aren't supported in IE apparently
  // so I'm forced to assign the same value individually per var to support a crappy browser *sigh*
  var nScore = 0,
    nLength = 0,
    nAlphaUC = 0,
    nAlphaLC = 0,
    nNumber = 0,
    nSymbol = 0,
    nMidChar = 0,
    nRequirements = 0,
    nAlphasOnly = 0,
    nNumbersOnly = 0,
    nUnqChar = 0,
    nRepChar = 0,
    nRepInc = 0,
    nConsecAlphaUC = 0,
    nConsecAlphaLC = 0,
    nConsecNumber = 0,
    nSeqAlpha = 0,
    nSeqNumber = 0,
    nSeqSymbol = 0,
    nReqChar = 0,
    nMultConsecCharType = 0;
  var nMultRepChar = 1,
    nMultConsecSymbol = 1;
  var nMultMidChar = 2,
    nMultRequirements = 2,
    nMultConsecAlphaUC = 2,
    nMultConsecAlphaLC = 2,
    nMultConsecNumber = 2;
  var nReqCharType = 3,
    nMultAlphaUC = 3,
    nMultAlphaLC = 3,
    nMultSeqAlpha = 3,
    nMultSeqNumber = 3,
    nMultSeqSymbol = 3;
  var nMultLength = 4,
    nMultNumber = 4;
  var nMultSymbol = 6;
  var nTmpAlphaUC = "",
    nTmpAlphaLC = "",
    nTmpNumber = "",
    nTmpSymbol = "";
  var sAlphaUC = "0",
    sAlphaLC = "0",
    sNumber = "0",
    sSymbol = "0",
    sMidChar = "0",
    sRequirements = "0",
    sAlphasOnly = "0",
    sNumbersOnly = "0",
    sRepChar = "0",
    sConsecAlphaUC = "0",
    sConsecAlphaLC = "0",
    sConsecNumber = "0",
    sSeqAlpha = "0",
    sSeqNumber = "0",
    sSeqSymbol = "0";
  var sAlphas = "abcdefghijklmnopqrstuvwxyz";
  var sNumerics = "01234567890";
  var sSymbols = ")!@#$%^&*()";
  var sComplexity = "Too Short";
  var sStandards = "Below";
  var nMinPwdLen = 8;
  if (pwd) {
    nScore = parseInt(pwd.length * nMultLength);
    nLength = pwd.length;
    var arrPwd = pwd.replace(/\s+/g, "").split(/\s*/);
    var arrPwdLen = arrPwd.length;

    /* Loop through password to check for Symbol, Numeric, Lowercase and Uppercase pattern matches */
    for (var a = 0; a < arrPwdLen; a++) {
      if (arrPwd[a].match(/[A-Z]/g)) {
        if (nTmpAlphaUC !== "") {
          if (nTmpAlphaUC + 1 === a) {
            nConsecAlphaUC++;
          }
        }
        nTmpAlphaUC = a;
        nAlphaUC++;
      } else if (arrPwd[a].match(/[a-z]/g)) {
        if (nTmpAlphaLC !== "") {
          if (nTmpAlphaLC + 1 === a) {
            nConsecAlphaLC++;
          }
        }
        nTmpAlphaLC = a;
        nAlphaLC++;
      } else if (arrPwd[a].match(/[0-9]/g)) {
        if (a > 0 && a < arrPwdLen - 1) {
          nMidChar++;
        }
        if (nTmpNumber !== "") {
          if (nTmpNumber + 1 === a) {
            nConsecNumber++;
          }
        }
        nTmpNumber = a;
        nNumber++;
      } else if (arrPwd[a].match(/[^a-zA-Z0-9_]/g)) {
        if (a > 0 && a < arrPwdLen - 1) {
          nMidChar++;
        }
        if (nTmpSymbol !== "") {
          if (nTmpSymbol + 1 === a) {
          }
        }
        nTmpSymbol = a;
        nSymbol++;
      }
      /* Internal loop through password to check for repeat characters */
      var bCharExists = false;
      for (var b = 0; b < arrPwdLen; b++) {
        if (arrPwd[a] === arrPwd[b] && a !== b) {
          /* repeat character exists */
          bCharExists = true;
          /*
					Calculate icrement deduction based on proximity to identical characters
					Deduction is incremented each time a new match is discovered
					Deduction amount is based on total password length divided by the
					difference of distance between currently selected match
					*/
          nRepInc += Math.abs(arrPwdLen / (b - a));
        }
      }
      if (bCharExists) {
        nRepChar++;
        nUnqChar = arrPwdLen - nRepChar;
        nRepInc = nUnqChar ? Math.ceil(nRepInc / nUnqChar) : Math.ceil(nRepInc);
      }
    }

    /* Check for sequential alpha string patterns (forward and reverse) */
    for (var s = 0; s < 23; s++) {
      var sFwd = sAlphas.substring(s, parseInt(s + 3));
      var sRev = sFwd.strReverse();
      if (
        pwd.toLowerCase().indexOf(sFwd) !== -1 ||
        pwd.toLowerCase().indexOf(sRev) !== -1
      ) {
        nSeqAlpha++;
      }
    }

    /* Check for sequential numeric string patterns (forward and reverse) */
    for (var s = 0; s < 8; s++) {
      var sFwd = sNumerics.substring(s, parseInt(s + 3));
      var sRev = sFwd.strReverse();
      if (
        pwd.toLowerCase().indexOf(sFwd) !== -1 ||
        pwd.toLowerCase().indexOf(sRev) !== -1
      ) {
        nSeqNumber++;
      }
    }

    /* Check for sequential symbol string patterns (forward and reverse) */
    for (var s = 0; s < 8; s++) {
      var sFwd = sSymbols.substring(s, parseInt(s + 3));
      var sRev = sFwd.strReverse();
      if (
        pwd.toLowerCase().indexOf(sFwd) !== -1 ||
        pwd.toLowerCase().indexOf(sRev) !== -1
      ) {
        nSeqSymbol++;
      }
    }

    /* Modify overall score value based on usage vs requirements */

    /* General point assignment */
    if (nAlphaUC > 0 && nAlphaUC < nLength) {
      nScore = parseInt(nScore + (nLength - nAlphaUC) * 2);
      sAlphaUC = "+ " + parseInt((nLength - nAlphaUC) * 2);
    }
    if (nAlphaLC > 0 && nAlphaLC < nLength) {
      nScore = parseInt(nScore + (nLength - nAlphaLC) * 2);
      sAlphaLC = "+ " + parseInt((nLength - nAlphaLC) * 2);
    }
    if (nNumber > 0 && nNumber < nLength) {
      nScore = parseInt(nScore + nNumber * nMultNumber);
      sNumber = "+ " + parseInt(nNumber * nMultNumber);
    }
    if (nSymbol > 0) {
      nScore = parseInt(nScore + nSymbol * nMultSymbol);
      sSymbol = "+ " + parseInt(nSymbol * nMultSymbol);
    }
    if (nMidChar > 0) {
      nScore = parseInt(nScore + nMidChar * nMultMidChar);
      sMidChar = "+ " + parseInt(nMidChar * nMultMidChar);
    }

    /* Point deductions for poor practices */
    if ((nAlphaLC > 0 || nAlphaUC > 0) && nSymbol === 0 && nNumber === 0) {
      // Only Letters
      nScore = parseInt(nScore - nLength);
      nAlphasOnly = nLength;
      sAlphasOnly = "- " + nLength;
    }
    if (nAlphaLC === 0 && nAlphaUC === 0 && nSymbol === 0 && nNumber > 0) {
      // Only Numbers
      nScore = parseInt(nScore - nLength);
      nNumbersOnly = nLength;
      sNumbersOnly = "- " + nLength;
    }
    if (nRepChar > 0) {
      // Same character exists more than once
      nScore = parseInt(nScore - nRepInc);
      sRepChar = "- " + nRepInc;
    }
    if (nConsecAlphaUC > 0) {
      // Consecutive Uppercase Letters exist
      nScore = parseInt(nScore - nConsecAlphaUC * nMultConsecAlphaUC);
      sConsecAlphaUC = "- " + parseInt(nConsecAlphaUC * nMultConsecAlphaUC);
    }
    if (nConsecAlphaLC > 0) {
      // Consecutive Lowercase Letters exist
      nScore = parseInt(nScore - nConsecAlphaLC * nMultConsecAlphaLC);
      sConsecAlphaLC = "- " + parseInt(nConsecAlphaLC * nMultConsecAlphaLC);
    }
    if (nConsecNumber > 0) {
      // Consecutive Numbers exist
      nScore = parseInt(nScore - nConsecNumber * nMultConsecNumber);
      sConsecNumber = "- " + parseInt(nConsecNumber * nMultConsecNumber);
    }
    if (nSeqAlpha > 0) {
      // Sequential alpha strings exist (3 characters or more)
      nScore = parseInt(nScore - nSeqAlpha * nMultSeqAlpha);
      sSeqAlpha = "- " + parseInt(nSeqAlpha * nMultSeqAlpha);
    }
    if (nSeqNumber > 0) {
      // Sequential numeric strings exist (3 characters or more)
      nScore = parseInt(nScore - nSeqNumber * nMultSeqNumber);
      sSeqNumber = "- " + parseInt(nSeqNumber * nMultSeqNumber);
    }
    if (nSeqSymbol > 0) {
      // Sequential symbol strings exist (3 characters or more)
      nScore = parseInt(nScore - nSeqSymbol * nMultSeqSymbol);
      sSeqSymbol = "- " + parseInt(nSeqSymbol * nMultSeqSymbol);
    }

    /* Determine if mandatory requirements have been met and set image indicators accordingly */
    var arrChars = [nLength, nAlphaUC, nAlphaLC, nNumber, nSymbol];
    var arrCharsIds = ["nLength", "nAlphaUC", "nAlphaLC", "nNumber", "nSymbol"];
    var arrCharsLen = arrChars.length;
    for (var c = 0; c < arrCharsLen; c++) {
      if (arrCharsIds[c] === "nLength") {
        var minVal = parseInt(nMinPwdLen - 1);
      } else {
        var minVal = 0;
      }
      if (arrChars[c] === parseInt(minVal + 1)) {
        nReqChar++;
      } else if (arrChars[c] > parseInt(minVal + 1)) {
        nReqChar++;
      }
    }
    nRequirements = nReqChar;
    if (pwd.length >= nMinPwdLen) {
      var nMinReqChars = 3;
    } else {
      var nMinReqChars = 4;
    }
    if (nRequirements > nMinReqChars) {
      // One or more required characters exist
      nScore = parseInt(nScore + nRequirements * 2);
      sRequirements = "+ " + parseInt(nRequirements * 2);
    }

    /* Determine if additional bonuses need to be applied and set image indicators accordingly */
    var arrChars = [nMidChar, nRequirements];
    var arrCharsIds = ["nMidChar", "nRequirements"];
    var arrCharsLen = arrChars.length;
    for (var c = 0; c < arrCharsLen; c++) {
      if (arrCharsIds[c] === "nRequirements") {
        var minVal = nMinReqChars;
      } else {
        var minVal = 0;
      }
    }

    /* Determine if suggested requirements have been met and set image indicators accordingly */
    var arrChars = [
      nAlphasOnly,
      nNumbersOnly,
      nRepChar,
      nConsecAlphaUC,
      nConsecAlphaLC,
      nConsecNumber,
      nSeqAlpha,
      nSeqNumber,
      nSeqSymbol,
    ];

    /* Determine complexity based on overall score */
    if (nScore > 100) {
      nScore = 100;
    } else if (nScore < 0) {
      nScore = 0;
    }
    if (nScore >= 0 && nScore < 20) {
      sComplexity = "Very Weak";
    } else if (nScore >= 20 && nScore < 40) {
      sComplexity = "Weak";
    } else if (nScore >= 40 && nScore < 60) {
      sComplexity = "Good";
    } else if (nScore >= 60 && nScore < 80) {
      sComplexity = "Strong";
    } else if (nScore >= 80 && nScore <= 100) {
      sComplexity = "Very Strong";
    }

    return nScore;
  } else {
    return 0;
  }
}
function formatDate(input) {
  let date = new Date(input);
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
}

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
  name,
  autoComplete,
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
        name={name}
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
        autoComplete={autoComplete}
      />
      {children}
      {invalidInput && <p className="emptyFieldWarning">{validationMessage}</p>}
    </section>
  );
};
export const DateInput = ({
  dataId,
  label,
  defaultValue,
  warning,
  required,
  onChange,
  disabled,
  children,
  placeholder,
  validationMessage,
  min,
  max,
}) => {
  const [value, setValue] = useState(
    defaultValue ? formatDate(defaultValue) : ""
  );
  const [showLabel, setShowLabel] = useState(!defaultValue);
  const [invalidChar, setInvalidChar] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const changeHandler = (e) => {
    e.target.setCustomValidity("");
    setInvalidInput(false);
    setValue(e.target.value);
    onChange && onChange(e.target);
  };
  const focus = () => setShowLabel(false);
  const blur = () => !value && setShowLabel(true);
  return (
    <section
      id={dataId}
      className={`input date ${invalidChar ? "invalid" : ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      <label className={`label ${showLabel ? "active" : ""}`}>
        {invalidChar ? (warning ? warning : "অকার্যকর অক্ষর!") : label}
      </label>
      <input
        onInvalid={(e) => {
          e.target.setCustomValidity(" ");
          setInvalidInput(true);
        }}
        min={formatDate(min)}
        max={formatDate(max)}
        value={value}
        required={required}
        type={"date"}
        onChange={changeHandler}
        onFocus={focus}
        onBlur={blur}
        disabled={disabled}
        placeholder={placeholder}
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
  placeholder,
  onChange,
  defaultValue,
  validationMessage,
  id,
  pattern,
  children,
  name,
  autoComplete,
}) => {
  const [showPass, setShowPass] = useState(false);
  const [style, setStyle] = useState({ width: 0 });
  const [passValidation, setPassValidation] = useState(
    <FormattedMessage id="passValidation" defaultMessage="Enter password" />
  );
  function change(target) {
    const strength = chkPass(target.value);
    setStyle({
      width: `${strength}%`,
      background: `hsl(${strength}, 69%, 48%)`,
    });
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
      validationMessage={validationMessage}
      name={name}
      autoComplete={autoComplete}
    >
      {passwordStrength && (
        <span style={style} className="passwordStrength"></span>
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
export const Mobile = ({
  required,
  label,
  dataId,
  defaultValue,
  onChange,
  validationMessage,
}) => {
  const [strict, setStrict] = useState(() =>
    defaultValue[0] === "0" ? /^\+?\d{0,11}$/ : /^\+?\d{0,14}$/
  );
  const [pattern, setPattern] = useState(() =>
    defaultValue[0] === "0" ? "^01\\d{9}$" : "^\\+8801\\d{9}$"
  );
  const [warning, setWarning] = useState(() =>
    defaultValue[0] === "0" ? "01***" : "+8801***"
  );
  return (
    <Input
      required={required}
      label={label}
      dataId={dataId}
      defaultValue={defaultValue || "01"}
      onChange={(target) => {
        if (target.value[0] === "0") {
          setStrict(/^\+?\d{0,11}$/);
          setPattern("^01\\d{9}$");
          setWarning("01***");
          target.value = "+88" + target.value;
        } else if (target.value[0] === "+") {
          setStrict(/^\+?\d{0,14}$/);
          setPattern("^\\+8801\\d{9}$");
          setWarning("+8801***");
        }
        onChange(target);
      }}
      warning={warning}
      strict={strict}
      pattern={pattern}
      validationMessage={validationMessage}
    />
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
        onInvalid={(e) => e.target.setCustomValidity(validationMessage || "")}
      />
      <label>
        {label}
        {children}
      </label>
    </section>
  );
};

export const Submit = ({ disabled, className, label, loading, onClick }) => {
  return (
    <button
      className={`${className} ${loading ? "loading" : ""}`}
      type="submit"
      disabled={loading || disabled}
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
