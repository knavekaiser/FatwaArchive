import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { SiteContext } from "../Context";
import "./CSS/JamiaForms.min.css";
import { Input, Textarea, Checkbox, PasswordInput, $ } from "./FormElements";
import { FormattedMessage } from "react-intl";

const SS = {
  set: (key, value) => sessionStorage.setItem(key, value),
  get: (key) => sessionStorage.getItem(key) || "",
  remove: (key) => sessionStorage.removeItem(key),
};

export const JamiaRegister = () => {
  const { locale } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [idIsValid, setIdIsValid] = useState(null);
  const validateId = () => {
    if (SS.get("reg-id").length >= 8 && idIsValid === null) {
      fetch(`/api/validateId/${SS.get("reg-id")}`)
        .then((res) => {
          if (res.status === 200) {
            setIdIsValid(true);
          } else {
            setIdIsValid(false);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    validateId();
    // $(".reg #id input").addEventListener("blur", validateId);
    return () => {
      setSuccess(false);
    };
  }, []);
  function submit(e) {
    e.preventDefault();
    if (!idIsValid) {
      $("#id input").focus();
      return;
    }
    if ($("#pass input").value !== $("#confirmPass input").value) {
      $("#confirmPass input").focus();
      return;
    }
    if ($("#contact input").value.length !== 14) {
      $("#contact input").focus();
      return;
    }
    if ($("#applicantMobile input").value.length !== 14) {
      $("#applicantMobile input").focus();
      return;
    }
    const data = {
      name: {
        "bn-BD": $(".reg #name input").value,
        "en-US": $(".reg #nameEn input").value,
      },
      founder: $(".reg #founder textarea").value,
      est: $(".reg #est input").value,
      address: $(".reg #add textarea").value,
      contact: $(".reg #contact input").value,
      primeMufti: $(".reg #primeMufti input").value,
      id: $(".reg #id input").value,
      password: $(".reg #pass input").value,
      applicant: {
        name: $(".reg #applicant input").value,
        designation: $(".reg #applicantDesignation input").value,
        mobile: $(".reg #applicantMobile input").value,
      },
    };
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
          SS.remove("reg-nameEn");
          SS.remove("reg-founder");
          SS.remove("reg-est");
          SS.remove("reg-add");
          SS.remove("reg-contact");
          SS.remove("reg-primeMufti");
          SS.remove("reg-id");
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
      <form className="reg" onSubmit={submit}>
        <h2>
          <FormattedMessage
            id="form.jamiaReg.head"
            defaultMessage="REGISTRATION"
          />
        </h2>
        <div className="label jamiaDetail">
          <FormattedMessage
            id="form.jamiaReg.label.jamiaDetail"
            defaultMessage="JAMIA"
          />
        </div>
        <Input
          defaultValue={SS.get("reg-name")}
          onChange={(target) => SS.set("reg-name", target.value)}
          dataId="name"
          required={true}
          type="text"
          validation={/^[ঀ-৾\s(),]+$/}
          warning="Bangla"
          label=<FormattedMessage
            id="form.jamiaReg.name"
            defaultMessage="Jamia's Name (Bangla)"
          />
        />
        <Input
          defaultValue={SS.get("reg-nameEn")}
          onChange={(target) => SS.set("reg-nameEn", target.value)}
          dataId="nameEn"
          required={true}
          type="text"
          validation={/^[a-zA-Z0-9\s(),]+$/}
          warning="English"
          label=<FormattedMessage
            id="form.jamiaReg.nameEn"
            defaultMessage="Jamia's Name (English)"
          />
        />
        <Textarea
          defaultValue={SS.get("reg-founder")}
          onChange={(target) => SS.set("reg-founder", target.value)}
          dataId="founder"
          required={true}
          validation={/^[ঀ-ৣৰ-৾a-zA-Z\s(),-]+$/}
          type="text"
          label=<FormattedMessage
            id="form.jamiaReg.founder"
            defaultMessage="Founder"
          />
          max={150}
        />
        <Input
          defaultValue={SS.get("reg-est")}
          onChange={(target) => SS.set("reg-est", target.value)}
          dataId="est"
          required={true}
          type="text"
          validation={/^[\d]{0,4}$/}
          label=<FormattedMessage id="form.jamiaReg.est" defaultMessage="EST" />
        />
        <Textarea
          defaultValue={SS.get("reg-add")}
          onChange={(target) => SS.set("reg-add", target.value)}
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
          onChange={(target) => SS.set("reg-contact", target.value)}
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
          onChange={(target) => SS.set("reg-primeMufti", target.value)}
          dataId="primeMufti"
          required={true}
          label=<FormattedMessage
            id="form.jamiaReg.primeMufti"
            defaultMessage="Prime Mufti"
          />
        />
        <div className="label login">
          <FormattedMessage
            id="form.jamiaReg.label.loginDetail"
            defaultMessage="LOGIN DETAIL"
          />
        </div>
        <Input
          defaultValue={SS.get("reg-id")}
          onChange={(target) => {
            SS.set("reg-id", target.value);
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
          {idIsValid && <ion-icon name="checkmark-circle-outline"></ion-icon>}
        </Input>
        <PasswordInput
          match=".reg #confirmPass input"
          passwordStrength={true}
          dataId="pass"
          label=<FormattedMessage
            id="form.login.password"
            defaultMessage="Password"
          />
        />
        <PasswordInput
          match=".reg #pass input"
          dataId="confirmPass"
          label=<FormattedMessage
            id="form.login.passwordRepeat"
            defaultMessage="Confirm Password"
          />
        />
        <div className="label applicant">
          <FormattedMessage
            id="form.jamiaReg.label.applicantDetail"
            defaultMessage="APPLICANT"
          />
        </div>
        <Input
          defaultValue={SS.get("reg-applicant")}
          onChange={(target) => SS.set("reg-applicant", target.value)}
          required={true}
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
          onChange={(target) =>
            SS.set("reg-applicantDesignation", target.value)
          }
          required={true}
          dataId="applicantDesignation"
          type="text"
          label=<FormattedMessage
            id="form.jamiaReg.applicantDesignation"
            defaultMessage="Applicant's designation in Jamia"
          />
        />
        <Input
          defaultValue={SS.get("reg-applicantMobile") || "+8801"}
          onChange={(target) => SS.set("reg-applicantMobile", target.value)}
          required={true}
          dataId="applicantMobile"
          type="text"
          validation={/^\+8801\d{0,9}$/}
          warning="+8801***"
          max={14}
          min={14}
          label=<FormattedMessage
            id="form.jamiaReg.applicantContact"
            defaultMessage="Applicant's Mobile"
          />
        />
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
        <button type="submit" disabled={loading}>
          <FormattedMessage
            id="form.jamiaReg.submit"
            defaultMessage="Register"
          />
          {loading && <span className="loading"></span>}
        </button>
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
        history.push("/jamia/profile");
        console.log(data);
      });
  }
  return (
    <div className={`main jamiaForms ${locale === "bn-BD" ? "bn-BD" : ""}`}>
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
