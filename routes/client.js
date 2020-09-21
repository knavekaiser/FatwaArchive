const router = require("express").Router();
let Fatwa = require("../models/fatwaModel");

router.route("/search").get((req, res) => {
  const query = req.query;
  // res.json(query);
  res.send(JSON.stringify(query));
  console.log(req.query);
});

module.exports = router;
