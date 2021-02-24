global.express = require("express");
global.router = require("express").Router();
global.mongoose = require("mongoose");
global.Schema = mongoose.Schema;
global.bcrypt = require("bcryptjs");
global.passport = require("passport");
global.LocalStrategy = require("passport-local").Strategy;
global.JwtStrategy = require("passport-jwt").Strategy;
global.ExtractJwt = require("passport-jwt").ExtractJwt;
global.jwt = require("jsonwebtoken");
global.jwt_decode = require("jwt-decode");
const translate = require("@iamtraction/google-translate");

global.genCode = (n) => {
  code = "";
  while (code.length < n) {
    code += Math.ceil(Math.random() * 9);
  }
  return code;
};
global.getLan = (sentence, i) => {
  const str = sentence.replace(/[\s\-\.?।]/gi, "");
  if ((str.match(/[a-z0-9]/gi) || []).length / str.length > 0.9) {
    return !i ? "en-US" : "bn-BD";
  } else {
    return !i ? "bn-BD" : "en-US";
  }
};
global.TranslateAll = async function (arr, salt) {
  const allTrans = Promise.all(
    arr.map((item) =>
      translate(item, { to: getLan(item) === "en-US" ? "bn" : "en" })
    )
  );
  return await allTrans.then((res) =>
    res.map((item) => item.text + (salt ? ` ${genCode(10)}` : ""))
  );
};

global.ObjectID = require("mongodb").ObjectID;

const {} = require("./models/fatwaModel");
const {} = require("./models/sourceModel");
const {} = require("./models/userSubmissionModel");
const {} = require("./models/userModel");
global.fetch = require("node-fetch");

const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3001;
const URI = process.env.ATLAS_URI;

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("could not connect to db, here's why: " + err));

app.use(express.json());
app.use(cookieParser());

require("./config/passport");
app.use(passport.initialize());

app.use("/api", require("./routes/general"));
app.use("/api/source", require("./routes/source"));
app.use("/api/admin", require("./routes/admin"));

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
);

app.listen(PORT, () => console.log("server just ran at " + PORT));
