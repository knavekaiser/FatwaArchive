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

const { Translate } = require("@google-cloud/translate").v2;

const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

//---------------------------------------------- dev stuff -

// require("dotenv").config();
console.log(process.env);
console.log(process.env.GOOGLE_API_CREDENTIAL);
// const morgan = require("morgan");
// app.use(morgan("dev"));

//----------------------------------------------------------

const PORT = process.env.PORT || 8877;
const URI = process.env.ATLAS_URI;

const CREDENTIALS = process.env.GOOGLE_API_CREDENTIAL;
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
  .then(() => console.log("connected to db"));

app.use(express.json());
app.use(cookieParser());

require("./config/passport");
app.use(passport.initialize());

app.use("/api", require("./routes/general"));
app.use("/api/jamia", require("./routes/jamia"));
app.use("/api/admin", require("./routes/admin"));

app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  return res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.listen(PORT, () => console.log("server just ran at " + PORT));
