const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 8080;

const URI = process.env.ATLAS_URI;

const connectDB = async () => {
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log("connected to db");
};

connectDB();
app.use(express.json());

const api = require("./routes/apis");
app.use("/api", api);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));
}

app.get("/*", (req, res) => {
  res.sendFile("index.html", { root: "./client/build" });
});

app.listen(PORT, () => {
  console.log("server just ran");
});
