import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/JamiaForms.min.css";
import {
  Input,
  Textarea,
  Checkbox,
  GetGroupData,
  Combobox,
  MultipleInput,
  topics,
  PasswordInput,
  Submit,
  $,
  SS,
  emptyFieldWarning,
} from "./FormElements";
import { FormattedMessage, FormattedNumber } from "react-intl";

const refInputBook = [
  [
    {
      id: "book",
      type: "text",
      label: <FormattedMessage id="book" defaultMessage="Book" />,
      clone: true,
    },
    {
      id: "part",
      type: "number",
      label: <FormattedMessage id="part" defaultMessage="Part" />,
    },
    {
      id: "page",
      type: "number",
      label: <FormattedMessage id="page" defaultMessage="Page" />,
    },
  ],
];
const refInputSura = [
  [
    {
      id: "sura",
      type: "text",
      label: <FormattedMessage id="sura" defaultMessage="Sura" />,
      clone: true,
    },
    {
      id: "aayat",
      type: "number",
      label: <FormattedMessage id="aayat" defaultMessage="Aayat" />,
    },
  ],
];
const validateMoblie = (str) => !!/\+8801\d{9}/.exec(str);

function JamiaDetail() {
  return (
    <>
      <Input
        defaultValue={SS.get("reg-name")}
        onChange={(target) => SS.set("reg-name", target.value)}
        dataId="name"
        strict={/^[ঀ-৾a-zA-Z\s(),]+$/}
        pattern=".{10,}"
        validationMessage=<FormattedMessage
          id="form.jamiaReg.nameValidation"
          defaultMessage="Enter a name"
        />
        required={true}
        label=<FormattedMessage
          id="form.jamiaReg.name"
          defaultMessage="Jamia's Name (Bangla)"
        />
      />
      <Textarea
        defaultValue={SS.get("reg-add")}
        onChange={(target) => SS.set("reg-add", target.value)}
        dataId="add"
        strict={/^[ঀ-৾a-zA-Z\s(),]+$/}
        min={10}
        warning="বাংলা বা ইংরেজি অক্ষর প্রবেশ করুন"
        validationMessage=<FormattedMessage
          id="form.jamiaReg.addValidation"
          defaultMessage="Enter an address"
        />
        required={true}
        label=<FormattedMessage id="add" defaultMessage="Address" />
        max={200}
      />
      <Input
        defaultValue={SS.get("reg-contact") || "+8801"}
        onChange={(target) => SS.set("reg-contact", target.value)}
        required={true}
        dataId="contact"
        pattern="^\+8801\d{9}$"
        strict={/^\+8801\d{0,9}$/}
        warning="+8801***"
        validationMessage=<FormattedMessage
          id="form.jamiaReg.contactValidation"
          defaultMessage="Enter contact detail"
        />
        label=<FormattedMessage id="contact" defaultMessage="Contact" />
      />
      <Input
        defaultValue={SS.get("reg-primeMufti")}
        onChange={(target) => SS.set("reg-primeMufti", target.value)}
        pattern=".{5,}"
        strict={/^[ঀ-৾a-zA-Z\s(),]+$/}
        validationMessage=<FormattedMessage
          id="form.jamiaReg.primeMuftiValidation"
          defaultMessage="Enter Prime mufti's name"
        />
        dataId="primeMufti"
        required={true}
        label=<FormattedMessage id="primeMufti" defaultMessage="Prime Mufti" />
      />
    </>
  );
}
function LoginDetail({
  idIsValid,
  setValidatingId,
  validatingId,
  setIdIsValid,
}) {
  const [pattern, setPattern] = useState("[a-zA-Z0-9]{8,20}");
  const [idValidationMessage, setIdValidationMessage] = useState(
    <FormattedMessage id="idValidation" defaultMessage="Enter an ID" />
  );
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMatch, setPassMatch] = useState(false);
  const [value, setValue] = useState("");
  const validateId = () => {
    if (SS.get("reg-id").length >= 8 && idIsValid === null) {
      setValidatingId(true);
      fetch(`/api/validateId/${SS.get("reg-id")}`)
        .then((res) => {
          setValidatingId(false);
          if (res.status === 200) {
            setIdIsValid(true);
          } else {
            setIdIsValid(false);
            setPattern(`[^${SS.get("reg-id")}$]`);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  function checkId() {
    validateId();
    $(".reg #id input").addEventListener("blur", validateId);
    return () => setIdIsValid(null);
  }
  useEffect(checkId, []);
  useEffect(() => {
    if (pattern === "[a-zA-Z0-9]{8,20}") {
      if (value.length < 8) {
        setIdValidationMessage(
          <FormattedMessage
            id="idCountValidation"
            defaultMessage="Enter must be between 8 & 20 charecters"
          />
        );
      } else {
        setIdValidationMessage(
          <FormattedMessage id="idValidation" defaultMessage="Enter an ID" />
        );
      }
    } else {
      setIdValidationMessage(
        <FormattedMessage
          id="form.jamiaReg.idTakenValidation"
          defaultMessage="Enter is taken"
        />
      );
    }
  }, [pattern, value]);
  useEffect(() => {
    if (confirmPass) {
      pass === confirmPass ? setPassMatch(true) : setPassMatch(false);
    } else {
      setPassMatch(null);
    }
  }, [pass, confirmPass]);
  return (
    <>
      <Input
        defaultValue={SS.get("reg-id")}
        onChange={(target) => {
          SS.set("reg-id", target.value);
          setIdIsValid(null);
          setValue(target.value);
          setPattern("[a-zA-Z0-9]{8,20}");
        }}
        required={true}
        dataId="id"
        min={8}
        max={20}
        label=<FormattedMessage
          id="form.login.id"
          defaultMessage="Jamia's ID"
        />
        strict={/^[a-zA-Z0-9]+$/}
        pattern={pattern}
        warning="a-z, A-Z, 0-9"
        validationMessage={idValidationMessage}
      >
        {idIsValid === false && (
          <ion-icon name="close-circle-outline"></ion-icon>
        )}
        {validatingId && idIsValid === null && (
          <ion-icon
            title="id is already taken"
            name="reload-outline"
          ></ion-icon>
        )}
        {idIsValid === true && (
          <ion-icon
            title="id is valid"
            name="checkmark-circle-outline"
          ></ion-icon>
        )}
      </Input>
      <PasswordInput
        passwordStrength={true}
        dataId="pass"
        label=<FormattedMessage id="password" defaultMessage="Password" />
        onChange={(target) => {
          setPass(target.value);
          SS.set("reg-pass", target.value);
        }}
        validationMessage={
          pass ? (
            <FormattedMessage
              id="passCountValidaion"
              defaultMessage="Password must be between 8 & 32 characters"
            />
          ) : (
            <FormattedMessage
              id="passValidation"
              defaultMessage="Enter password"
            />
          )
        }
      />
      <PasswordInput
        dataId="confirmPass"
        pattern={`^${pass}$`}
        onChange={(target) => {
          setConfirmPass(target.value);
        }}
        label=<FormattedMessage
          id="form.login.passwordRepeat"
          defaultMessage="Confirm Password"
        />
        validationMessage={
          passMatch === null ? (
            <FormattedMessage
              id="passConfirmValidation"
              defaultMessage="Confirm password"
            />
          ) : (
            <FormattedMessage
              id="passUnmatchValidation"
              defaultMessage="Password did not match"
            />
          )
        }
      >
        {passMatch === true && (
          <span
            style={{ background: "rgb(12, 232, 100)" }}
            className="passwordConfirm"
          />
        )}
        {passMatch === false && (
          <span
            style={{ background: "rgb(245, 7, 0)" }}
            className="passwordConfirm"
          />
        )}
      </PasswordInput>
    </>
  );
}
function ApplicantDetail() {
  return (
    <>
      <Input
        required={true}
        defaultValue={SS.get("reg-applicant")}
        onChange={(target) => SS.set("reg-applicant", target.value)}
        dataId="applicant"
        strict={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
        pattern=".{5,}"
        validationMessage=<FormattedMessage
          id="applNameValidation"
          defaultMessage="Enter applicant's name"
        />
        label=<FormattedMessage
          id="form.jamiaReg.applicant"
          defaultMessage="Applicant's Name"
        />
      />
      <Input
        required={true}
        defaultValue={SS.get("reg-applicantDesignation")}
        pattern=".{5,}"
        onChange={(target) => SS.set("reg-applicantDesignation", target.value)}
        validationMessage=<FormattedMessage
          id="applDesValidation"
          defaultMessage="Enter applicant's designation"
        />
        dataId="applicantDesignation"
        label=<FormattedMessage
          id="form.jamiaReg.applicantDesignation"
          defaultMessage="Applicant's designation in Jamia"
        />
      />
      <Input
        required={true}
        pattern="^\+8801\d{9}$"
        strict={/^\+8801\d{0,9}$/}
        validationMessage=<FormattedMessage
          id="applMobValidation"
          defaultMessage="Enter applicant's mobile"
        />
        defaultValue={SS.get("reg-applicantMobile") || "+8801"}
        onChange={(target) => SS.set("reg-applicantMobile", target.value)}
        dataId="applicantMobile"
        warning="+8801***"
        label=<FormattedMessage
          id="form.jamiaReg.applicantContact"
          defaultMessage="Applicant's Mobile"
        />
      />
      <Checkbox
        required={true}
        checked={true}
        validationMessage="এই বক্সে টিক দিন"
      >
        <FormattedMessage
          id="form.jamiaReg.tcAgreement"
          defaultMessage="I accept all terms & conditions."
          values={{
            link: (
              <a href="/terms&conditions">
                <FormattedMessage
                  id="form.jamiaReg.tnc"
                  defaultMessage="terms & conditions"
                />
              </a>
            ),
          }}
        />
      </Checkbox>
    </>
  );
}
function StepProgress({ step }) {
  return (
    <section className="pageNumber">
      <div className="dots">
        <span className={`current`}></span>
      </div>
      <div className="line">
        <span className={`${step > 1 ? "current" : ""}`}></span>
      </div>
      <div className="dots">
        <span className={`${step > 1 ? "current" : ""}`}></span>
      </div>
      <div className="line">
        <span className={`${step > 2 ? "current" : ""}`}></span>
      </div>
      <div className="dots">
        <span className={`${step > 2 ? "current" : ""}`}></span>
      </div>
    </section>
  );
}

export const JamiaRegister = () => {
  const { locale, user } = useContext(SiteContext);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const history = useHistory();
  function redirect() {
    user && history.push("/");
    return () => setSuccess(false);
  }
  useEffect(redirect, [setSuccess]);
  const [loading, setLoading] = useState(false);
  const [idIsValid, setIdIsValid] = useState(null);
  const [validatingId, setValidatingId] = useState(false);
  function leftButton() {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  }
  function submit(e) {
    e.preventDefault();
    if (validatingId) return;
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      const data = {
        name: SS.get("reg-name"),
        add: SS.get("reg-add"),
        contact: SS.get("reg-contact"),
        primeMufti: SS.get("reg-primeMufti"),
        id: SS.get("reg-id"),
        pass: SS.get("reg-pass"),
        appl: {
          name: SS.get("reg-applicant"),
          des: SS.get("reg-applicantDesignation"),
          mob: SS.get("reg-applicantMobile"),
        },
      };
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
      setLoading(true);
      fetch("/api/source/new", options)
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            SS.remove("reg-name");
            SS.remove("reg-add");
            SS.remove("reg-contact");
            SS.remove("reg-primeMufti");
            SS.remove("reg-id");
            SS.remove("reg-pass");
            SS.remove("reg-applicantDesignation");
            SS.remove("reg-applicant");
            SS.remove("reg-applicantMobile");
            setSuccess(true);
          } else {
            alert("something went wrong");
          }
        })
        .catch((err) => {
          alert("something went wrong");
          console.log(err);
        });
    }
  }
  return !success ? (
    <div className={`main jamiaForms ${locale === "bn-BD" ? "bn-BD" : ""}`}>
      {user && <Redirect to="/" />}
      <form className="reg" onSubmit={submit} autofill="false">
        <h2>
          <FormattedMessage
            id="form.jamiaReg.head"
            defaultMessage="REGISTRATION"
          />
        </h2>
        <StepProgress step={step} />
        {step === 1 && <JamiaDetail />}
        {step === 2 && (
          <LoginDetail
            idIsValid={idIsValid}
            validatingId={validatingId}
            setIdIsValid={setIdIsValid}
            setValidatingId={setValidatingId}
          />
        )}
        {step === 3 && <ApplicantDetail />}
        {(step === 2 || step === 3) && (
          <button type="button" className="left" onClick={leftButton}>
            <FormattedMessage id="form.jamiaReg.back" defaultMessage="Back" />
          </button>
        )}
        <Submit
          className={(step === 1 || step === 2) && "right"}
          label={
            step === 1 || step === 2 ? (
              <FormattedMessage id="next" defaultMessage="Next" />
            ) : (
              <FormattedMessage id="register" defaultMessage="Register" />
            )
          }
          loading={loading}
          setLoading={setLoading}
        />
      </form>
    </div>
  ) : (
    <div className="main jamiaForms success">
      <div className="successPromt">
        <ion-icon name="checkmark-circle-outline"></ion-icon>
        <p>
          Your request has been successfully submitted. You will be notified via
          SMS, when your account is ready to use.
        </p>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export const JamiaLogin = () => {
  const [invalidCred, setInvalidCred] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { user } = useContext(SiteContext);
  const { setUser, setIsAuthenticated, locale } = useContext(SiteContext);
  const [userId, setUserId] = useState("");
  const [pass, setPass] = useState("");
  function submit(e) {
    e.preventDefault();
    setLoading(true);
    fetch(`/api/loginSource`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userId, password: pass, role: "jamia" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setIsAuthenticated(data.isAuthenticated);
          setUser(data.user);
          history.push("/jamia/fatwa");
        } else {
          setInvalidCred(true);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  }
  return (
    <div className={`main jamiaForms ${locale === "bn-BD" ? "bn-BD" : ""}`}>
      {user && <Redirect to="/" />}
      <form
        className={`login ${invalidCred ? "invalidCred" : ""}`}
        onSubmit={submit}
      >
        <h2 data-bn="আমার থেকে একটি বাক্য হলেও পৌঁছে দাও ।">
          - بلغوا عني ولو آية
        </h2>
        <Input
          required={true}
          type="text"
          label=<FormattedMessage
            id="form.login.id"
            defaultMessage="Jamia-ID"
          />
          strict={/^[a-zA-Z0-9]+$/}
          min={8}
          max={20}
          onChange={(target) => {
            setUserId(target.value);
            setInvalidCred(false);
          }}
          validationMessage="আইডি প্রবেশ করুন"
          warning="a-z, A-Z, 0-9"
          id="jamiaLoginId"
        />
        <PasswordInput
          id="jamiaLoginPass"
          dataId="pass"
          onChange={(target) => {
            setPass(target.value);
            setInvalidCred(false);
          }}
          label=<FormattedMessage id="password" defaultMessage="Password" />
        >
          <Link className="forgotPass" to="/passwordRecovery">
            <FormattedMessage
              id="form.login.forgotPass"
              defaultMessage="Forgot password"
            />
            ?
          </Link>
        </PasswordInput>
        <Submit
          disabled={invalidCred}
          loading={loading}
          label={<FormattedMessage id="login" defaultMessage="Login" />}
        />
      </form>
    </div>
  );
};

export const PassRecovery = () => {
  const { locale, user } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const [invalidId, setInvalidId] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [resend, setResend] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [timer, setTimer] = useState(60);
  const [attempts, setAttempts] = useState(0);
  useEffect(() => {
    let interval;
    if (step === 2 || step === 3) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [step]);
  function resetTimer() {
    if (step === 2 && timer <= 0 && !resend) {
      setResend(true);
    }
  }
  useEffect(resetTimer, [timer]);
  function resendCode() {
    setSendingCode(true);
    fetch(`/api/passRecovery`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setSendingCode(false);
        setAttempts(0);
        setWrongCode(false);
        if (data.code === "ok") {
          setTimer(60);
        } else {
          alert("something went wrong");
        }
      })
      .catch((err) => {
        alert("something went wrong");
        console.log(err);
      });
  }
  function submit(e) {
    e.preventDefault();
    setLoading(true);
    if (step === 1) {
      fetch(`/api/passRecovery`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 404) {
            setInvalidId(true);
          } else if (res.status === 200) {
            setStep(2);
            setTimer(60);
          } else if (res.status === 500) {
            alert("something went wrong");
          }
        })
        .catch((err) => {
          alert("something went wrong");
          console.log(err);
        });
    } else if (step === 2) {
      fetch(`/api/varifyPassCode`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, code: code }),
      })
        .then((res) => {
          setLoading(false);
          setAttempts((prev) => prev + 1);
          if (res.status === 401) {
            setWrongCode(true);
          } else if (res.status === 200) {
            setTimer(60);
            setStep(3);
          } else if (res.status === 400) {
            if (attempts === 2) {
              setTimer(0);
            }
          }
        })
        .catch((err) => {
          alert("something went wrong");
          console.log(err);
        });
    } else if (step === 3) {
      fetch("/api/jamiaNewPass", {
        method: "PATCH",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({
          newPass: $("#pass input").value,
          jamia: id,
          code: code,
        }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            setStep("success");
          }
        })
        .catch((err) => {
          alert("something went wrong");
          console.log(err);
        });
    }
  }
  return (
    <div className={`main jamiaForms ${locale === "bn-BD" ? "bn-BD" : ""}`}>
      {user && <Redirect to="/" />}
      <form className={`passRecovery`} onSubmit={submit}>
        <h3>
          <FormattedMessage
            id="form.passRecovery.head"
            defaultMessage="Password Recovery"
          />
        </h3>
        {step === 1 && (
          <>
            <p>
              <FormattedMessage
                id="form.passRecovery.id.dsrc"
                defaultMessage="Enter Jamia's login Id below."
              />
            </p>
            <Input
              required={true}
              id="passRecoveryId"
              dataId="id"
              type="text"
              strict={/^[a-zA-Z0-9]+$/}
              pattern=".{8,20}"
              warning="a-z, A-Z, 0-9"
              onChange={(target) => {
                setId(target.value);
                setInvalidId(false);
              }}
              className={invalidId ? "err" : ""}
              label=<FormattedMessage id="form.login.id" defaultMessage="Id" />
              validationMessage={
                id ? (
                  <FormattedMessage
                    id="idInvalid"
                    defaultMessage="Invalid ID"
                  />
                ) : (
                  <FormattedMessage
                    id="idValidation"
                    defaultMessage="Enter login ID"
                  />
                )
              }
            >
              {invalidId && (
                <span className="errMessage">
                  <FormattedMessage
                    id="passRecovery.invalidId"
                    defaultMessage="ID could not be found"
                  />
                </span>
              )}
            </Input>
          </>
        )}
        {step === 2 && (
          <>
            <p>
              <FormattedMessage
                id="form.passRecovery.code.dsrc"
                defaultMessage="A varification code has been sent to Jamia's applicant's mobile. Enter the code below."
              />
              <br />
              <br />
              <span className="resend">
                <FormattedMessage
                  id="form.passRecovery.code.ps"
                  defaultMessage="didn't get the code"
                />
                ?{" "}
                {timer <= 0 ? (
                  sendingCode ? (
                    <span>
                      <FormattedMessage
                        id="form.passRecovery.code.sending"
                        defaultMessage="Sending"
                      />
                    </span>
                  ) : (
                    <span onClick={resendCode} className="sendAgain">
                      <FormattedMessage
                        id="form.passRecovery.code.resend"
                        defaultMessage="Resend"
                      />
                    </span>
                  )
                ) : (
                  <span>
                    <FormattedMessage
                      id="form.passRecovery.code.wait"
                      defaultMessage="wait {sec}s."
                      values={{ sec: <FormattedNumber value={timer} /> }}
                    />
                  </span>
                )}
              </span>
            </p>
            <Input
              required={true}
              id="passRecoveryVarificationCode"
              dataId="code"
              strict={/^[0-9]+$/}
              warning="0-9"
              min={4}
              max={4}
              onChange={(target) => {
                setCode(target.value);
                setWrongCode(false);
              }}
              className={wrongCode ? "err" : ""}
              label=<FormattedMessage
                id="form.passRecovery.code.input"
                defaultMessage="4 digit code"
              />
            >
              {wrongCode &&
                (attempts > 2 ? (
                  <span className="errMessage">
                    <FormattedMessage
                      id="form.passRecovery.code.manyWrongAttempts"
                      defaultMessage="Many wrong attempts."
                    />{" "}
                    <span className="sendAgain" onClick={resendCode}>
                      <FormattedMessage
                        id="form.passRecovery.code.resendCode"
                        defaultMessage="Resend Code"
                      />
                    </span>
                  </span>
                ) : (
                  <span className="errMessage">
                    <FormattedMessage
                      id="form.passRecovery.code.wrongInput"
                      defaultMessage="Code is wrong. {attempts} attempts left"
                      values={{
                        attempts: <FormattedNumber value={3 - attempts} />,
                      }}
                    />
                  </span>
                ))}
            </Input>
          </>
        )}
        {step === 3 && (
          <>
            {timer > 0 ? (
              <>
                <p>
                  <FormattedMessage
                    id="form.passRecovery.pass.dscr"
                    defaultMessage="Enter your new password below within {sec}s."
                    values={{ sec: <FormattedNumber value={timer} /> }}
                  />
                </p>
                <PasswordInput
                  match=".passRecovery #confirmPass input"
                  passwordStrength={true}
                  dataId="pass"
                  label=<FormattedMessage
                    id="form.passRecovery.pass.input1"
                    defaultValue="New password"
                  />
                />
                <PasswordInput
                  match=".passRecovery #pass input"
                  dataId="confirmPass"
                  label=<FormattedMessage
                    id="form.passRecovery.pass.input2"
                    defaultValue="Confirm password"
                  />
                />
              </>
            ) : (
              <p>
                <FormattedMessage
                  id="form.passRecovery.timeout"
                  defaultValue="Timeout."
                />{" "}
                <Link
                  to="/passwordRecovery"
                  onClick={() => {
                    setStep(1);
                    setTimer(60);
                  }}
                >
                  <FormattedMessage
                    id="form.passRecovery.startOver"
                    defaultValue="Start over"
                  />
                </Link>
              </p>
            )}
          </>
        )}
        {step === "success" && (
          <p>
            <FormattedMessage
              id="form.passRecovery.success"
              values={{
                link: (
                  <a href="/login">
                    <FormattedMessage
                      id="form.passRecovery.redirect"
                      defaultMessage="here"
                    />
                  </a>
                ),
              }}
              defaultMessage="Password has been successfully changed."
            />
          </p>
        )}
        {step !== "success" && (
          <Submit
            disabled={
              loading ||
              (step === 2 && timer <= 0) ||
              (step === 2 && attempts > 2) ||
              (step === 3 && timer <= 0)
            }
            label={
              step === 1 ? (
                <FormattedMessage id="next" defaultMessage="Next" />
              ) : (
                <FormattedMessage id="submit" defaultMessage="Submit" />
              )
            }
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </form>
    </div>
  );
};

export const AdminLogin = () => {
  const [invalidCred, setInvalidCred] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { setUser, setIsAuthenticated, locale, user } = useContext(SiteContext);
  const [userId, setUserId] = useState("");
  const [pass, setPass] = useState("");
  useEffect(() => {
    setInvalidCred(false);
  }, [userId, pass]);
  function submit(e) {
    e.preventDefault();
    setLoading(true);
    fetch(`/api/loginAdmin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userId, password: pass, role: "admin" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setIsAuthenticated(data.isAuthenticated);
          setUser(data.user);
          history.push("/admin/sources");
        } else {
          setInvalidCred(true);
        }
      })
      .catch((err) => {
        alert("something went wrong");
        console.log(err);
      });
  }
  return (
    <div className={`main jamiaForms ${locale === "bn-BD" ? "bn-BD" : ""}`}>
      {user && <Redirect to="/" />}
      <form
        className={`adminLogin ${invalidCred ? "invalidCred" : ""}`}
        onSubmit={submit}
      >
        <h2 data-bn="This part is only for Admins.">Admin</h2>
        <Input
          required={true}
          type="text"
          label=<FormattedMessage id="username" defaultMessage="Username" />
          strict={/^[a-zA-Z0-9]+$/}
          min={8}
          max={20}
          validationMessage=<FormattedMessage
            id="usernameValidation"
            defaultMessage="Enter username"
          />
          onChange={(target) => setUserId(target.value)}
          warning="a-z, A-Z, 0-9"
        />
        <PasswordInput
          dataId="pass"
          onChange={(target) => setPass(target.value)}
          label=<FormattedMessage id="password" defaultMessage="Password" />
          validationMessage={
            pass ? (
              <FormattedMessage
                id="passCountValidaion"
                defaultMessage="Password must be between 8 & 32 charecters"
              />
            ) : (
              <FormattedMessage
                id="passValidation"
                defaultMessage="Enter Password"
              />
            )
          }
        />
        <Submit
          disabled={invalidCred}
          loading={loading}
          label={<FormattedMessage id="login" defaultMessage="Login" />}
        />
      </form>
    </div>
  );
};

export const AddFatwaForm = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { fatwaToEdit, setFatwaToEdit, locale } = useContext(SiteContext);
  const [preFill, setPreFill] = useState(() => {
    if (fatwaToEdit === null) {
      return {
        translate: false,
        topic: "",
        title: {
          "bn-BD": "",
          "en-US": "",
        },
        ques: {
          "bn-BD": "",
          "en-US": "",
        },
        ans: {
          "bn-BD": "",
          "en-US": "",
        },
        img: [],
      };
    } else {
      let inputBooks = [];
      let inputSura = [];
      SS.set("editFatwa-topic", JSON.stringify(fatwaToEdit.topic));
      SS.set("editFatwa-title", fatwaToEdit.title["bn-BD"]);
      SS.set("editFatwa-titleEn", fatwaToEdit.title["en-US"]);
      SS.set("editFatwa-ques", fatwaToEdit.ques["bn-BD"]);
      SS.set("editFatwa-quesEn", fatwaToEdit.ques["en-US"]);
      SS.set("editFatwa-ans", fatwaToEdit.ans["bn-BD"]);
      SS.set("editFatwa-ansEn", fatwaToEdit.ans["en-US"]);
      if (fatwaToEdit.ref.length > 0) {
        fatwaToEdit.ref.forEach((item) => {
          if (item.book) {
            inputBooks.push([
              {
                ...refInputBook[0][0],
                value: item.book,
              },
              {
                ...refInputBook[0][1],
                value: item.part,
              },
              {
                ...refInputBook[0][2],
                value: item.page,
              },
            ]);
          } else {
            inputSura.push([
              {
                ...refInputSura[0][0],
                value: item.sura,
              },
              {
                ...refInputSura[0][1],
                value: item.aayat,
              },
            ]);
          }
        });
        inputBooks.push(...refInputBook);
        inputSura.push(...refInputSura);
      }
      return {
        ...(fatwaToEdit.ref.length > 0 && {
          inputBooks: [...inputBooks],
          inputSura: [...inputSura],
        }),
        ...fatwaToEdit,
      };
    }
  });
  const [sameExists, setSameExists] = useState("");
  function setCleanup() {
    return () => {
      if (fatwaToEdit) {
        setFatwaToEdit(null);
        SS.remove("editFatwa-topic");
        SS.remove("editFatwa-title");
        SS.remove("editFatwa-titleEn");
        SS.remove("editFatwa-ques");
        SS.remove("editFatwa-quesEn");
        SS.remove("editFatwa-ans");
        SS.remove("editFatwa-ansEn");
      }
    };
  }
  useEffect(setCleanup, []);
  function submit(e) {
    e.preventDefault();
    let data, url, options;
    if (fatwaToEdit) {
      data = {
        ...(fatwaToEdit.topic[locale] !==
          JSON.parse(SS.get("editFatwa-topic"))[locale] && {
          topic: JSON.parse(SS.get("editFatwa-topic")),
        }),
        ...(fatwaToEdit.title["bn-BD"] !== SS.get("editFatwa-title") && {
          "title.bn-BD": SS.get("editFatwa-title"),
        }),
        ...(fatwaToEdit.title["en-US"] !== SS.get("editFatwa-titleEn") && {
          "title.en-US": SS.get("editFatwa-titleEn"),
        }),
        ...(fatwaToEdit.ques["bn-BD"] !== SS.get("editFatwa-ques") && {
          "ques.bn-BD": SS.get("editFatwa-ques"),
        }),
        ...(fatwaToEdit.ques["en-US"] !== SS.get("editFatwa-quesEn") && {
          "ques.en-US": SS.get("editFatwa-quesEn"),
        }),
        ...(fatwaToEdit.ans["bn-BD"] !== SS.get("editFatwa-ans") && {
          "ans.bn-BD": SS.get("editFatwa-ans"),
        }),
        ...(fatwaToEdit.ans["en-US"] !== SS.get("editFatwa-ansEn") && {
          "ans.en-US": SS.get("editFatwa-ansEn"),
        }),
        ref: [
          ...GetGroupData($(".addFatwa #books.multipleInput")),
          ...GetGroupData($(".addFatwa #sura.multipleInput")),
        ],
        img: preFill.img,
      };
      url =
        fatwaToEdit.status === "pending"
          ? `/api/source/editSubmission/${match.params.id}`
          : `/api/source/editFatwa/${match.params.id}`;
      options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    } else {
      data = {
        topic: JSON.parse(SS.get("newFatwa-topic")),
        title: {
          "bn-BD": SS.get("newFatwa-title"),
          "en-US": SS.get("newFatwa-titleEn"),
        },
        ques: {
          "bn-BD": SS.get("newFatwa-ques"),
          "en-US": SS.get("newFatwa-quesEn"),
        },
        ans: {
          "bn-BD": SS.get("newFatwa-ans"),
          "en-US": SS.get("newFatwa-ansEn"),
        },
        ref: [
          ...GetGroupData($(".addFatwa #books.multipleInput")),
          ...GetGroupData($(".addFatwa #sura.multipleInput")),
        ],
        img: preFill.img,
      };
      url = `/api/source/newFatwa`;
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    }
    setLoading(true);
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          history.push("/jamia/fatwa/pending");
          SS.remove("newFatwa-ansEn");
          SS.remove("newFatwa-topic");
          SS.remove("newFatwa-ques");
          SS.remove("newFatwa-quesEn");
          SS.remove("newFatwa-title");
          SS.remove("newFatwa-titleEn");
          SS.remove("newFatwa-ans");
        } else if (data.code === 11000) {
          setSameExists(data.field);
        } else {
          throw data.code;
        }
      })
      .catch((err) => {
        alert("something went wrong");
        console.log(err);
      });
  }
  return (
    <form
      className={`addFatwa ${preFill.translate ? "translate" : ""}`}
      onSubmit={submit}
    >
      {match.params.id && !fatwaToEdit && (
        <Redirect to="/jamia/fatwa/submissions" />
      )}
      <Combobox
        required={true}
        dataId="topic"
        defaultValue={
          preFill.topic ||
          (SS.get("newFatwa-topic") && JSON.parse(SS.get("newFatwa-topic")))
        }
        onChange={(target) => {
          SS.set("newFatwa-topic", JSON.stringify(target.value));
          fatwaToEdit &&
            SS.set("editFatwa-topic", JSON.stringify(target.value));
        }}
        maxHeight="15rem"
        label=<FormattedMessage id="topic" defaultMessage="Topic" />
        validationMessage="বিষয়বস্তু নির্বাচন করুন"
        options={topics.map((topic) => {
          return {
            label: topic[locale],
            value: topic,
          };
        })}
      />
      <Checkbox
        label=<ion-icon name="language-outline"></ion-icon>
        defaultValue={preFill.translate}
        onChange={(target) =>
          setPreFill((prev) => {
            const newPrefill = { ...prev };
            newPrefill.translate = target.checked;
            return newPrefill;
          })
        }
      />
      <Input
        required={true}
        defaultValue={preFill.title["bn-BD"] || SS.get("newFatwa-title")}
        dataId="title"
        min={10}
        validationMessage="ফতোয়ার শিরোণাম প্রবেশ করুন"
        label=<FormattedMessage id="title" defaultMessage="Title" />
        max={200}
        className={sameExists === "title.bn-BD" ? "err" : ""}
        onChange={(target) => {
          SS.set("newFatwa-title", target.value);
          setSameExists("");
          fatwaToEdit && SS.set("editFatwa-title", target.value);
        }}
      >
        {sameExists === "title.bn-BD" && (
          <span className="errMessage">This title already exists!</span>
        )}
      </Input>
      {preFill.translate && (
        <Input
          min={10}
          required={true}
          validationMessage="ফতোয়ার শিরোণাম প্রবেশ করুন"
          defaultValue={preFill.title["en-US"] || SS.get("newFatwa-titleEn")}
          dataId="titleEn"
          label="Title in English"
          className={sameExists === "title.en-US" ? "err" : ""}
          max={200}
          onChange={(target) => {
            SS.set("newFatwa-titleEn", target.value);
            fatwaToEdit && SS.set("editFatwa-titleEn", target.value);
          }}
        >
          {sameExists === "title.en-US" && (
            <span className="errMessage">This title already exists!</span>
          )}
        </Input>
      )}
      <Textarea
        min="20"
        required={true}
        validationMessage="প্রশ্ন প্রবেশ করুন"
        defaultValue={preFill.ques["bn-BD"] || SS.get("newFatwa-ques")}
        onChange={(target) => {
          SS.set("newFatwa-ques", target.value);
          fatwaToEdit && SS.set("editFatwa-ques", target.value);
        }}
        dataId="ques"
        label=<FormattedMessage id="question" defaultMessage="Question" />
      />
      {preFill.translate && (
        <Textarea
          min="20"
          required={true}
          validationMessage="প্রশ্ন প্রবেশ করুন"
          defaultValue={preFill.ques["en-US"] || SS.get("newFatwa-quesEn")}
          onChange={(target) => {
            SS.set("newFatwa-quesEn", target.value);
            fatwaToEdit && SS.set("editFatwa-quesEn", target.value);
          }}
          dataId="quesEn"
          label="Question in English"
        />
      )}
      <Textarea
        min="20"
        required={true}
        validationMessage="উত্তর প্রবেশ করুন"
        defaultValue={preFill.ans["bn-BD"] || SS.get("newFatwa-ans")}
        onChange={(target) => {
          SS.set("newFatwa-ans", target.value);
          fatwaToEdit && SS.set("editFatwa-ans", target.value);
          setSameExists(false);
        }}
        dataId="ans"
        className={sameExists === "ans.bn-BD" ? "err" : ""}
        label=<FormattedMessage id="answer" defaultMessage="Answer" />
      >
        {sameExists === "ans.bn-BD" && (
          <span className="errMessage">this fatwa already exists</span>
        )}
      </Textarea>
      {preFill.translate && (
        <Textarea
          min="20"
          required={true}
          validationMessage="উত্তর প্রবেশ করুন"
          defaultValue={preFill.ans["en-US"] || SS.get("newFatwa-ansEn")}
          className={sameExists === "ans.en-US" ? "err" : ""}
          onChange={(target) => {
            SS.set("newFatwa-ansEn", target.value);
            fatwaToEdit && SS.set("editFatwa-ansEn", target.value);
          }}
          dataId="ansEn"
          label="Answer in Enlish"
        >
          {sameExists === "ans.en-US" && (
            <span className="errMessage">this fatwa already exists</span>
          )}
        </Textarea>
      )}
      <MultipleInput
        id="books"
        inputs={preFill.inputBooks || refInputBook}
        refInput={refInputBook}
      />
      <MultipleInput
        id="sura"
        inputs={preFill.inputSura || refInputSura}
        refInput={refInputSura}
      />
      <Submit
        label=<FormattedMessage id="submit" defaultMessage="Submit" />
        loading={loading}
        setLoading={setLoading}
      />
    </form>
  );
};
export const UserQuestionAnswerForm = ({ ques, setQues, _id }) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { locale } = useContext(SiteContext);
  const [sameExists, setSameExists] = useState("");
  const [preFill] = useState(() => {
    if (SS.get("ansFatwa-ref")) {
      let inputBooks = [];
      let inputSura = [];
      JSON.parse(SS.get("ansFatwa-ref")).forEach((item) => {
        if (item.book) {
          inputBooks.push([
            {
              ...refInputBook[0][0],
              value: item.book,
            },
            {
              ...refInputBook[0][1],
              value: item.part,
            },
            {
              ...refInputBook[0][2],
              value: item.page,
            },
          ]);
        } else {
          inputSura.push([
            {
              ...refInputSura[0][0],
              value: item.sura,
            },
            {
              ...refInputSura[0][1],
              value: item.aayat,
            },
          ]);
        }
      });
      inputBooks.push(...refInputBook);
      inputSura.push(...refInputSura);
      return { inputBooks: [...inputBooks], inputSura: [...inputSura] };
    } else {
      return { inputBooks: refInputBook, inputSura: refInputSura };
    }
  });
  function submit(e) {
    e.preventDefault();
    const data = {
      topic: SS.get("ansFatwa-topic")
        ? JSON.parse(SS.get("ansFatwa-topic"))
        : ques.topic,
      title: SS.get("ansFatwa-title"),
      body: SS.get("ansFatwa-ans"),
      ref: [
        ...GetGroupData($(".addFatwa #books.multipleInput")),
        ...GetGroupData($(".addFatwa #sura.multipleInput")),
      ],
    };
    const url = `/api/source/userQues/answer/${_id}`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    setLoading(true);
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          SS.remove("ansFatwa-title");
          SS.remove("ansFatwa-ans");
          SS.remove("ansFatwa-ref");
          setQues(data.content);
          history.goBack();
        } else if (data.code === 11000) {
          setSameExists(data.field);
        }
      })
      .catch((err) => {
        alert("something went wrong");
        console.log("this");
      });
  }
  return (
    <form className={`addFatwa`} onSubmit={submit}>
      <Combobox
        dataId="topic"
        defaultValue={ques.topic}
        onChange={(target) => {
          SS.set("ansFatwa-topic", JSON.stringify(target.value));
        }}
        maxHeight="15rem"
        label=<FormattedMessage id="topic" defaultMessage="Topic" />
        options={topics.map((topic) => {
          return { label: topic[locale], value: topic };
        })}
      />
      <Input
        autoFocus={true}
        defaultValue={SS.get("ansFatwa-title")}
        dataId="title"
        label=<FormattedMessage id="title" defaultMessage="Title" />
        max={200}
        className={sameExists === "title.bn-BD" ? "err" : ""}
        onChange={(target) => {
          SS.set("ansFatwa-title", target.value);
          setSameExists("");
        }}
        required={true}
        validationMessage="শিরোণাম প্রবেশ করুন"
      >
        {sameExists === "title.bn-BD" && (
          <span className="errMessage">This title already exists!</span>
        )}
      </Input>
      <Textarea
        disabled={true}
        defaultValue={ques.body}
        onChange={(target) => SS.set("ansFatwa-ques", target.value)}
        dataId="ques"
        label=<FormattedMessage id="question" defaultMessage="Question" />
      />
      <Textarea
        defaultValue={SS.get("ansFatwa-ans")}
        onChange={(target) => {
          SS.set("ansFatwa-ans", target.value);
          setSameExists(false);
        }}
        dataId="ans"
        className={sameExists === "ans.bn-BD" ? "err" : ""}
        label=<FormattedMessage id="answer" defaultMessage="Answer" />
        required={true}
        min={10}
        validationMessage="উত্তর প্রবেশ করুন"
      >
        {sameExists === "ans.bn-BD" && (
          <span className="errMessage">this fatwa already exists</span>
        )}
      </Textarea>
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
      <Submit
        label=<FormattedMessage id="submit" defaultMessage="Submit" />
        loading={loading}
        setLoading={setLoading}
      />
      <section className="bottomPadding" />
    </form>
  );
};
export const UserQuestionReportForm = ({ _id }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sub, setSub] = useState("");
  const [msg, setMsg] = useState("");
  const history = useHistory();
  function submit(e) {
    e.preventDefault();
    setLoading(true);
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ subject: sub, message: msg }),
    };
    fetch(`/api/source/reportUserQues/${_id}`, options)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setSuccess(true);
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
  function redirect() {
    success && history.goBack();
  }
  useEffect(redirect, [success]);
  return (
    <form className="reportUserQues" onSubmit={submit}>
      <h2>Report</h2>
      <Input
        label="Subject"
        min={5}
        onChange={(target) => setSub(target.value)}
        validationMessage="enter the subject of this report"
        required={true}
      />
      <Textarea
        label="Message"
        defaultValue={""}
        onChange={(target) => setMsg(target.value)}
        min={10}
        max={300}
        validationMessage="describe your issue with this question"
        required={true}
      />
      <Submit
        label=<FormattedMessage id="submit" defaultMessage="Submit" />
        loading={loading}
        setLoading={setLoading}
      />
    </form>
  );
};

export const DataEditForm = ({
  Element,
  defaultValue,
  validation,
  max,
  tel,
  api,
  fieldCode,
}) => {
  const form = useRef();
  const [edit, setEdit] = useState(false);
  const [newValue, setNewValue] = useState(defaultValue);
  function cancel() {
    if (newValue !== defaultValue) {
      if (window.confirm("Discard Changes?")) {
        setNewValue(defaultValue);
        setEdit(false);
      }
    } else {
      setEdit(false);
    }
  }
  function save(e) {
    e.preventDefault();
    if (newValue === defaultValue) {
      setEdit(false);
      // form.current.querySelector("input").blur();
    } else {
      fetch(api, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [fieldCode]: newValue }),
      })
        .then((res) => {
          if (res.status === 200) {
            (
              form.current.querySelector("input") ||
              form.current.querySelector("textarea")
            ).blur();
            setEdit(false);
          } else {
            alert("Something went wrong!");
          }
        })
        .catch((err) => console.log(err));
    }
  }
  return (
    <form ref={form} className={edit ? "edit" : ""} onSubmit={save}>
      {tel && !edit && (
        <a href={`tel:${newValue}`}>{newValue.replace("+88", "")}</a>
      )}
      {(!tel || (tel && edit)) && (
        <Element
          required={true}
          type="text"
          defaultValue={newValue}
          pattern={validation}
          max={max}
          onChange={(target) => setNewValue(target.value)}
        />
      )}
      {!edit && (
        <ion-icon
          onClick={() => setEdit(true)}
          name="create-outline"
        ></ion-icon>
      )}
      {edit && (
        <>
          <button type="submit">
            <ion-icon name="save-outline"></ion-icon>
          </button>
          <button type="button" onClick={cancel}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </>
      )}
    </form>
  );
};
export const PasswordEditForm = ({ api }) => {
  const form = useRef();
  const [edit, setEdit] = useState(false);
  const [pass, setPass] = useState({ oldPass: "", newPass: "", confirm: "" });
  function setPassword(pass, value) {
    setPass((prev) => {
      const newSet = { ...prev };
      newSet[pass] = value;
      return newSet;
    });
  }
  function save(e) {
    e.preventDefault();
    if (pass.newPass === pass.confirm) {
      fetch(api, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pass),
      })
        .then((res) => {
          if (res.status === 200) {
            setEdit(false);
            form.current.querySelector("input").blur();
          } else {
            alert("Something went wrong!");
          }
          return res.json();
        })
        .then((data) => console.log(data));
    } else {
      alert("password did not match");
    }
  }
  return (
    <form
      ref={form}
      className={`password ${edit ? "edit" : ""}`}
      onSubmit={save}
    >
      {!edit ? (
        <Input type="text" defaultValue="••••••••" />
      ) : (
        <section>
          <PasswordInput
            placeholder="Old password"
            match=".reg #confirmPass input"
            dataId="oldPass"
            onChange={(target) => setPassword("oldPass", target.value)}
          />
          <PasswordInput
            placeholder="New password"
            match=".data #confirmPass input"
            passwordStrength={true}
            dataId="pass"
            onChange={(target) => setPassword("newPass", target.value)}
          />
          <PasswordInput
            placeholder="Confirm password"
            match=".data #pass input"
            dataId="confirmPass"
            onChange={(target) => setPassword("confirm", target.value)}
          />
        </section>
      )}
      {!edit && (
        <ion-icon
          onClick={() => setEdit(true)}
          name="create-outline"
        ></ion-icon>
      )}
      {edit && (
        <>
          <button type="submit">
            <ion-icon name="save-outline"></ion-icon>
          </button>
          <button type="button" onClick={() => setEdit(false)}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </>
      )}
    </form>
  );
};

export const Report = ({ fatwa, close }) => {
  const [loading, setLoading] = useState(false);
  function submit(e) {
    e.preventDefault();
    if (SS.get("reportFatwa-name").length < 3) {
      emptyFieldWarning("#name", "input", "Enter a valid name");
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.exec(SS.get("reportFatwa-email"))) {
      emptyFieldWarning("#email", "input", "Enter a valid email");
      return;
    }
    if (!validateMoblie(SS.get("reportFatwa-mobile"))) {
      emptyFieldWarning(
        "#mobile",
        "input",
        "Enter a valid mobile number. +8801***"
      );
      return;
    }
    if (SS.get("reportFatwa-subject").length < 5) {
      emptyFieldWarning("#subject", "input", "Enter a subject.");
      return;
    }
    if (SS.get("reportFatwa-message").length < 10) {
      emptyFieldWarning("#message", "textarea", "Enter a message.");
      return;
    }
    setLoading(true);
    fetch("/api/reportFatwa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fatwa: fatwa._id,
        jamia: fatwa.jamia.id,
        user: {
          name: SS.get("reportFatwa-name"),
          email: SS.get("reportFatwa-email"),
          mobile: SS.get("reportFatwa-mobile"),
        },
        message: {
          subject: SS.get("reportFatwa-subject"),
          body: SS.get("reportFatwa-message"),
        },
      }),
    }).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        close(false);
        SS.remove("reportFatwa-name");
        SS.remove("reportFatwa-email");
        SS.remove("reportFatwa-mobile");
        SS.remove("reportFatwa-subject");
        SS.remove("reportFatwa-message");
      } else {
        alert("something went wrong");
      }
    });
  }
  return (
    <div className="userReportContainer">
      <ion-icon
        onClick={() => close(false)}
        class="close"
        name="close-outline"
      ></ion-icon>
      <form onSubmit={submit} className="userReport">
        <section className="head">
          <h2>User Report</h2>
          <p className="ps">
            * Your message be will be sent to the Jamia or the Mufti who
            submitted this fatwa.
          </p>
        </section>
        <Input
          label="Full name"
          dataId="name"
          pattern={/^[ঀ-৾a-zA-Z\s(),]+$/}
          defaultValue={SS.get("reportFatwa-name")}
          onChange={(target) => {
            SS.set("reportFatwa-name", target.value);
          }}
          type="text"
        />
        <Input
          label="Email"
          dataId="email"
          type="text"
          defaultValue={SS.get("reportFatwa-email")}
          pattern={/^[a-zA-Z0-9.-_@]+$/}
          onChange={(target) => {
            SS.set("reportFatwa-email", target.value);
          }}
        />
        <Input
          label="Mobile"
          dataId="mobile"
          defaultValue={SS.get("reportFatwa-mobile") || "+8801"}
          onChange={(target) => {
            SS.set("reportFatwa-mobile", target.value);
          }}
          type="text"
          warning="+8801..."
          pattern={/^\+\d{0,13}$/}
        />
        <Input
          label="Subject"
          dataId="subject"
          defaultValue={SS.get("reportFatwa-subject")}
          onChange={(target) => {
            SS.set("reportFatwa-subject", target.value);
          }}
        />
        <Textarea
          label="Message"
          dataId="message"
          defaultValue={SS.get("reportFatwa-message")}
          onChange={(target) => {
            SS.set("reportFatwa-message", target.value);
          }}
        />
        <Submit loading={loading} label="Submit" />
        <section className="bottomPadding" />
      </form>
    </div>
  );
};
