const fatwa = new Schema(
  {
    link: {
      "en-US": { type: String, require: true },
      "bn-BD": { type: String, require: true },
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
    status: { type: String, default: "pending" },
    translation: { type: Boolean, enum: [true, false], default: false },
    meta: {
      date: { type: Date, required: true },
      write: { type: String, required: true, trim: true },
      atts: { type: String, trim: true, default: "" },
      comments: [{ type: Schema.Types.ObjectId, ref: "FatwaComment" }],
    },
  },
  { timestamps: true }
);

const deletedFatwa = new Schema(
  {
    link: {
      "en-US": { type: String },
      "bn-BD": { type: String },
    },
    topic: {
      "en-US": { type: String },
      "bn-BD": { type: String },
    },
    title: {
      "en-US": { type: String },
      "bn-BD": { type: String },
    },
    ques: {
      "en-US": { type: String },
      "bn-BD": { type: String },
    },
    ans: {
      "en-US": { type: String },
      "bn-BD": { type: String },
    },
    ref: { type: Array },
    img: { type: Array },
    source: { type: Schema.Types.ObjectId, ref: "Source" },
    status: { type: String, default: "deleted" },
    translation: { type: Boolean, default: false },
    meta: {
      date: { type: String },
      atts: { type: String },
      write: { type: String },
      comments: [{ type: Schema.Types.ObjectId, ref: "FatwaComment" }],
    },
  },
  { timestamps: true }
);

const Fatwa = mongoose.model("Fatwa", fatwa);
const DeletedFatwa = mongoose.model("DeletedFatwa", deletedFatwa);

global.Fatwa = Fatwa;
global.DeletedFatwa = DeletedFatwa;
