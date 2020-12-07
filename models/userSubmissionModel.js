const userQuestion = new Schema(
  {
    user: {
      name: { type: String, required: true, trim: true },
      add: { type: String, required: true, trim: true },
      mob: { type: String },
    },
    question: {
      topic: { type: String, required: true },
      body: { type: String, required: true, unique: true },
    },
    answered: { type: Boolean, default: false },
    answers: [
      {
        source: { type: Schema.Types.ObjectId, ref: "Source", required: true },
        body: { type: Boolean, default: false, required: true, trim: true },
        vote: {
          count: { type: Number, default: 0 },
          voters: [
            { type: Schema.Types.ObjectId, ref: "Source", required: true },
          ],
        },
      },
    ],
  },
  { timestamps: true }
);

const userReview = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  mobile: { type: String },
  message: { type: String, required: true },
  replied: { type: Boolean, default: false },
  submitted: { type: Date, default: Date.now },
});

const reportFatwa = new Schema({
  fatwa: { type: Schema.Types.ObjectId, ref: "Fatwa" },
  jamia: { type: Schema.Types.ObjectId, ref: "Source" },
  submitted: { type: Date, default: Date.now },
  user: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, trim: true },
  },
  message: {
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
  },
});

const UserQuestion = mongoose.model("UserQuestion", userQuestion);
const UserReview = mongoose.model("UserReview", userReview);
const ReportFatwa = mongoose.model("ReportFatwa", reportFatwa);

exports.UserQuestion = UserQuestion;
exports.UserReview = UserReview;
exports.ReportFatwa = ReportFatwa;
