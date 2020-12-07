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
} from "./FormElements";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { Toast } from "./Modals";

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
const getLan = (sentence) => {
  const str = sentence.replace(/\s/g, "");
  if ((str.match(/[a-z0-9]/gi) || []).length / str.length > 0.9) {
    return "en-US";
  } else {
    return "bn-BD";
  }
};
function emptyFeildWarning(selector, inputType, warning) {
  const emptyFeildWarning = document.createElement("p");
  emptyFeildWarning.classList.add("emptyFeildWarning");
  emptyFeildWarning.textContent = warning;
  if ($(`${selector} .emptyFeildWarning`) === null) {
    $(`${selector}`).appendChild(emptyFeildWarning);
  }
  $(`${selector} ${inputType}`).focus();
}

function JamiaDetail() {
  return (
    <>
      <Input
        defaultValue={SS.get("reg-name")}
        onChange={(target) => {
          SS.set("reg-name", target.value);
        }}
        dataId="name"
        required={true}
        type="text"
        pattern={/^[ঀ-৾a-zA-Z\s(),]+$/}
        warning="Bangla"
        label=<FormattedMessage
          id="form.jamiaReg.name"
          defaultMessage="Jamia's Name (Bangla)"
        />
      />
      <Textarea
        defaultValue={SS.get("reg-add")}
        onChange={(target) => {
          SS.set("reg-add", target.value);
        }}
        dataId="add"
        required={true}
        label=<FormattedMessage
          id="form.jamiaReg.add"
          defaultMessage="Address"
        />
        max={200}
      />
      <Input
        defaultValue={SS.get("reg-contact") || "+8801"}
        onChange={(target) => {
          SS.set("reg-contact", target.value);
        }}
        required={true}
        dataId="contact"
        type="text"
        pattern={/^\+\d{0,13}$/}
        warning="+8801***"
        max={14}
        min={14}
        label=<FormattedMessage
          id="form.jamiaReg.contact"
          defaultMessage="Contact"
        />
      />
      <Input
        defaultValue={SS.get("reg-primeMufti")}
        onChange={(target) => {
          SS.set("reg-primeMufti", target.value);
        }}
        dataId="primeMufti"
        required={true}
        label=<FormattedMessage
          id="form.jamiaReg.primeMufti"
          defaultMessage="Prime Mufti"
        />
      />
    </>
  );
}
function LoginDetail({ idIsValid, validatingId, setIdIsValid }) {
  return (
    <>
      <Input
        defaultValue={SS.get("reg-id")}
        onChange={(target) => {
          SS.set("reg-id", target.value);
          $("#id .emptyFeildWarning") && $("#id .emptyFeildWarning").remove();
          setIdIsValid(null);
        }}
        required={true}
        dataId="id"
        type="text"
        min={8}
        max={20}
        label=<FormattedMessage
          id="form.login.id"
          defaultMessage="Jamia's ID"
        />
        pattern={/^[a-zA-Z0-9]+$/}
        warning="a-z, A-Z, 0-9"
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
        match=".reg #confirmPass input"
        passwordStrength={true}
        dataId="pass"
        label=<FormattedMessage
          id="form.login.password"
          defaultMessage="Password"
        />
        onChange={(target) => {
          SS.set("reg-pass", target.value);
          $("#pass .emptyFeildWarning") &&
            $("#pass .emptyFeildWarning").remove();
        }}
      />
      <PasswordInput
        match=".reg #pass input"
        dataId="confirmPass"
        onChange={() => {
          $("#confirmPass .emptyFeildWarning") &&
            $("#confirmPass .emptyFeildWarning").remove();
        }}
        label=<FormattedMessage
          id="form.login.passwordRepeat"
          defaultMessage="Confirm Password"
        />
      />
    </>
  );
}
function ApplicantDetail() {
  return (
    <>
      <Input
        defaultValue={SS.get("reg-applicant")}
        onChange={(target) => {
          SS.set("reg-applicant", target.value);
          $("#applicant .emptyFeildWarning") &&
            $("#applicant .emptyFeildWarning").remove();
        }}
        dataId="applicant"
        type="text"
        pattern={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
        label=<FormattedMessage
          id="form.jamiaReg.applicant"
          defaultMessage="Applicant's Name"
        />
      />
      <Input
        defaultValue={SS.get("reg-applicantDesignation")}
        onChange={(target) => {
          SS.set("reg-applicantDesignation", target.value);
          $("#applicantDesignation .emptyFeildWarning") &&
            $("#applicantDesignation .emptyFeildWarning").remove();
        }}
        dataId="applicantDesignation"
        type="text"
        label=<FormattedMessage
          id="form.jamiaReg.applicantDesignation"
          defaultMessage="Applicant's designation in Jamia"
        />
      />
      <Input
        defaultValue={SS.get("reg-applicantMobile") || "+8801"}
        onChange={(target) => {
          SS.set("reg-applicantMobile", target.value);
          $("#applicantMobile .emptyFeildWarning") &&
            $("#applicantMobile .emptyFeildWarning").remove();
        }}
        dataId="applicantMobile"
        type="text"
        pattern={/^\+\d{0,13}$/}
        warning="+8801***"
        label=<FormattedMessage
          id="form.jamiaReg.applicantContact"
          defaultMessage="Applicant's Mobile"
        />
      />
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
  useEffect(() => {
    user && history.push("/");
    return () => {
      setSuccess(false);
    };
  }, []);
  const [loading, setLoading] = useState(false);
  const [idIsValid, setIdIsValid] = useState(null);
  const [validatingId, setValidatingId] = useState(false);
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
          }
        })
        .catch((err) => console.log(err));
    }
  };
  function leftButton() {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  }
  function rightButton() {
    if (step === 1) {
      if (SS.get("reg-name").length < 5) {
        emptyFeildWarning("#name", "input", "Enter a valid jamia");
        return;
      }
      if (SS.get("reg-add").length < 10) {
        emptyFeildWarning("#add", "textarea", "Enter a valid address");
        return;
      }
      if (!validateMoblie(SS.get("reg-contact"))) {
        emptyFeildWarning(
          "#contact",
          "input",
          "Enter a valid mobile number. +8801***"
        );
        return;
      }
      if (SS.get("reg-primeMufti").length < 4) {
        emptyFeildWarning("#primeMufti", "input", "Enter a valid name");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (SS.get("reg-id").length < 8) {
        emptyFeildWarning("#id", "input", "Enter a valid id");
        return;
      }
      if ($(".reg #pass input").value.length < 7) {
        emptyFeildWarning("#pass", "input", "Enter a password");
        return;
      }
      if ($(".reg #confirmPass input").value.length < 7) {
        emptyFeildWarning("#confirmPass", "input", "confirm password");
        return;
      }
      if ($(".reg #pass input").value !== $(".reg #confirmPass input").value) {
        emptyFeildWarning("#confirmPass", "input", "Password did not match");
        return;
      }
      if (!idIsValid) {
        emptyFeildWarning("#id", "input", "id is already taken");
        return;
      }
      setStep(3);
    }
  }
  useEffect(() => {
    if (step !== 2) return;
    validateId();
    $(".reg #id input").addEventListener("blur", validateId);
  }, [step]);
  function submit(e) {
    e.preventDefault();
    if (SS.get("reg-applicant").length < 5) {
      emptyFeildWarning("#applicant", "input", "Add a valid name");
      return;
    }
    if (SS.get("reg-applicantDesignation").length < 5) {
      emptyFeildWarning("#applicantDesignation", "input", "Add a valid title.");
      return;
    }
    if (!validateMoblie(SS.get("reg-applicantMobile"))) {
      emptyFeildWarning(
        "#applicantMobile",
        "input",
        "Enter a valid mobile number. +8801***"
      );
      return;
    }
    const data = {
      name: { [getLan(SS.get("reg-name"))]: SS.get("reg-name") },
      add: SS.get("reg-add"),
      contact: SS.get("reg-contact"),
      primeMufti: {
        [getLan(SS.get("reg-primeMufti"))]: SS.get("reg-primeMufti"),
      },
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
          />
        )}
        {step === 3 && <ApplicantDetail />}
        {step === 3 && (
          <Checkbox required={true}>
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
        )}
        {(step === 2 || step === 3) && (
          <button type="button" className="left" onClick={leftButton}>
            back
          </button>
        )}
        {(step === 1 || step === 2) && (
          <button type="button" className="right" onClick={rightButton}>
            next
          </button>
        )}
        {step === 3 && (
          <Submit
            label=<FormattedMessage
              id="form.jamiaReg.submit"
              defaultMessage="Register"
            />
            loading={loading}
            setLoading={setLoading}
          />
        )}
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
    fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userId, password: pass, role: "jamia" }),
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 401) {
          setInvalidCred(true);
        }
        return res.json();
      })
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
        history.push("/source/fatwa");
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
          pattern={/^[a-zA-Z0-9]+$/}
          onChange={(target) => {
            setUserId(target.value);
            setInvalidCred(false);
          }}
          warning="a-z, A-Z, 0-9"
          id="jamiaLoginId"
        >
          {invalidCred && <p className="warning">Wrong Id or password</p>}
        </Input>
        <PasswordInput
          id="jamiaLoginPass"
          dataId="pass"
          onChange={(target) => {
            setPass(target.value);
            setInvalidCred(false);
          }}
          label=<FormattedMessage
            id="form.login.password"
            defaultMessage="Password"
          />
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
          loading={loading}
          label={
            <FormattedMessage id="form.login.submit" defaultMessage="Login" />
          }
        />
      </form>
    </div>
  );
};

