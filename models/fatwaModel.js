const fatwa = new Schema(
  {
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
    source: { type: Schema.Types.ObjectId, ref: "Source", required: true },
    status: { type: String, default: "live" },
    translation: { type: Boolean, default: false },
    meta: {
      comments: [{ type: Schema.Types.ObjectId, ref: "FatwaComment" }],
    },
  },
  { timestamps: true }
);

const fatwaSubmission = new Schema(
  {
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
    source: { type: Schema.Types.ObjectId, ref: "Source" },
    translation: { type: Boolean, default: false },
  },
  { timestamps: true }
);

fatwa.statics.getSuggestions = (img, callback) =>
  Fatwa.find(img, callback).select("title link");

const Fatwa = mongoose.model("Fatwa", fatwa);
const FatwaSubmission = mongoose.model("FatwaSubmission", fatwaSubmission);

exports.Fatwa = Fatwa;
exports.FatwaSubmission = FatwaSubmission;
