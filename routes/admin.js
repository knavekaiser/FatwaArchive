// router
//   .route("/admin/fatwa/new")
//   .post(passport.authenticate("AdminAuth"), (req, res) => {
//     const { title, ques, ans } = req.body;
//     console.log("fatwa add is called");
//     let titleEn = "Something went wrong with translation " + Math.random(),
//       quesEn = "Something went wrong with translation " + Math.random(),
//       ansEn = "Something went wrong with translation " + Math.random();
//     Promise.all([
//       // translate.translate([title, ques, ans], "en").then((translation) => {
//       //   [titleEn, quesEn, ansEn] = translation[0];
//       // }),
//     ])
//       .then(() => {
//         const data = {
//           link: {
//             "bn-BD": req.body.title.replace(/\s/g, "-"),
//             "en-US": (req.body.titleEn || titleEn).replace(/\s/g, "-"),
//           },
//           topic: {
//             "bn-BD": req.body.topic,
//             "en-US": req.body.topicEn,
//           },
//           title: {
//             "bn-BD": title,
//             "en-US": req.body.titleEn || titleEn,
//           },
//           ques: {
//             "bn-BD": ques,
//             "en-US": req.body.quesEn || quesEn,
//           },
//           ans: {
//             "bn-BD": ans,
//             "en-US": req.body.ansEn || ansEn,
//           },
//         };
//         return new FatwaSubmissions({
//           added: new Date(),
//           ref: req.body.ref,
//           img: req.body.img,
//           jamia: req.body.jamia,
//           updated: new Date(),
//           translation: req.body.titleEn ? "manual" : "google translate",
//           ...data,
//         });
//       })
//       .then((fatwa) => fatwa.save())
//       .then(() => res.send("fatwa added"))
//       .catch((err) => {
//         console.log(err);
//         res.status(400).json({ err });
//       });
//   });

//----------------------------------FATWA
router
  .route("/admin/allfatwa/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const locale = req.headers["accept-language"];
    const query = { status: "live" };
    const sort = { column: req.query.column, order: req.query.order };
    req.query.title && (query[`title.${locale}`] = RegExp(req.query.title));
    req.query.question &&
      (query[`ques.${locale}`] = RegExp(req.query.question));
    req.query.answer && (query[`ans.${locale}`] = RegExp(req.query.answer));
    req.query.topic && (query[`topic.${locale}`] = req.query.topic);
    req.query.jamia && (query.jamia = req.query.jamia);
    if (locale.length > 5) {
      res.status(400).json("No language selected or formation is wrong");
      return;
    }
    Fatwa.find(query)
      .populate("source", "name primeMufti role")
      .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
      .then((fatwas) => {
        res.json(fatwas);
      })
      .catch((err) => {
        res.status(400).json("Error: " + err);
        console.log(err);
      });
  });
router
  .route("/admin/fatwa/")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    Fatwa.findByIdAndDelete(req.body.fatwa)
      .then(() =>
        Source.findByIdAndUpdate(req.body.source, { $inc: { fatwa: -1 } })
      )
      .then(() => res.status(200).json("Item Deleted!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
router
  .route("/admin/fatwaSubmissions/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    if (req.user.role !== "admin") return res.status("403").json("forbidden");
    const locale = req.headers["accept-language"];
    const query = { $or: [{ status: "pending" }, { status: "pendingEdit" }] };
    const sort = { column: req.query.column, order: req.query.order };
    req.query.title && (query[`title.${locale}`] = RegExp(req.query.title));
    req.query.question &&
      (query[`ques.${locale}`] = RegExp(req.query.question));
    req.query.answer && (query[`ans.${locale}`] = RegExp(req.query.answer));
    req.query.topic && (query[`topic.${locale}`] = req.query.topic);
    req.query.jamia && (query.jamia = req.query.jamia);
    Fatwa.find(query)
      .populate("source", "name primeMufti role")
      .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
      .then((submissions) => {
        if (submissions.length === 0) {
          res.json([]);
          return;
        }
        res.json(submissions);
      })
      .catch((err) => res.status(500).json(err));
  });
router
  .route("/admin/fatwaSubmissions/accept/:_id")
  .post(passport.authenticate("AdminAuth"), (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json("forbidden");
    if (ObjectID.isValid(req.params._id)) {
      Fatwa.findByIdAndUpdate(req.params._id, { status: "live" })
        .then((fatwa) =>
          Source.findByIdAndUpdate(fatwa.source, {
            $inc: { fatwa: 1 },
          })
        )
        .then(() => res.send({ code: "ok", message: "fatwa added" }))
        .catch((err) => {
          console.log(err);
          res.status(500).json({ code: 500, message: "something went wrong" });
        });
    } else {
      res.status(400).json({ code: 400, message: "invalid id" });
    }
  });
router
  .route("/admin/fatwaSubmissions/remove/:_id")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    FatwaSubmission.findByIdAndDelete(req.params._id)
      .then(() => {
        res.json("submission successfully deleted.");
      })
      .catch((err) => res.status(500).json(err));
  });

