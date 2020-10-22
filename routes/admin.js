// const { Fatwa, FatwaSubmitions } = require("../models/fatwaModel");
const { Jamia, JamiaSubmitions } = require("../models/jamiaModel");
// const { User, Session } = require("../models/userModel");
const fetch = require("node-fetch");

// fetch(
//   "http://66.45.237.70/api.php?username=knavekaiser&password=8H43ME25&number=8801989479749&message=$text"
// ).then((res) => console.log(res));

router.route("/allfatwa").get((req, res) => {
  const locale = req.headers["accept-language"];
  if (locale.length > 5) {
    res.status(400).json("No language selected or formation is wrong");
    return;
  }
  Fatwa.find()
    .then((fatwas) => {
      if (fatwas.length === 0) {
        res.json(fatwas);
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
          link: fatwa.link[locale],
          topic: fatwa.topic[locale],
          title: fatwa.title[locale],
          ques: fatwa.ques[locale],
          ans: fatwa.ans[locale],
          jamia: fatwa.jamia,
          translation: fatwa.translation,
        };
      });
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/allfatwa/filter").get((req, res) => {
  console.log(Fatwa);
  const locale = req.headers["accept-language"];
  const query = {};
  const sort = { column: req.query.column, order: req.query.order };
  req.query.title && (query[`title.${locale}`] = regEx(req.query.title));
  req.query.question && (query[`ques.${locale}`] = regEx(req.query.question));
  req.query.answer && (query[`ans.${locale}`] = regEx(req.query.answer));
  req.query.topic && (query[`topic.${locale}`] = req.query.topic);
  req.query.jamia && (query.jamia = req.query.jamia);
  if (locale.length > 5) {
    res.status(400).json("No language selected or formation is wrong");
    return;
  }
  Fatwa.find(query)
    .then((fatwas) => {
      if (fatwas.length === 0) {
        res.json([]);
        return;
      }
      if (fatwas[0].link[locale] === undefined) {
        res.status(404).json("nothing found in given language");
        return;
      }
      const data = fatwas
        .map((fatwa) => {
          return {
            _id: fatwa._id,
            added: fatwa.added,
            link: fatwa.link[locale],
            topic: fatwa.topic[locale],
            title: fatwa.title[locale],
            ques: fatwa.ques[locale],
            ans: fatwa.ans[locale],
            jamia: fatwa.jamia,
            translation: fatwa.translation,
          };
        })
        .sort((a, b) => {
          if (a[sort.column] < b[sort.column]) {
            return sort.order === "des" ? 1 : -1;
          } else {
            return sort.order === "des" ? -1 : 1;
          }
        });
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
      console.log(err);
    });
});
router.route("/fatwa/:id").delete((req, res) => {
  Fatwa.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Item Deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/fatwaSubmitions/filter").get((req, res) => {
  res.status(500).json([]);
});

router.route("/jamia/submitions/filter").get((req, res) => {
  const locale = req.headers["accept-language"];
  const query = {};
  const sort = { column: req.query.column, order: req.query.order };
  if (locale.length > 5) {
    res.status(400).json("No language selected or formation is wrong");
    return;
  }
  JamiaSubmitions.find()
    .then((submitions) => {
      if (submitions.length === 0) {
        res.json([]);
        return;
      }
      const data = submitions
        .map((jamia) => {
          return {
            _id: jamia._id,
            submitted: jamia.submitted,
            name: jamia.name,
            founder: jamia.founder,
            est: jamia.est,
            address: jamia.address,
            contact: jamia.contact,
            about: jamia.about,
            id: jamia.id,
            applicant: jamia.applicant,
          };
        })
        .sort((a, b) => {
          if (a[sort.column] < b[sort.column]) {
            return sort.order === "des" ? 1 : -1;
          } else {
            return sort.order === "des" ? -1 : 1;
          }
        });
      res.json(data);
    })
    .catch((err) => res.status(400).json(err));
});
router.route("/jamia/accept/:_id").post((req, res) => {
  JamiaSubmitions.findById(req.params._id)
    .then((jamia) => {
      const newJamia = new Jamia({
        joined: new Date(),
        fatwa: 0,
        name: jamia.name,
        founder: jamia.founder,
        est: jamia.est,
        address: jamia.address,
        contact: jamia.contact,
        about: jamia.about,
        id: jamia.id,
        password: jamia.password,
        applicant: jamia.applicant,
      });
      return newJamia;
    })
    .then((jamiaToBeAdded) => jamiaToBeAdded.save())
    .then(() => JamiaSubmitions.findByIdAndDelete(req.params._id))
    .then(() => console.log("send confirmation message here"))
    .then(() => res.status(200).json("Jamia successfully accepted"))
    .catch((err) => {
      res.status(500).json("somthing went wrong " + err);
      console.log(err);
    });
});
router.route("/jamia/active/filter").get((req, res) => {
  Jamia.find()
    .then((jamias) => {
      const data = jamias.map((jamia) => {
        return {
          _id: jamia._id,
          joined: jamia.joined,
          fatwa: jamia.fatwa,
          name: jamia.name,
          founder: jamia.founder,
          est: jamia.est,
          address: jamia.address,
          contact: jamia.contact,
          about: jamia.about,
          id: jamia.id,
          applicant: jamia.applicant,
        };
      });
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(err));
});
router.route("/jamia/reject/:_id").delete((req, res) => {
  JamiaSubmitions.findByIdAndDelete(req.params._id)
    .then(() => res.status(200).json("Jamia Submition deleted!"))
    .catch((err) => {
      res.json(err);
    });
});
router.route("/jamia/edit/:_id").patch((req, res) => {
  console.log(req.params._id, Object.keys(req.body));
  if (Object.keys(req.body).length === 1) {
    Jamia.findOneAndUpdate({ _id: req.params._id }, req.body)
      .then((jamia) => {
        res.json("data successfully updated!");
      })
      .catch((err) => res.json(err));
  } else if (Object.keys(req.body).length === 3) {
    console.log(req.body);
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

router.route("/patreons/filter").get((req, res) => {
  res.status(500).json([{ _id: 235252, item: "make patreons stuff" }]);
});
router.route("/userReview/filter").get((req, res) => {
  res.status(500).json([{ _id: 235252, item: "make userReview stuff" }]);
});

module.exports = router;
