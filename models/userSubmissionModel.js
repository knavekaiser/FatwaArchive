const userQuestion = new Schema(
  {
    user: {
      name: { type: String, required: true, trim: true },
      add: { type: String, required: true, trim: true },
      mob: { type: String },
    },
    ques: {
      topic: {
        "en-US": { type: String, required: true },
        "bn-BD": { type: String, required: true },
      },
      body: { type: String, required: true, unique: true },
    },
    ans: [
      {
        source: {
          type: Schema.Types.ObjectId,
          ref: "Source",
          required: true,
        },
        topic: {
          "en-US": { type: String, required: true },
          "bn-BD": { type: String, required: true },
        },
        title: { type: String, required: true, trim: true },
        body: { type: String, required: true, trim: true },
        ref: [],
        vote: {
          count: { type: Number, default: 0 },
          voters: [
            {
              source: {
                type: Schema.Types.ObjectId,
                ref: "Source",
                required: true,
              },
              vote: { type: String, enum: ["up", "down"], required: true },
            },
          ],
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, default: "pending" },
    ansCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
userQuestion.methods.addAns = function (ans) {
  this.ans = this.ans.filter(
    (item) => item.source.toString() !== ans.source.toString()
  );
  if (this.ans.some((item) => item.body === ans.body)) {
    throw "answer exsists";
  }
  this.status === "pending" && (this.status = "pendingApproval");
  this.ansCount += 1;
  this.ans.push(ans);
  this.ans.sort((a, b) => {
    if (a.vote.count > b.vote.count) {
      return 1;
    } else {
      return -1;
    }
  });
  return this.save();
};
userQuestion.methods.dltAns = function (detail) {
  this.ans = this.ans.filter(
    (ans) => ans._id.toString() !== detail._id.toString()
  );
  this.ansCount -= 1;
  return this.save();
};
userQuestion.methods.vote = function (detail) {
  this.ans = this.ans.map((ans) => {
    if (ans._id.toString() === detail.ans_id.toString()) {
      ans.vote.voters = ans.vote.voters.filter(
        (voter) => voter.source.toString() !== detail.voter.toString()
      );
      ans.vote.voters.push({ source: detail.voter, vote: detail.vote });
      let voteCount = 0;
      ans.vote.voters.forEach((voter) => {
        voter.vote === "up" ? voteCount++ : voteCount--;
      });
      ans.vote.count = voteCount;
      return ans;
    } else {
      return ans;
    }
  });
  this.ans.sort((a, b) => {
    if (a.vote.count < b.vote.count) {
      return 1;
    } else {
      return -1;
    }
  });
  return this.save();
};

const UserQuestion = mongoose.model("UserQuestion", userQuestion);

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

const UserReview = mongoose.model("UserReview", userReview);
const ReportFatwa = mongoose.model("ReportFatwa", reportFatwa);

exports.UserQuestion = UserQuestion;
exports.UserReview = UserReview;
exports.ReportFatwa = ReportFatwa;
