//-------------------------------NEW FATWA
router
  .route("/source/newFatwa")
  .post(passport.authenticate("SourceAuth"), (req, res) => {
    const { topic, title, ques, ans, ref, img, meta } = req.body;
    if (!title["en-US"] && !ques["en-US"] && !ans["en-US"]) {
      TranslateAll([title["bn-BD"], ques["bn-BD"], ans["bn-BD"]], true)
        .then((translations) => {
          return new Fatwa({
            topic: topic,
            link: {
              "bn-BD": title["bn-BD"].replace(/\s/g, "-"),
              "en-US": translations[0].replace(/\s/g, "-"),
            },
            title: { "bn-BD": title["bn-BD"], "en-US": translations[0] },
            ques: { "bn-BD": ques["bn-BD"], "en-US": translations[1] },
            ans: { "bn-BD": ans["bn-BD"], "en-US": translations[2] },
            ref: ref,
            img: img,
            meta: meta,
            translation: false,
            source: req.user._id,
          });
        })
        .then((newFatwa) => newFatwa.save())
        .then(() => res.send({ code: "ok", message: "fatwa added" }))
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            res.status(400).json({
              code: err.code,
              field: Object.keys(err.keyValue)[0],
            });
          } else {
            res
              .status(400)
              .json({ code: 500, message: "something went wrong" });
          }
        });
    } else {
      newFatwa = new Fatwa({
        topic: req.body.topic,
        title: title,
        ques: ques,
        ans: ans,
        ref: ref,
        img: img,
        meta: meta,
        source: req.user._id,
        translation: true,
      })
        .save()
        .then(() => res.send({ code: "ok", message: "fatwa added" }))
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            res.status(400).json({
              code: err.code,
              field: Object.keys(err.keyValue)[0],
            });
          } else {
            res
              .status(400)
              .json({ code: 500, message: "something went wrong" });
          }
        });
    }
  });
router
  .route("/source/editSubmission/:_id")
  .patch(passport.authenticate("SourceAuth"), (req, res) => {
    const newData = {
      translation:
        req.body["title.en-US"] &&
        req.body["ques.en-US"] &&
        req.body["ans.en-US"]
          ? true
          : false,
      ...(req.body["title.bn-BD"] && {
        ["link.bn-BD"]: req.body["title.bn-BD"].replace(/\s/g, "-"),
      }),
      ...(req.body["title.en-US"] && {
        ["link.en-US"]: req.body["title.en-US"].replace(/\s/g, "-"),
      }),
      ...req.body,
      status: "pending",
    };
    if (ObjectID.isValid(req.params._id)) {
      Fatwa.findByIdAndUpdate(req.params._id, newData)
        .then(() => {
          res.json({ code: "ok", message: "updated" });
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(400).json({
              code: err.code,
              field: Object.keys(err.keyValue)[0],
            });
          } else {
            res
              .status(500)
              .json({ code: 500, message: "something went wrong" });
          }
        });
    } else {
      res.status(400).json({ code: 400, message: "invalid id" });
    }
  });
router
  .route("/source/fatwaSubmissions/filter")
  .get(passport.authenticate("SourceAuth"), (req, res) => {
    const locale = req.headers["accept-language"];
    const query = {
      $or: [{ status: "pending" }, { status: "pendingEdit" }],
      source: req.user._id,
    };
    const sort = { column: req.query.column, order: req.query.order };
    req.query.title && (query[`title.${locale}`] = RegExp(req.query.title));
    req.query.question &&
      (query[`ques.${locale}`] = RegExp(req.query.question));
    req.query.answer && (query[`ans.${locale}`] = RegExp(req.query.answer));
    req.query.topic && (query[`topic.${locale}`] = req.query.topic);
    Fatwa.find(query)
      .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
      .then((submissions) => {
        res.json({ code: "ok", data: submissions });
      })
      .catch((err) =>
        res.status(500).json({ code: 500, message: "something went wrong" })
      );
  });
