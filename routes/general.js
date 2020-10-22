const { Fatwa, FatwaSubmitions } = require("../models/fatwaModel");
const { Jamia, JamiaSubmitions } = require("../models/jamiaModel");

const regEx = (input) => new RegExp(input.replace(" ", ".+"), "gi");
const signToken = (id, role) => {
  return jwt.sign(
    {
      iss: "fatwaArchive",
      sub: id,
      role: role,
    },
    process.env.JWT_SECRET
  );
};

router.route("/fatwa/:link").get((req, res) => {
  const locale = req.headers["accept-language"];
  locale === null;
  const key = `link.${locale}`;
  Fatwa.findOne({ [key]: req.params.link })
    .then((fatwa) => {
      if (fatwa === null) {
        res.json("nothing found");
        return;
      }
      const data = {
        _id: fatwa._id,
        added: fatwa.added,
        link: fatwa.link,
        topic: fatwa.topic[locale],
        title: fatwa.title[locale],
        ques: fatwa.ques[locale],
        ans: fatwa.ans[locale],
        jamia: fatwa.jamia,
        ref: fatwa.ref,
        img: fatwa.img,
        translation: fatwa.translation,
      };
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/search").get((req, res) => {
  const locale = req.headers["accept-language"];
  if (req.query.q && req.query.q.length > 0) {
    const query = new RegExp(req.query.q.replace(" ", ".+"), "gi");
    Fatwa.find({
      $or: [
        { ["title"[locale]]: query },
        { ["ques"[locale]]: query },
        { ["ans"[locale]]: query },
      ],
    })
      .then((fatwas) => {
        const dataToReturn = fatwas.sort((a, b) => {
          let c = 0;
          let d = 0;
          `${a.title[locale]} ${a.ques[locale]} ${a.ans[locale]}`
            .split(" ")
            .forEach((word) => req.query.q.includes(word) && (c += 1));
          `${b.title[locale]} ${b.ques[locale]} ${b.ans[locale]}`
            .split(" ")
            .forEach((word) => req.query.q.includes(word) && (d += 1));
          return c > d ? -1 : 1;
        });
        dataToReturn.length > 8 && (dataToReturn.length = 8);
        const dataToSend = dataToReturn.map((item) => {
          return {
            _id: item.id,
            link: item.link[locale],
            title: item.title[locale],
            ques: item.ques[locale],
            ans: item.ans[locale],
            jamia: item.jamia,
          };
        });
        res.json(dataToSend);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  } else {
    res.json("nope");
  }
});

router.route("/jamia/new").post((req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hashed) => {
      return new JamiaSubmitions({
        ...req.body,
        submitted: new Date(),
        password: hashed,
      });
    })
    .then((submition) => {
      submition.save();
    })
    .then(() => res.status(200).json("request submitted!"))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router
  .route("/login")
  .post(
    passport.authenticate("local", { session: false }),
    (req, res, next) => {
      if (req.isAuthenticated()) {
        let user = {};
        if (req.body.role === "jamia") {
          user = {
            name: req.user.name,
            applicant: req.user.applicant,
            fatwa: req.user.fatwa,
            _id: req.user._id,
            joined: req.user.joined,
            founder: req.user.founder,
            est: req.user.est,
            address: req.user.address,
            contact: req.user.contact,
            about: req.user.about,
            id: req.user.id,
            role: "jamia",
          };
        }
        const token = signToken(req.user.id, req.body.role);
        res.cookie("access_token", token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user });
      }
    }
  );

router
  .route("/logout")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log("this was called");
    res.clearCookie("access_token");
    res.json({ user: null, success: true });
  });

router.route("/authenticate").get(passport.authenticate("jwt"), (req, res) => {
  if (req.isAuthenticated()) {
    let user = {};
    if (req.user.est) {
      user = {
        name: req.user.name,
        applicant: req.user.applicant,
        fatwa: req.user.fatwa,
        _id: req.user._id,
        joined: req.user.joined,
        founder: req.user.founder,
        est: req.user.est,
        address: req.user.address,
        contact: req.user.contact,
        about: req.user.about,
        id: req.user.id,
        role: "jamia",
      };
    }
    res.status(200).json({ isAuthenticated: true, user });
  } else {
    console.log("things went to shit", req.isAuthenticated());
    res.status(500).json("something went wrong!");
  }
});

router.route("/validateId/:id").get((req, res) => {
  const id = req.params.id;
  Jamia.findOne({ id: id })
    .then((jamia) => {
      if (jamia) {
        res.status(400).json("id already exists.");
      } else {
        return;
      }
    })
    .then(() => JamiaSubmitions.findOne({ id: id }))
    .then((jamiaSubmitions) => {
      if (jamiaSubmitions) {
        res.status(400).json("id already exists.");
      } else {
        res.status(200).json("id is valid");
      }
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
