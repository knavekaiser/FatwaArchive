const { Fatwa, FatwaSubmitions } = require("../models/fatwaModel");
const { Jamia, JamiaSubmitions } = require("../models/jamiaModel");
const { User } = require("../models/userModel");
const { Translate } = require("@google-cloud/translate").v2;
const CREDENTIALS = JSON.parse(process.env.GOOGLE_API_CREDENTIAL);
const translate = new Translate({
  credentials: CREDENTIALS,
  project_id: CREDENTIALS.project_id,
});

router.route("/fatwa/add").post((req, res) => {
  const { title, ques, ans } = req.body;
  let titleEn = "Something went wrong with translation " + Math.random(),
    quesEn = "Something went wrong with translation " + Math.random(),
    ansEn = "Something went wrong with translation " + Math.random();
  Promise.all([
    // translate.translate([title, ques, ans], "en").then((translation) => {
    //   [titleEn, quesEn, ansEn] = translation[0];
    // }),
  ])
    .then(() => {
      const data = {
        link: {
          "bn-BD": req.body.title.replace(/\s/g, "-"),
          "en-US": (req.body.titleEn || titleEn).replace(/\s/g, "-"),
        },
        topic: {
          "bn-BD": req.body.topic,
          "en-US": req.body.topicEn,
        },
        title: {
          "bn-BD": title,
          "en-US": req.body.titleEn || titleEn,
        },
        ques: {
          "bn-BD": ques,
          "en-US": req.body.quesEn || quesEn,
        },
        ans: {
          "bn-BD": ans,
          "en-US": req.body.ansEn || ansEn,
        },
      };
      return new Fatwa({
        added: new Date(),
        ref: req.body.ref,
        img: req.body.img,
        jamia: req.body.jamia,
        updated: new Date(),
        translation: req.body.titleEn ? "manual" : "google translate",
        ...data,
      });
    })
    .then((fatwa) => fatwa.save())
    .then(() => res.send("fatwa added"))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ err });
    });
});
router.route("/fatwa/add/:id").get((req, res) => {
  Fatwa.findById(req.params.id)
    .then((fatwa) => res.json(fatwa))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/fatwa/add/:id").patch((req, res) => {
  const query = { _id: req.params.id };
  req.newData = {
    link: {
      "bn-BD": req.body.title.replace(/\s/g, "-"),
      "en-US": (req.body.titleEn || titleEn).replace(/\s/g, "-"),
    },
    topic: {
      "bn-BD": req.body.topic,
      "en-US": req.body.topicEn,
    },
    title: {
      "bn-BD": req.body.title,
      "en-US": req.body.titleEn,
    },
    ques: {
      "bn-BD": req.body.ques,
      "en-US": req.body.quesEn,
    },
    ans: {
      "bn-BD": req.body.ans,
      "en-US": req.body.ansEn,
    },
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

module.exports = router;
