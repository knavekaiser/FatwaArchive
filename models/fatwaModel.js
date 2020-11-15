const fatwa = new Schema({
  link: {
    "en-US": { type: String, require: true, unique: true },
    "bn-BD": { type: String, require: true, unique: true },
  },
  topic: {
    "en-US": { type: String, required: true },
    "bn-BD": { type: String, required: true },
  },
  title: {
    "en-US": { type: String, required: true, trim: true, unique: true },
    "bn-BD": { type: String, required: true, trim: true, unique: true },
  },
  ques: {
    "en-US": { type: String, required: true, trim: true },
    "bn-BD": { type: String, required: true, trim: true },
  },
  ans: {
    "en-US": { type: String, required: true, trim: true, unique: true },
    "bn-BD": { type: String, required: true, trim: true, unique: true },
  },
  ref: { type: Array, required: true },
  img: { type: Array, require: true },
  jamia: { type: String, required: true },
  added: { type: Date, default: Date.now },
  translation: { type: String, required: true },
});
const fatwaSubmitions = new Schema({
  topic: {
    "en-US": { type: String, required: true },
    "bn-BD": { type: String, required: true },
  },
  title: {
    "en-US": { type: String, default: "", trim: true },
    "bn-BD": { type: String, required: true, trim: true, unique: true },
  },
  ques: {
    "en-US": { type: String, default: "", trim: true },
    "bn-BD": { type: String, required: true, trim: true },
  },
  ans: {
    "en-US": { type: String, default: "", trim: true },
    "bn-BD": { type: String, required: true, trim: true, unique: true },
  },
  ref: { type: Array, required: true },
  img: { type: Array, require: true },
  jamia: { type: String, required: true },
  submitted: { type: Date, default: Date.now },
  translation: { type: String, required: true },
});

const Fatwa = mongoose.model("Fatwa", fatwa);
const FatwaSubmitions = mongoose.model("FatwaSubmitions", fatwaSubmitions);

exports.Fatwa = Fatwa;
exports.FatwaSubmitions = FatwaSubmitions;