router.route("/fatwaSubmissions/:_id").delete((req, res) => {
  if (ObjectID.isValid(req.params._id)) {
    Fatwa.findByIdAndDelete(req.params._id)
      .then(() => res.json("successfully deleted"))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    res.status(400).json("invalid id");
  }
});

//----------------------------------------------ALL FATWA
router
  .route("/source/allfatwa/filter")
  .get(passport.authenticate("SourceAuth"), (req, res) => {
    const locale = req.headers["accept-language"];
    const query = { status: "live", source: req.user._id };
    const sort = { column: req.query.column, order: req.query.order };
    const { title, ques, ans, topic, translation } = req.query;
    title && (query[`title.${locale}`] = RegExp(title));
    ques && (query[`ques.${locale}`] = RegExp(ques));
    ans && (query[`ans.${locale}`] = RegExp(ans));
    topic && (query[`topic.${locale}`] = topic);
    (translation === "Auto" || translation === "গুগল") &&
      (query.translation = false);
    (translation === "Manual" || translation === "ব্যক্তি") &&
      (query.translation = true);
    if (locale === "bn-BD" || locale === "en-US") {
      Fatwa.find(query, "-status -img")
        .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
        .then((fatwas) => {
          res.json({ code: "ok", data: fatwas });
        })
        .catch((err) => {
          res.status(500).json({ code: 500, message: "something went wrong" });
          console.log(err);
        });
    } else {
      res.status(400).json({
        code: 400,
        message: "No language selected or formation is wrong",
      });
    }
  });
router
  .route("/fatwa/:_id")
  .get(passport.authenticate("SourceAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
      Fatwa.findById(req.params._id)
        .then((fatwa) => res.json(fatwa))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      res.status(400).json({ code: 400, message: "invalid id" });
    }
  });
router
  .route("/source/editFatwa/:_id")
  .patch(passport.authenticate("SourceAuth"), (req, res) => {
    const newData = {
      translation:
        req.body["title.en-US"] &&
        req.body["ques.en-US"] &&
        req.body["ans.en-US"]
          ? true
          : false,
      ...(req.body["title.bn-BD"] && {
        ["link.bn-BD"]: req.body["title.bn-BD"].replace(/\s/g, "-"),
      }),
      ...(req.body["title.en-US"] && {
        ["link.en-US"]: req.body["title.en-US"].replace(/\s/g, "-"),
      }),
      ...req.body,
      status: req.user.verified ? "live" : "pendingEdit",
    };
    if (ObjectID.isValid(req.params._id)) {
      Fatwa.findByIdAndUpdate(req.params._id, newData)
        .then(() => Source.updateFatwaCount(req.user._id))
        .then(() => {
          res.json({ code: "ok", message: "updated" });
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(400).json({
              code: err.code,
              field: Object.keys(err.keyValue)[0],
            });
          } else {
            res
              .status(500)
              .json({ code: 500, message: "something went wrong" });
          }
        });
    } else {
      res.status(400).json({ code: 400, message: "invalid id" });
    }
  });
router
  .route("/source/fatwa")
  .delete(passport.authenticate("SourceAuth"), (req, res) => {
    if (ObjectID.isValid(req.body.fatwa)) {
      Fatwa.findById(req.body.fatwa)
        .then((fatwa) => new DeletedFatwa({ ...fatwa }).save())
        .then(() => Fatwa.findByIdAndDelete(req.body.fatwa))
        .then(() => Source.updateFatwaCount(req.user._id))
        .then(() => {
          res.json({ code: "ok", message: "fatwa successfully deleted" });
        })
        .catch((err) => {
          res.status(500).json({ code: 500, message: "something went wrong" });
        });
    } else {
      res.status(400).json({ code: 400, message: "invalid id" });
    }
  });

//---------------------------------------------USER QUESTION
router
  .route("/source/questionFeed/filter")
  .get(passport.authenticate("SourceAuth"), (req, res) => {
    const sort = { column: req.query.column, order: req.query.order };
    UserQuestion.find({
      $or: [{ status: "pending" }, { status: "pendingApproval" }],
    })
      .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
      .then((questions) => res.json(questions))
      .catch((err) => {
        console.log(err);
        res.status(500).json("something went wrong");
      });
  });
