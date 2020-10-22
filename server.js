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

const cookieParser = require("cookie-parser");

const app = express();

//---------------------------------------------- dev stuff -

require("dotenv").config();
const morgan = require("morgan");
app.use(morgan("dev"));

//----------------------------------------------------------

const PORT = process.env.PORT || 8080;
const URI = process.env.ATLAS_URI;

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

// if (process.env.NODE_ENV === "production")
app.use(express.static("./client/build"));

app.get("/*", (req, res) => res.send("what up? "));

app.listen(PORT, () => console.log("server just ran at " + PORT));