//----------------------------------UESR QUESTION
router
  .route("/admin/questionFeed/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
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
  .route("/admin/userQues/:_id")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
      UserQuestion.findById(req.params._id)
        .populate("ans.source reports.source", "name add")
        .then((ques) => res.json({ code: "ok", content: ques }))
        .catch((err) => {
          console.log(err);
          res.status(500).json("something went wrong");
        });
    } else {
      res.status(400).json("invalid id");
    }
  });
router
  .route("/admin/userQues/approveAns/:_id")
  .post(passport.authenticate("AdminAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id) && ObjectID.isValid(req.body.ans_id)) {
      UserQuestion.findById(req.params._id)
        .then((ques) => ques.approveAns(req.body.ans_id))
        .then((data) => {
          res.json({ code: "ok", message: "answer approved" });
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
  .route("/admin/userQues/answer/:_id")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
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
      res.status(400).json("invalid id");
    }
  });

//----------------------------------NEW SOURCE
router
  .route("/admin/sources/submissions/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const locale = req.headers["accept-language"];
    const query = { status: "pending" };
    req.query.role && (query.role = RegExp(req.query.role));
    const sort = { column: req.query.column, order: req.query.order };
    if (locale.length > 5) {
      res.status(400).json("No language selected or formation is wrong");
      return;
    }
    Jamia.find(query)
      .select("-pass -type")
      .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
      .then((submissions) => {
        if (submissions.length === 0) {
          res.json([]);
          return;
        }
        res.json(submissions);
      })
      .catch((err) => res.status(400).json(err));
  });

//----------------------------------JAMIA
router
  .route("/admin/source/accept")
  .post(passport.authenticate("AdminAuth"), (req, res) => {
    Jamia.findByIdAndUpdate(req.body._id, {
      status: "active",
      joined: new Date(),
    })
      .then((source) => {
        const message = encodeURI(`আপনার আবেদন গৃহীত হয়েছে । ফতোয়া আর্কাইভ`);
        return fetch(
          `http://api.greenweb.com.bd/api.php/?token=${process.env.SMS_TOKEN}&to=${source.appl.mob}&message=${message}`,
          { method: "POST" }
        );
      })
      .then(() => res.status(200).json("Jamia successfully accepted"))
      .catch((err) => {
        res.status(500).json("somthing went wrong " + err);
        console.log(err);
      });
  });
router
  .route("/admin/sources/active/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const query = { status: "active" };
    const sort = { column: req.query.column, order: req.query.order };
    req.query.role && (query.role = RegExp(req.query.role));
    Jamia.find(query)
      .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
      .select("-pass -type")
      .then((sources) => {
        res.status(200).json(sources);
      })
      .catch((err) => res.status(400).json(err));
  });
router
  .route("/admin/source/reject")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    Jamia.findByIdAndDelete(req.body._id)
      .then(() => res.status(200).json("Jamia Submission deleted!"))
      .catch((err) => {
        res.json(err);
      });
  });
router
  .route("/admin/source/edit/:_id")
  .patch(passport.authenticate("AdminAuth"), (req, res) => {
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
router
  .route("/admin/source")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    Jamia.findByIdAndDelete(req.body._id)
      .then(() => res.json("jamia successfully deleted"))
      .catch((err) => res.status(500).json(err));
  });

//-----------------------------------USER SUBMITIONS
router.route("/admin/userQuestion/filter").get((req, res) => {
  const query = {};
  req.query.name && (query.name = req.query.name);
  const sort = { column: req.query.column, order: req.query.order };
  UserQuestion.find(query)
    .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
    .then((questions) => {
      if (questions.length === 0) {
        res.json([]);
        return;
      }
      res.json(questions);
    });
});
router.route("/admin/removeUserQuestion").delete((req, res) => {
  UserQuestion.findByIdAndDelete(req.body._id)
    .then(() => {
      res.json("question successfully deleted");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("something went wrong");
    });
});

//-----------------------------------MORE
router.route("/patreons/filter").get((req, res) => {
  res.status(503).json([{ _id: 235252, item: "make patreons stuff" }]);
});
router.route("/userReview/filter").get((req, res) => {
  res.status(503).json([{ _id: 235252, item: "make userReview stuff" }]);
});

module.exports = router;
