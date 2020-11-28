const userQuestion = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  mobile: { type: String },
  topic: { type: String, required: true },
  ques: { type: String, required: true, unique: true },
  answered: { type: Boolean, default: false },
  submitted: { type: Date, default: Date.now },
});

const userReview = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  mobile: { type: String },
  message: { type: String, required: true },
  replied: { type: Boolean, default: false },
  submitted: { type: Date, default: Date.now },
});

const reportFatwa = new Schema({
  fatwa: { type: String, required: true },
  jamia: { type: String, required: true },
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
