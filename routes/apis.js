const router = require("express").Router();
let Fatwa = require("../models/fatwaModel");

router.route("/allfatwa").get((req, res) => {
  Fatwa.find()
    .then((fatwas) => res.json(fatwas))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/fatwa/:id").delete((req, res) => {
  Fatwa.findByIdAndDelete(req.params.id)
    .then(() => res.json("Item Deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/fatwa/:id").get((req, res) => {
  Fatwa.findById(req.params.id)
    .then((fatwa) => res.json(fatwa))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/fatwa/add").post((req, res) => {
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
    .then(() => res.json("fatwa Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/fatwa/add/:id").patch((req, res) => {
  Fatwa.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      ques: req.body.ques,
      ans: req.body.ans,
      ref: req.body.ref,
      img: req.body.img,
      updated: new Date(),
    }
  )
    .then(() => res.json("fatwa updated"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/search").get((req, res) => {
  console.log(req.query);
  if (req.query.q && req.query.q.length > 0) {
    const query = new RegExp(req.query.q.replace(" ", ".+"), "gi");
    Fatwa.find({
      $or: [{ title: query }, { ques: query }, { ans: query }],
    }).then((fatwas) => {
      const dataToReturn = fatwas.sort((a, b) => {
        let c = 0;
        let d = 0;
        `${a.title} ${a.ques} ${a.ans}`
          .split(" ")
          .forEach((word) => req.query.q.includes(word) && (c += 1));
        `${b.title} ${b.ques} ${b.ans}`
          .split(" ")
          .forEach((word) => req.query.q.includes(word) && (d += 1));
        return c > d ? -1 : 1;
      });
      dataToReturn.length > 8 && (dataToReturn.length = 8);
      const dataToSend = dataToReturn.map((item) => {
        return {
          _id: item.id,
          title: item.title,
          ques: item.ques,
          ans: item.ans,
        };
      });
      res.json(dataToSend);
    });
  } else {
    res.json("nope");
  }
});

module.exports = router;
