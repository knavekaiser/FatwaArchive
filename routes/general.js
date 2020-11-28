const { Fatwa, FatwaSubmitions } = require("../models/fatwaModel");
const {
  Jamia,
  JamiaSubmitions,
  PassRecoveryToken,
} = require("../models/jamiaModel");
const { UserQuestion, ReportFatwa } = require("../models/userSubmitionModel");
const fetch = require("node-fetch");

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
const genCode = (n) => {
  code = "";
  while (code.length < n) {
    code += Math.ceil(Math.random() * 9);
  }
  return code;
};

router.route("/fatwa/:link").get((req, res) => {
  const locale = req.headers["accept-language"];
  if (locale.length > 5) return res.status(400).json("No language selected.");
  const key = `link.${locale}`;
  let result = null;
  Fatwa.findOne({ [key]: req.params.link })
    .then((fatwa) => {
      if (fatwa === null) {
        res.json("nothing found");
        return;
      }
      result = {
        _id: fatwa._id,
        added: fatwa.added,
        link: fatwa.link,
        topic: fatwa.topic,
        title: fatwa.title,
        ques: fatwa.ques,
        ans: fatwa.ans,
        jamia: fatwa.jamia,
        ref: fatwa.ref,
        img: fatwa.img,
        translation: fatwa.translation,
      };
    })
    .then(() => Jamia.findOne({ id: result.jamia }))
    .then((jamia) => {
      const data = {
        ...result,
        jamia: {
          name: jamia.name,
          id: jamia.id,
        },
      };
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("Error: " + err);
    });
});
router.route("/search").get((req, res) => {
  const locale = req.headers["accept-language"];
  if (req.query.q && req.query.q.length > 0) {
    const query = new RegExp(req.query.q.replace(" ", ".+"), "gi");
    Fatwa.find({
      $or: [
        { [`title.${locale}`]: query },
        { [`ques.${locale}`]: query },
        { [`ans.${locale}`]: query },
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
    res.status(400).json("nope");
  }
});
router.route("/searchSuggestions").get((req, res) => {
  const locale = req.headers["accept-language"];
  if (req.query.q && req.query.q.length > 0) {
    const query = new RegExp(req.query.q.replace(" ", ".+"), "gi");
    Fatwa.find({
      $or: [
        { [`title.${locale}`]: query },
        { [`ques.${locale}`]: query },
        { [`ans.${locale}`]: query },
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
            link: item.link[locale],
            title: item.title[locale],
          };
        });
        res.json(dataToSend);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  } else {
    res.status(400).json("nope");
  }
});

router.route("/askFatwa").post((req, res) => {
  new UserQuestion({
    ...req.body,
  })
    .save()
    .then(() => {
      res.status(200).json("test done");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.route("/reportFatwa").post((req, res) => {
  new ReportFatwa({ ...req.body })
    .save()
    .then((response) => {
      //here send the notification to jamia and admin.
      //then
      console.log(response);
      if (true) {
        res.json("report has been submitted");
      } else {
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("something went wrong");
    });
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

//----------------------------------JAMIA
router
  .route("/login")
  .post(
    passport.authenticate("local", { session: false }),
    (req, res, next) => {
      if (req.isAuthenticated()) {
        const user = {};
        let role;
        if (req.body.role === "jamia") {
          user.name = req.user.name;
          user.applicant = req.user.applicant;
          user.fatwa = req.user.fatwa;
          user.joined = req.user.joined;
          user.founder = req.user.founder;
          user.est = req.user.est;
          user.address = req.user.address;
          user.contact = req.user.contact;
          user.about = req.user.about;
          user.primeMufti = req.user.primeMufti;
          role = "jamia";
        }
        if (req.body.role === "admin") {
          user.firstName = req.user.firstName;
          user.lastName = req.user.lastName;
          user.email = req.user.email;
          user.mobile = req.user.mobile;
          role = "admin";
        }
        user.id = req.user.id;
        user._id = req.user._id;
        user.role = req.user.role;
        const token = signToken(req.user.id, role);
        res.cookie("access_token", token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user });
      }
    }
  );
router
  .route("/logout")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: null, success: true });
  });
router.route("/passRecovery").put((req, res) => {
  Jamia.findOne({ id: req.body.id }).then((jamia) => {
    if (jamia === null) {
      res.status(404).json("jamia not found");
    } else {
      const code = genCode(4);
      PassRecoveryToken.find({ id: req.body.id })
        .then((token) => {
          if (token) {
            return PassRecoveryToken.findOneAndDelete({ id: req.body.id });
          } else {
            return;
          }
        })
        .then(() => bcrypt.hash(code, 10))
        .then((hash) => {
          return new PassRecoveryToken({
            id: jamia.id,
            code: hash,
          });
        })
        .then((newToken) => newToken.save())
        .then(() => {
          const message = encodeURI(
            `Hello,\nYour password reset code is ${code}. \nFatwa Archive.`
          );
          return fetch(
            `http://api.greenweb.com.bd/api.php/?token=${process.env.SMS_TOKEN}&to=${jamia.applicant.mobile}&message=${message}`,
            { method: "POST" }
          );
        })
        .then(() => {
          res.json("code sent");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });
});
router.route("/varifyPassCode").put((req, res) => {
  const id = req.body.id;
  const code = req.body.code;
  PassRecoveryToken.findOne({ id: id }).then((token) => {
    if (!token) {
      res.status(404).json("token not found");
    } else {
      if (token.try === 2 && !bcrypt.compareSync(code, token.code)) {
        PassRecoveryToken.findOneAndDelete({ id: id })
          .then(() => {
            res.status(400).json("too many attempts.");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      } else if (!bcrypt.compareSync(code, token.code)) {
        PassRecoveryToken.findOne({ id: id })
          .then((token) =>
            PassRecoveryToken.findOneAndUpdate(
              { id: id },
              { try: token.try + 1 }
            )
          )
          .then(() => {
            res.status(401).json("code found but code did not matched");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      } else if (bcrypt.compareSync(code, token.code)) {
        bcrypt
          .hash(code, 10)
          .then((hash) =>
            PassRecoveryToken.findOneAndUpdate(
              { id: id, code: hash },
              { expireAt: Date.now() }
            )
          )
          .then(() => {
            res.json("code found and code matched");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      }
    }
  });
});
router.route("/jamiaNewPass").patch((req, res) => {
  const id = req.body.jamia;
  const code = req.body.code;
  const pass = req.body.newPass;
  PassRecoveryToken.findOne({ id: id })
    .then((token) => {
      if (!token) {
        res.status(404).json("time out");
      } else {
        if (bcrypt.compareSync(code, token.code)) {
          bcrypt
            .hash(pass, 10)
            .then((hash) =>
              Jamia.findOneAndUpdate({ id: id }, { password: hash })
            )
            .then(() => PassRecoveryToken.findOneAndDelete({ id: id }))
            .then(() => res.json("password reset successfully"))
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            });
        } else {
          res.status(401).json("wrong code");
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.route("/authenticate").get(passport.authenticate("jwt"), (req, res) => {
  if (req.isAuthenticated()) {
    const user = {};
    if (req.user.role === "jamia") {
      user.name = req.user.name;
      user.applicant = req.user.applicant;
      user.fatwa = req.user.fatwa;
      user.joined = req.user.joined;
      user.founder = req.user.founder;
      user.est = req.user.est;
      user.address = req.user.address;
      user.contact = req.user.contact;
      user.primeMufti = req.user.primeMufti;
      user.about = req.user.about;
    } else if (req.user.role === "admin") {
      user.firstName = req.user.firstName;
      user.lastName = req.user.lastName;
      user.email = req.user.email;
      user.mobile = req.user.mobile;
    }
    user.id = req.user.id;
    user._id = req.user._id;
    user.role = req.user.role;
    Jamia.find()
      .then((jamias) => {
        return jamias.map((jamia) => {
          return {
            id: jamia.id,
            name: jamia.name,
          };
        });
      })
      .then((jamias) => {
        res.status(200).json({ isAuthenticated: true, user, jamias: jamias });
      });
  } else {
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
