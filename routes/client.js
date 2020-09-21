const router = require("express").Router();
let Fatwa = require("../models/fatwaModel");

router.route("/search").get((req, res) => {
  const query = new RegExp(req.query.q, "gi");
  Fatwa.find({ title: query }).then((fatwas) => res.json(fatwas));
});

module.exports = router;