export const PassRecovery = () => {
  const { locale, user } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const [noJamia, setNoJamia] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [resend, setResend] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [timer, setTimer] = useState(60);
  const [attempts, setAttempts] = useState(0);

  let interval;
  useEffect(() => {
    if (step === 2 || step === 3) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [step]);
  useEffect(() => {
    if (step === 2 && timer <= 0 && !resend) {
      setResend(true);
    }
  }, [timer]);
  function resendCode() {
    setSendingCode(true);
    fetch(`/api/passRecovery`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        setLoading(false);
        setSendingCode(false);
        setAttempts(0);
        setWrongCode(false);
        if (res.status === 200) {
          setTimer(60);
        } else {
          throw "something went worng";
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
            setNoJamia(true);
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
              pattern={/^[a-zA-Z0-9]+$/}
              warning="a-z, A-Z, 0-9"
              onChange={(target) => {
                setId(target.value);
                setNoJamia(false);
              }}
              className={noJamia ? "err" : ""}
              label=<FormattedMessage id="form.login.id" defaultMessage="Id" />
            >
              {noJamia && (
                <span className="errMessage">
                  <FormattedMessage
                    id="form.passRecovery.noJamia"
                    defaultMessage="Jamia doesn't exists"
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
              type="text"
              pattern={/^[0-9]+$/}
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
          <button
            type="submit"
            disabled={
              loading ||
              (step === 2 && timer <= 0) ||
              (step === 2 && attempts > 2) ||
              (step === 3 && timer <= 0)
            }
          >
            <FormattedMessage id="form.submit" defaultMessage="Submit" />
            {loading && <span className="loading"></span>}
          </button>
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
    fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userId, password: pass, role: "admin" }),
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 401) {
          setInvalidCred(true);
          throw 401;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
        history.push("/admin/sources");
      })
      .catch((err) => {
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
          label=<FormattedMessage
            id="form.admin.login.id"
            defaultMessage="Username"
          />
          pattern={/^[a-zA-Z0-9]+$/}
          onChange={(target) => setUserId(target.value)}
          warning="a-z, A-Z, 0-9"
        >
          {invalidCred && <p className="warning">Wrong Id or password</p>}
        </Input>
        <PasswordInput
          dataId="pass"
          onChange={(target) => setPass(target.value)}
          label=<FormattedMessage
            id="form.login.password"
            defaultMessage="Password"
          />
        />
        <Submit
          loading={loading}
          label={
            <FormattedMessage id="form.login.submit" defaultMessage="Login" />
          }
        />
      </form>
    </div>
  );
};

export const AddFatwaForm = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { user, fatwaToEdit, setFatwaToEdit, locale } = useContext(SiteContext);
  const [preFill, setPreFill] = useState(() => {
    if (fatwaToEdit === null) {
      return {
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
      };
    } else {
      SS.set("newFatwa-topic", JSON.stringify(fatwaToEdit.topic));
      SS.set("newFatwa-title", fatwaToEdit.title["bn-BD"]);
      SS.set("newFatwa-ques", fatwaToEdit.ques["bn-BD"]);
      SS.set("newFatwa-ans", fatwaToEdit.ans["bn-BD"]);
      let inputBooks = [];
      let inputSura = [];
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
        translate:
          fatwaToEdit.translation === "google translate" ? false : true,
        topic: fatwaToEdit.topic,
        title: fatwaToEdit.title["bn-BD"],
        titleEn: fatwaToEdit.title["en-US"],
        ques: fatwaToEdit.ques["bn-BD"],
        quesEn: fatwaToEdit.ques["en-US"],
        ans: fatwaToEdit.ans["bn-BD"],
        ansEn: fatwaToEdit.ans["en-US"],
        ref: fatwaToEdit.ref,
        img: fatwaToEdit.img,
      };
    }
  });
  const [sameExists, setSameExists] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!SS.get("newFatwa-topic")) {
      emptyFeildWarning(".combobox#topic", "input", "Select a topic");
      return;
    }
    if (SS.get("newFatwa-title").length < 15) {
      emptyFeildWarning(".input#title", "input", "Add a valid title");
      return;
    }
    if (SS.get("newFatwa-ques").length < 15) {
      emptyFeildWarning(".input#ques", "textarea", "Add a valid question");
      return;
    }
    if (SS.get("newFatwa-ans").length < 15) {
      emptyFeildWarning(".input#ans", "textarea", "Add a valid ans");
      return;
    }
    const data = {
      topic: JSON.parse(SS.get("newFatwa-topic")),
      title: SS.get("newFatwa-title"),
      ...(preFill.translate && {
        titleEn: SS.get("newFatwa-titleEn"),
      }),
      ques: SS.get("newFatwa-ques"),
      ...(preFill.translate && {
        quesEn: SS.get("newFatwa-quesEn"),
      }),
      ans: SS.get("newFatwa-ans"),
      ...(preFill.translate && { ansEn: SS.get("newFatwa-ansEn") }),
      ref: [
        ...GetGroupData($(".addFatwa #books.multipleInput")),
        ...GetGroupData($(".addFatwa #sura.multipleInput")),
      ],
      translation:
        (SS.get("newFatwa-ansEn") && SS.get("newFatwa-quesEn")) || false,
      img: preFill.img,
      source: user._id,
    };
    const url = !match.params.id
      ? `/api/${user.role === "jamia" ? "source" : "admin"}/fatwa/new`
      : `/api/${user.role === "jamia" ? "jamia" : "admin"}/fatwa/edit/${
          match.params.id
        }`;
    const options = {
      method: match.params.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    setLoading(true);
    fetch(url, options)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          history.push("/jamia/fatwa/submissions");
          SS.remove("newFatwa-ansEn");
          SS.remove("newFatwa-topic");
          SS.remove("newFatwa-ques");
          SS.remove("newFatwa-quesEn");
          SS.remove("newFatwa-title");
          SS.remove("newFatwa-titleEn");
          SS.remove("newFatwa-ans");
          setFatwaToEdit(null);
          return;
        } else if (res.status === 400) {
          return res.json();
        } else {
          alert("something went wrong!");
        }
      })
      .then((data) => {
        if (data && data.code === 11000) {
          setSameExists(data.field);
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
      <Combobox
        dataId="topic"
        defaultValue={
          preFill.topic ||
          (SS.get("newFatwa-topic") && JSON.parse(SS.get("newFatwa-topic")))
        }
        onChange={(target) => {
          SS.set("newFatwa-topic", JSON.stringify(target.value));
        }}
        maxHeight="15rem"
        label=<FormattedMessage id="topic" defaultMessage="Topic" />
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
        defaultValue={preFill.title || SS.get("newFatwa-title")}
        dataId="title"
        label=<FormattedMessage id="title" defaultMessage="Title" />
        max={200}
        className={sameExists === "title.bn-BD" ? "err" : ""}
        onChange={(target) => {
          SS.set("newFatwa-title", target.value);
          setSameExists("");
        }}
      >
        {sameExists === "title.bn-BD" && (
          <span className="errMessage">This title already exists!</span>
        )}
      </Input>
      {preFill.translate && (
        <Input
          defaultValue={preFill.titleEn || SS.get("newFatwa-titleEn")}
          dataId="titleEn"
          label="Title in English"
          max={200}
          onChange={(target) => SS.set("newFatwa-titleEn", target.value)}
        />
      )}
      <Textarea
        defaultValue={preFill.ques || SS.get("newFatwa-ques")}
        onChange={(target) => SS.set("newFatwa-ques", target.value)}
        dataId="ques"
        label=<FormattedMessage id="question" defaultMessage="Question" />
      />
      {preFill.translate && (
        <Textarea
          defaultValue={preFill.quesEn || SS.get("newFatwa-quesEn")}
          onChange={(target) => SS.set("newFatwa-quesEn", target.value)}
          dataId="quesEn"
          label="Question in English"
        />
      )}
      <Textarea
        defaultValue={preFill.ans || SS.get("newFatwa-ans")}
        onChange={(target) => {
          SS.set("newFatwa-ans", target.value);
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
          defaultValue={preFill.ansEn || SS.get("newFatwa-ansEn")}
          onChange={(target) => SS.set("newFatwa-ansEn", target.value)}
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
      <Submit
        label=<FormattedMessage id="form.submit" defaultMessage="Submit" />
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [fieldCode]: newValue }),
      })
        .then((res) => {
          if (res.status === 200) {
            // form.current.querySelector("input").blur();
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
  const jamia = fatwa.jamia;
  function submit(e) {
    e.preventDefault();
    if (SS.get("reportFatwa-name").length < 3) {
      emptyFeildWarning("#name", "input", "Enter a valid name");
      return;
    }
    if (
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.exec(SS.get("reportFatwa-email"))
    ) {
      emptyFeildWarning("#email", "input", "Enter a valid email");
      return;
    }
    if (!validateMoblie(SS.get("reportFatwa-mobile"))) {
      emptyFeildWarning(
        "#mobile",
        "input",
        "Enter a valid mobile number. +8801***"
      );
      return;
    }
    if (SS.get("reportFatwa-subject").length < 5) {
      emptyFeildWarning("#subject", "input", "Enter a subject.");
      return;
    }
    if (SS.get("reportFatwa-message").length < 10) {
      emptyFeildWarning("#message", "textarea", "Enter a message.");
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
