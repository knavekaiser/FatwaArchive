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
        meta: {
          date: { type: Date, required: true },
          write: { type: String, required: true },
          atts: { type: String, required: true },
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reports: [
      {
        source: { type: Schema.Types.ObjectId, ref: "Source", required: true },
        message: {
          subject: { type: String, required: true, trim: true },
          body: { type: String, required: true, trim: true },
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, default: "pending" },
    ansCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
userQuestion.methods.addAns = function (newAns) {
  this.ans = this.ans.filter(
    (ans) => ans.source.toString() !== newAns.source.toString()
  );
  if (this.ans.some((ans) => ans.body === newAns.body)) {
    throw { code: 11000, field: `ans.bn-BD` };
  } else {
    return Fatwa.findOne({
      $or: [
        { [`title.${getLan(newAns.title)}`]: newAns.title },
        { [`ans.${getLan(newAns.title)}`]: newAns.body },
      ],
    }).then((fatwa) => {
      if (fatwa) {
        if (fatwa.title[getLan(newAns.title)] === newAns.title) {
          throw { code: 11000, field: `title.bn-BD` };
        } else if (fatwa.ans[getLan(newAns.title)] === newAns.body) {
          throw { code: 11000, field: `ans.bn-BD` };
        }
      } else {
        this.status === "pending" && (this.status = "pendingApproval");
        this.ansCount += 1;
        this.ans.push(newAns);
        this.ans.sort((a, b) => {
          if (a.vote.count > b.vote.count) {
            return 1;
          } else {
            return -1;
          }
        });
        return this.save();
      }
    });
  }
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
userQuestion.methods.report = function (report) {
  this.reports.push(report);
  return this.save();
};
userQuestion.methods.approveAns = function (ans_id) {
  const ans = this.ans.filter(
    (ans) => ans._id.toString() === ans_id.toString()
  )[0];
  return TranslateAll([ans.title, this.ques.body, ans.body])
    .then((translations) => {
      const newFatwa = new Fatwa({
        link: {
          [getLan(ans.title)]: ans.title.replace(/\s/g, "-"),
          [getLan(ans.title, true)]: translations[0].replace(/\s/g, "-"),
        },
        topic: ans.topic,
        title: {
          [getLan(ans.title)]: ans.title,
          [getLan(ans.title, true)]: translations[0],
        },
        ques: {
          [getLan(this.ques.body)]: this.ques.body,
          [getLan(this.ques.body, true)]: translations[1],
        },
        ans: {
          [getLan(ans.body)]: ans.body,
          [getLan(ans.body, true)]: translations[2],
        },
        ref: ans.ref,
        img: ans.img,
        meta: ans.meta,
        source: ans.source,
        status: "live",
      });
      return newFatwa.save();
    })
    .then(() =>
      UserQuestion.findByIdAndUpdate(this._id, { status: "answered" })
    )
    .catch((err) => {
      throw err;
    });
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

const reportFatwa = new Schema(
  {
    fatwa: { type: Schema.Types.ObjectId, ref: "Fatwa" },
    source: { type: Schema.Types.ObjectId, ref: "Source" },
    user: {
      name: { type: String, required: true, trim: true },
      email: { type: String, trim: true },
      mob: { type: String, trim: true },
    },
    message: {
      subject: { type: String, required: true, trim: true },
      body: { type: String, required: true, trim: true },
    },
  },
  { timestamps: true }
);

const UserReview = mongoose.model("UserReview", userReview);
const ReportFatwa = mongoose.model("ReportFatwa", reportFatwa);

global.UserQuestion = UserQuestion;
global.UserReview = UserReview;
global.ReportFatwa = ReportFatwa;
