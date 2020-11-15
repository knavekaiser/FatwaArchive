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

const UserQuestion = mongoose.model("UserQuestion", userQuestion);
const UserReview = mongoose.model("UserReview", userReview);

exports.UserQuestion = UserQuestion;
exports.UserReview = UserReview;
