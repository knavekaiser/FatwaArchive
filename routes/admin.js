const router = require("express").Router();
let Fatwa = require("../models/fatwaModel");

router.route("/allfatwa").get((req, res) => {
  Fatwa.find()
    .then((fatwas) => res.json(fatwas))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const newFatwa = new Fatwa({
    added: new Date(),
    title: req.body.title,
    ques: req.body.ques,
    ans: req.body.ans,
    ref: req.body.ref,
    img: req.body.img,
    updated: new Date(),
  });
  newFatwa
    .save()
    .then(() => res.send(req.body))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