router
  .route("/source/userQues/:_id")
  .get(passport.authenticate("SourceAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
      UserQuestion.findById(req.params._id)
        .populate("ans.source reports.source", "name add")
        .then((ques) => {
          if (ques) {
            res.json({ code: "ok", content: ques });
          } else {
            res.status(404).json({ code: 404, message: "question not found" });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json("something went wrong");
        });
    } else {
      res.status(400).json("invalid id");
    }
  });
router
  .route("/source/userQues/answer/:_id")
  .post(passport.authenticate("SourceAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
      UserQuestion.findById(req.params._id)
        .then((ques) => {
          const newAns = {
            source: req.user._id,
            topic: req.body.topic,
            title: req.body.title,
            body: req.body.body,
            ref: req.body.ref,
            meta: req.body.meta,
          };
          console.log(newAns);
          return ques.addAns(newAns);
        })
        .then(() =>
          UserQuestion.findOne({ _id: req.params._id }).populate(
            "ans.source",
            "name primeMufti"
          )
        )
        .then((saved) => res.status(200).json({ code: "ok", content: saved }))
        .catch((err) => {
          if (err.code === 11000) {
            res.status(400).json(err);
          } else {
            console.log(err);
            res.status(500).json({ code: 500, message: "enternal error" });
          }
        });
    } else {
      res.status(400).json("invalid id");
    }
  });
router
  .route("/source/userQues/answer/:_id")
  .delete(passport.authenticate("SourceAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
      if (req.user._id.toString() === req.body.source.toString()) {
        UserQuestion.findById(req.params._id)
          .populate("ans.source", "name primeMufti")
          .then((ques) => ques.dltAns(req.body))
          .then((saved) => {
            res.json({ code: "ok", content: saved });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json("internal error");
          });
      } else {
        res.status(403).json("forbidden");
      }
    } else {
      res.status(400).json("invalid id");
    }
  });
router
  .route("/source/userQues/vote/:_id")
  .put(passport.authenticate("SourceAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
      UserQuestion.findById(req.params._id)
        .populate("ans.source", "name primeMufti")
        .then((ques) => ques.vote(req.body))
        .then((saved) => {
          res.json({ code: "ok", content: saved });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json("internal error");
        });
    } else {
      res.status(400).json("invalid id");
    }
  });
router
  .route("/source/reportUserQues/:_id")
  .post(passport.authenticate("SourceAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
      UserQuestion.findById(req.params._id)
        .then((ques) => {
          if (ques) {
            const newReport = {
              source: req.user._id,
              message: { subject: req.body.subject, body: req.body.message },
            };
            return ques.report(newReport);
          } else {
            res.status(400).json("question did not found");
            return;
          }
        })
        .then(() => {
          res.json({ code: "ok", message: "successfully reported" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json("internal error");
        });
    } else {
      res.status(400).json("invalid id");
    }
  });

//--------------------------------------------PROFILE
router
  .route("/source/edit")
  .patch(passport.authenticate("SourceAuth"), (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length === 1) {
      Source.findByIdAndUpdate(req.user._id, req.body)
        .then((source) => {
          console.log(source);
          res.json("data successfully updated!");
        })
        .catch((err) => res.json(err));
    } else if (Object.keys(req.body).length === 3) {
      Source.findById(req.user._id)
        .then((source) => {
          if (bcrypt.compareSync(req.body.oldPass, source.pass)) {
            Source.findOneAndUpdate(
              { _id: req.user._id },
              { pass: bcrypt.hashSync(req.body.newPass, 10) }
            )
              .then(() => res.json("password changed successfully"))
              .catch((err) => {
                res.status(500).json(err);
              });
          } else {
            res.status(403).json("Old password does not match");
          }
        })
        .catch((err) => res.status(500).json(err));
    }
  });

module.exports = router;
