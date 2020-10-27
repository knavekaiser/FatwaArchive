import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/JamiaForms.min.css";
import { Input, Textarea, Checkbox, PasswordInput, $ } from "./FormElements";
import { FormattedMessage } from "react-intl";

const SS = {
  set: (key, value) => sessionStorage.setItem(key, value),
  get: (key) => sessionStorage.getItem(key) || "",
  remove: (key) => sessionStorage.removeItem(key),
};
// <section>
// <div className="label login">
// <FormattedMessage
// id="form.jamiaReg.label.loginDetail"
// defaultMessage="LOGIN DETAIL"
// />
// </div>
// </section>

function JamiaDetail() {
  return (
    <>
      <Input
        defaultValue={SS.get("reg-name")}
        onChange={(target) => {
          SS.set("reg-name", target.value);
          $("#name .emptyFeildWarning") &&
            $("#name .emptyFeildWarning").remove();
        }}
        dataId="name"
        required={true}
        type="text"
        validation={/^[ঀ-৾a-zA-Z\s(),]+$/}
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
          $("#add .emptyFeildWarning") && $("#add .emptyFeildWarning").remove();
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
          $("#contact .emptyFeildWarning") &&
            $("#contact .emptyFeildWarning").remove();
        }}
        required={true}
        dataId="contact"
        type="text"
        validation={/^\+8801\d{0,9}$/}
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
          $("#primeMufti .emptyFeildWarning") &&
            $("#primeMufti .emptyFeildWarning").remove();
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
        validation={/^[a-zA-Z0-9]+$/}
        warning=<FormattedMessage
          id="form.jamiaReg.warning.invalidChar"
          defaultMessage="Invalid Character!"
        />
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
        validation={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
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
        validation={/^\+8801\d{0,9}$/}
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
  function emptyFeildWarning(selector, inputType, warning) {
    const emptyFeildWarning = document.createElement("p");
    emptyFeildWarning.classList.add("emptyFeildWarning");
    emptyFeildWarning.textContent = warning;
    if ($(`${selector} .emptyFeildWarning`) === null) {
      $(`${selector}`).appendChild(emptyFeildWarning);
    }
    $(`${selector} ${inputType}`).focus();
  }
  function rightButton() {
    if (step === 1) {
      if (SS.get("reg-name").length < 5) {
        emptyFeildWarning("#name", "input", "Add a valid jamia");
        return;
      }
      if (SS.get("reg-add").length < 10) {
        emptyFeildWarning("#add", "textarea", "Add a valid address");
        return;
      }
      if (SS.get("reg-contact").length < 14) {
        emptyFeildWarning("#contact", "input", "Add a valid mobile number.");
        return;
      }
      if (SS.get("reg-primeMufti").length < 4) {
        emptyFeildWarning("#primeMufti", "input", "Add a valid jamia");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (SS.get("reg-id").length < 8) {
        emptyFeildWarning("#id", "input", "Add a valid id");
        return;
      }
      if ($(".reg #pass input").value.length < 7) {
        emptyFeildWarning("#pass", "input", "Add a password");
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
    if (SS.get("reg-applicantMobile").length < 14) {
      emptyFeildWarning(
        "#applicantMobile",
        "input",
        "Add a valid mobile number"
      );
      return;
    }
    const data = {
      name: SS.get("reg-name"),
      address: SS.get("reg-add"),
      contact: SS.get("reg-contact"),
      primeMufti: SS.get("reg-primeMufti"),
      id: SS.get("reg-id"),
      password: SS.get("reg-pass"),
      applicant: {
        name: SS.get("reg-applicant"),
        designation: SS.get("reg-applicantDesignation"),
        mobile: SS.get("reg-applicantMobile"),
      },
    };
    console.log(data);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    setLoading(true);
    fetch("/api/jamia/new", options)
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
        }
      })
      .catch((err) => console.log(err));
  }
  return !success ? (
    <div className={`main jamiaForms ${locale === "bn-BD" ? "bn-BD" : ""}`}>
      {user && <Redirect to="/" />}
      <form className="reg" onSubmit={submit}>
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
            {locale === "en-US" && (
              <>
                I accept all{" "}
                <Link to="/terms&conditions">Terms and conditions.</Link>
              </>
            )}
            {locale === "bn-BD" && (
              <>
                আমি ফাতোয়া আর্কাইভের সকল{" "}
                <Link to="/terms&conditions">শর্ত সমূহ</Link> মেনে নিলাম ।
              </>
            )}
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
          <button type="submit" disabled={loading}>
            <FormattedMessage
              id="form.jamiaReg.submit"
              defaultMessage="Register"
            />
            {loading && <span className="loading"></span>}
          </button>
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
  const [invalidCredentials, setInvalidCredentials] = useState(null);
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
          setInvalidCredentials(true);
        }
        return res.json();
      })
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
        history.push("/jamia/profile");
        console.log(data);
      });
  }
  return (
    <div className={`main jamiaForms ${locale === "bn-BD" ? "bn-BD" : ""}`}>
      {user && <Redirect to="/" />}
      <form className="login" onSubmit={submit}>
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
          validation={/^[a-zA-Z0-9]+$/}
          onChange={(target) => setUserId(target.value)}
        />
        <PasswordInput
          dataId="pass"
          onChange={(target) => setPass(target.value)}
          label=<FormattedMessage
            id="form.login.password"
            defaultMessage="Password"
          />
        />
        <button type="submit" disabled={loading}>
          <FormattedMessage id="form.login.submit" defaultMessage="Login" />
          {loading && <span className="loading"></span>}
        </button>
      </form>
    </div>
  );
};

export const AdminLogin = () => {
  const [invalidCredentials, setInvalidCredentials] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { setUser, setIsAuthenticated, locale, user } = useContext(SiteContext);
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
      body: JSON.stringify({ username: userId, password: pass, role: "admin" }),
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 401) {
          setInvalidCredentials(true);
        }
        return res.json();
      })
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
        history.push("/admin");
        console.log(data);
      });
  }
  return (
    <div className={`main jamiaForms ${locale === "bn-BD" ? "bn-BD" : ""}`}>
      {user && <Redirect to="/" />}
      <form className="adminLogin" onSubmit={submit}>
        <h2 data-bn="This part is only for Admins.">Admin</h2>
        <Input
          required={true}
          type="text"
          label=<FormattedMessage
            id="form.admin.login.id"
            defaultMessage="Username"
          />
          validation={/^[a-zA-Z0-9]+$/}
          onChange={(target) => setUserId(target.value)}
        />
        <PasswordInput
          dataId="pass"
          onChange={(target) => setPass(target.value)}
          label=<FormattedMessage
            id="form.login.password"
            defaultMessage="Password"
          />
        />
        <button type="submit" disabled={loading}>
          <FormattedMessage id="form.login.submit" defaultMessage="Login" />
          {loading && <span className="loading"></span>}
        </button>
      </form>
    </div>
  );
};
