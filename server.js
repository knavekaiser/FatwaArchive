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
const isBot = require("isbot-fast");

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
      translate.translate(item, getLan(item) === "en-US" ? "bn" : "en")
    )
  )
    .then((res) => res.map((item) => item[0] + (salt ? ` ${genCode(10)}` : "")))
    .catch((err) => {
      throw err;
    });
  return await allTrans;
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

//---------------------------------------------- dev stuff -

require("dotenv").config();
// const morgan = require("morgan");
// app.use(morgan("dev"));

//----------------------------------------------------------

const PORT = process.env.PORT || 3001;
const URI = process.env.ATLAS_URI;

const CREDENTIALS = JSON.parse(process.env.GOOGLE_API_CREDENTIAL);
global.translate = new Translate({
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

const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function bot(req, res, next) {
  const ua = req.headers["user-agent"] || "";
  if (
    req.headers.ssr === "on" ||
    req.originalUrl.startsWith("/static") ||
    req.originalUrl.startsWith("/api") ||
    req.originalUrl.startsWith("/fatwaArchive_favicon")
  ) {
    next();
  } else {
    if (isBot(ua)) {
      console.log("this was a bot ");
      const url = req.get("host") + req.originalUrl;
      got(url, { headers: { ssr: "on" } })
        .then((response) => {
          const window = new JSDOM(response.body, {
            url: url,
            resources: "usable",
            runScripts: "dangerously",
          }).window;
          window.fetch = fetch;
          const document = window.document;
          setTimeout(() => {
            const html = document.documentElement.outerHTML;
            res.send(html);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          next();
        });
      console.log("-----------------------------------------res ended");
    } else {
      next();
    }
  }
}

app.use(bot, express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
);

app.listen(PORT, () => console.log("server just ran at " + PORT));
