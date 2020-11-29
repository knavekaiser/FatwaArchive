const { Fatwa, FatwaSubmitions } = require("../models/fatwaModel");
const { Jamia, JamiaSubmitions } = require("../models/jamiaModel");
const { User } = require("../models/userModel");
const { UserQuestion } = require("../models/userSubmitionModel");

router.route("/fatwa/new").post(passport.authenticate("jwt"), (req, res) => {
  const { title, ques, ans } = req.body;
  const newFatwaSubmition = new FatwaSubmitions({
    topic: req.body.topic,
    title: {
      "bn-BD": title,
      "en-US": req.body.titleEn,
    },
    ques: {
      "bn-BD": ques,
      "en-US": req.body.quesEn,
    },
    ans: {
      "bn-BD": ans,
      "en-US": req.body.ansEn,
    },
    added: new Date(),
    ref: req.body.ref,
    img: req.body.img,
    jamia: req.body.jamia,
    updated: new Date(),
    translation: req.body.titleEn ? "manual" : "google translate",
  });
  newFatwaSubmition
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
  .route("/jamia/fatwaSubmitions/filter")
  .get(passport.authenticate("jwt"), (req, res) => {
    if (req.user.role !== "jamia") return res.status(403).json("unauthorized");
    const locale = req.headers["accept-language"];
    const query = { jamia: req.user.id };
    const sort = { column: req.query.column, order: req.query.order };
    req.query.title && (query[`title.${locale}`] = RegExp(req.query.title));
    req.query.question &&
      (query[`ques.${locale}`] = RegExp(req.query.question));
    req.query.answer && (query[`ans.${locale}`] = RegExp(req.query.answer));
    req.query.topic && (query[`topic.${locale}`] = req.query.topic);
    FatwaSubmitions.find(query)
      .sort(`${sort.order === "asc" ? "-" : ""}${sort.column}`)
      .then((submitions) => {
        if (submitions.length === 0) {
          res.json([]);
          return;
        }
        res.json(submitions);
      })
      .catch((err) => res.status(400).json(err));
  });
router.route("/fatwaSubmitions/:_id").delete((req, res) => {
  FatwaSubmitions.findByIdAndDelete(req.params._id)
    .then(() => res.json("successfully deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router
  .route("/jamia/allfatwa/filter")
  .get(passport.authenticate("jwt"), (req, res) => {
    const locale = req.headers["accept-language"];
    const query = { jamia: req.user.id };
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
    if (locale.length > 5) {
      res.status(400).json("No language selected or formation is wrong");
      return;
    }
    Fatwa.find(query)
      .sort(`${sort.order === "asc" ? "-" : ""}${sort.column}`)
      .then((fatwas) => {
        if (fatwas.length === 0) {
          res.json([]);
          return;
        }
        if (fatwas[0].link[locale] === undefined) {
          res.status(404).json("nothing found in given language");
          return;
        }
        const data = fatwas.map((fatwa) => {
          return {
            _id: fatwa._id,
            added: fatwa.added,
            link: fatwa.link,
            topic: fatwa.topic,
            title: fatwa.title,
            ques: fatwa.ques,
            ans: fatwa.ans,
            jamia: fatwa.jamia,
            ref: fatwa.ref,
            translation: fatwa.translation,
          };
        });
        res.json(data);
      })
      .catch((err) => {
        res.status(400).json("Error: " + err);
        console.log(err);
      });
  });

router
  .route("/jamia/questionFeed/filter")
  .get(passport.authenticate("jwt"), (req, res) => {
    const sort = { column: req.query.column, order: req.query.order };
    UserQuestion.find({ answered: false })
      .sort(`${sort.order === "asc" ? "-" : ""}${sort.column}`)
      .then((questions) => {
        res.json(questions);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json("something went wrong");
      });
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
router.route("/fatwa/:_id").delete((req, res) => {
  Fatwa.findByIdAndDelete(req.params._id)
    .then(() => res.json("successfully deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router
  .route("/fatwaLive/filter?")
  .get(passport.authenticate("jwt"), (req, res) => {
    Fatwa.find({ id: req.user.id }).then((fatwas) => {
      if (fatwas.length === 0) {
        res.json([]);
        return;
      }
      const data = fatwas.sort((a, b) => {
        if (a[sort.column] < b[sort.column]) {
          return sort.order === "des" ? 1 : -1;
        } else {
          return sort.order === "des" ? -1 : 1;
        }
      });
      res.json(data);
    });
    res.json([]);
  });

router.route("/edit/:_id").patch(passport.authenticate("jwt"), (req, res) => {
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
      .then((jamia) => bcrypt.compare(req.body.oldPass, jamia.password))
      .then((match) => {
        if (match) {
          Jamia.findOneAndUpdate(
            { _id: req.params._id },
            { password: bcrypt.hashSync(req.body.newPass, 10) }
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
