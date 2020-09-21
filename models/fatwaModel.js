const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fatwaSchema = new Schema({
  title: { type: String, required: true, trim: true, unique: true },
  ques: { type: String, required: true, trim: true, unique: true },
  ans: { type: String, required: true, trim: true, unique: true },
  ref: { type: Array, required: true },
  img: { type: Array, require: true },
  added: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const Fatwa = mongoose.model("Fatwa", fatwaSchema);
module.exports = Fatwa;
