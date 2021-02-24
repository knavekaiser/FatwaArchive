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
function getMonth() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear().toString().substr(2);
  return `${month < 10 ? "0" + month : month}-${year}`;
}
global.TranslateAll = async function (arr, salt) {
  return GCloud.findOne({ month: getMonth() })
    .then((report) => {
      if (report) {
        return report;
      } else {
        return new GCloud({
          month: getMonth(),
          usage: { translate: 0 },
        }).save();
      }
    })
    .then(async (report) => {
      const allTrans = Promise.all([
        ...arr.map((item) =>
          translate.translate(item, getLan(item) === "en-US" ? "bn" : "en")
        ),
        GCloud.findByIdAndUpdate(report._id, {
          "usage.translate": report.usage.translate + arr.join().length,
        }),
      ]);
      if (arr.join().length + report.usage.translate < 499000) {
        return await allTrans.then((res) => {
          return (res.map((item) => item[0] + (salt ? ` ${genCode(10)}` : ""))[
            res.length
          ] = report.usage.translate);
        });
      } else {
        return [
          ...arr.map(
            (item) =>
              `Something went wrong with google translate. ${genCode(10)}`
          ),
          report.usage.translate,
        ];
      }
    });
};

global.ObjectID = require("mongodb").ObjectID;

const {} = require("./models/fatwaModel");
const {} = require("./models/sourceModel");
const {} = require("./models/userSubmissionModel");
const {} = require("./models/userModel");
global.fetch = require("node-fetch");

const { Translate } = require("@google-cloud/translate").v2;

const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3001;
const URI = process.env.ATLAS_URI;

const CREDENTIALS = JSON.parse(process.env.GOOGLE_API_CREDENTIAL);
<<<<<<< HEAD
const translate = new Translate({
=======
translate = new Translate({
>>>>>>> 02e85cef978b07b86d4d2766166053608695351a
  credentials: CREDENTIALS,
  project_id: CREDENTIALS.project_id,
});

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
