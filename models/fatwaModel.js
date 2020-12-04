const fatwa = new Schema(
  {
    link: {
      "en-US": { type: String, default: "" },
      "bn-BD": { type: String, require: true, unique: true },
    },
    topic: {
      "en-US": { type: String, required: true },
      "bn-BD": { type: String, required: true },
    },
    title: {
      "en-US": { type: String, default: "" },
      "bn-BD": { type: String, required: true, trim: true, unique: true },
    },
    ques: {
      "en-US": { type: String, default: "" },
      "bn-BD": { type: String, required: true, trim: true },
    },
    ans: {
      "en-US": { type: String, default: "" },
      "bn-BD": { type: String, required: true, trim: true, unique: true },
    },
    ref: { type: Array, required: true },
    img: { type: Array, require: true },
    source: { type: Schema.Types.ObjectId, ref: "Source", required: true },
    status: { type: String, default: "pending" },
    translation: { type: String, required: true },
  },
  { timestamps: true }
);

fatwa.statics.getSuggestions = (img, callback) =>
  Fatwa.find(img, callback).select("title link");

const Fatwa = mongoose.model("Fatwa", fatwa);

exports.Fatwa = Fatwa;
