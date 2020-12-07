const { Fatwa, FatwaSubmission } = require("../models/fatwaModel");
const { Jamia } = require("../models/sourceModel");
const { User } = require("../models/userModel");
const { UserQuestion } = require("../models/userSubmissionModel");

//-------------------------------NEW FATWA
router
  .route("/source/fatwa/new")
  .post(passport.authenticate("jwt"), (req, res) => {
    const { title, titleEn, ques, quesEn, ans, ansEn, translation } = req.body;
    const newFatwa = new FatwaSubmission({
      topic: req.body.topic,
      title: {
        "bn-BD": title,
        ...(titleEn && { "en-US": titleEn }),
      },
      ques: {
        "bn-BD": ques,
        ...(quesEn && { "en-US": quesEn }),
      },
      ans: {
        "bn-BD": ans,
        ...(ansEn && { "en-US": ansEn }),
      },
      added: new Date(),
      ref: req.body.ref,
      img: req.body.img,
      source: req.user._id,
      translation: translation,
    });
    newFatwa
      .save()
      .then(() => res.send("fatwa added"))
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          res.status(400).json({
            code: err.code,
            field: Object.keys(err.keyValue)[0],
          });
        } else {
          res.status(400).json(err);
        }
      });
  });
router
  .route("/source/fatwaSubmissions/filter")
  .get(passport.authenticate("jwt"), (req, res) => {
    const locale = req.headers["accept-language"];
    const query = { source: req.user._id };
    const sort = { column: req.query.column, order: req.query.order };
    req.query.title && (query[`title.${locale}`] = RegExp(req.query.title));
    req.query.question &&
      (query[`ques.${locale}`] = RegExp(req.query.question));
    req.query.answer && (query[`ans.${locale}`] = RegExp(req.query.answer));
    req.query.topic && (query[`topic.${locale}`] = req.query.topic);
    FatwaSubmission.find(query)
      .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
      .then((submissions) => {
        console.log(submissions);
        if (submissions.length === 0) {
          res.json([]);
          return;
        }
        res.json(submissions);
      })
      .catch((err) => res.status(400).json(err));
  });
router.route("/fatwaSubmissions/:_id").delete((req, res) => {
  FatwaSubmissions.findByIdAndDelete(req.params._id)
    .then(() => res.json("successfully deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//----------------------------------------------ALL FATWA
router
  .route("/source/allfatwa/filter")
  .get(passport.authenticate("jwt"), (req, res) => {
    const locale = req.headers["accept-language"];
    const query = { status: "live", source: req.user._id };
    const sort = { column: req.query.column, order: req.query.order };
    const { title, ques, ans, topic, jamia, translation } = req.query;
    title && (query[`title.${locale}`] = RegExp(title));
    ques && (query[`ques.${locale}`] = RegExp(ques));
    ans && (query[`ans.${locale}`] = RegExp(ans));
    topic && (query[`topic.${locale}`] = topic);
    translation &&
      (translation === "Manual"
        ? (query.translation = "manual")
        : (query.translation = "google translate"));
    if (locale === "bn-BD" || locale === "en-US") {
      Fatwa.find(query, "-status -meta -img")
        .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
        .then((fatwas) => {
          res.json(fatwas);
        })
        .catch((err) => {
          res.status(400).json("Error: " + err);
          console.log(err);
        });
    } else {
      res.status(400).json("No language selected or formation is wrong");
    }
  });

router.route("/fatwa/:id").get((req, res) => {
  Fatwa.findById(req.params.id)
    .then((fatwa) => res.json(fatwa))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/fatwa/edit/:id").patch((req, res) => {
  const query = { _id: req.params.id };
  req.newData = {
    link: {
      "bn-BD": req.body.title["bn-BD"].replace(/\s/g, "-"),
      "en-US": (req.body.title["en-US"] || titleEn).replace(/\s/g, "-"),
    },
    topic: req.body.topic,
    title: req.body.title,
    ques: req.body.ques,
    ans: req.body.ans,
    ref: req.body.ref,
    img: req.body.img,
    updated: new Date(),
  };
  Fatwa.findOneAndUpdate(query, req.newData, (err, doc) => {
    if (err) return res.status(400).json({ error: err });
    return res.send("successfully updated!");
  });
  // .then(() => res.json("fatwa updated"))
  // .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/source/fatwa").delete((req, res) => {
  Fatwa.findOneAndUpdate(req.body.fatwa, { status: "deleted" })
    .then(() =>
      Source.findByIdAndUpdate(req.body.source, { $inc: { fatwa: -1 } })
    )
    .then(() => res.json("successfully deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//---------------------------------------------USER QUESTION
router
  .route("/source/questionFeed/filter")
  .get(passport.authenticate("jwt"), (req, res) => {
    const sort = { column: req.query.column, order: req.query.order };
    UserQuestion.find({ answered: false })
      .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
      .then((questions) => {
        res.json(questions);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json("something went wrong");
      });
  });

//--------------------------------------------PROFILE
router
  .route("/jamia/edit/:_id")
  .patch(passport.authenticate("jwt"), (req, res) => {
    if (req.user.role !== "jamia") {
      res.status(403).json("unauthorized!");
      return;
    }
    if (Object.keys(req.body).length === 1) {
      Jamia.findOneAndUpdate({ _id: req.params._id }, req.body)
        .then((jamia) => {
          res.json("data successfully updated!");
        })
        .catch((err) => res.json(err));
    } else if (Object.keys(req.body).length === 3) {
      Jamia.findById(req.params._id)
        .then((jamia) => bcrypt.compare(req.body.oldPass, jamia.pass))
        .then((match) => {
          if (match) {
            Jamia.findOneAndUpdate(
              { _id: req.params._id },
              { pass: bcrypt.hashSync(req.body.newPass, 10) }
            )
              .then(() => res.json("password changed successfully"))
              .catch((err) => {
                res.status(500).json(err);
              });
          } else {
            res.status(401).json("Old password does not match");
          }
        })
        .catch((err) => res.status(500).json(err));
    }
  });

module.exports = router;
