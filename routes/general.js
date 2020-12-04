const { Fatwa, FatwaSubmissions } = require("../models/fatwaModel");
const {
  // Jamia,
  // JamiaSubmissions,
  PassRecoveryToken,
} = require("../models/jamiaModel");
const { UserQuestion, ReportFatwa } = require("../models/userSubmissionModel");
const { Source, Jamia, Mufti } = require("../models/sourceModel");
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

//----------------------------------------------------GENERAL USER
router.route("/siteData").get((req, res) => {
  Jamia.find()
    .then((jamias) =>
      jamias.map((jamia) => {
        return { id: jamia.id, name: jamia.name };
      })
    )
    .then((jamias) => {
      res.status(200).json({ jamias: jamias });
    });
});
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
router.route("/suggestions?").get((req, res) => {
  const locale = req.headers["accept-language"];
  if (locale === "bn-BD" || locale === "en-US") {
    const query = new RegExp(`${req.query.q.replace(" ", ".+")}\\w+`, "giu");
    console.log(locale, query);
    Fatwa.getSuggestions(
      {
        status: "live",
        $or: [
          { [`title.${locale}`]: query },
          { [`ques.${locale}`]: query },
          { [`ans.${locale}`]: query },
        ],
      },
      (err, fatwas) => {
        if (fatwas.length === 0) {
          res.json([]);
          return;
        }
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
      }
    );
  } else {
    res.status(400).json("select a language in currect format");
  }
});

//---------------------------------------------WAY TOOO MUCH WORK HERE!!!
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

//------------------------------------------------------NEW SOURCE
router.route("/jamia/new").post((req, res) => {
  Promise.all([
    translate
      .translate(
        Object.values(req.body.name)[0],
        Object.keys(req.body.name)[0] === "en-US" ? "bn" : "en"
      )
      .then((translation) => {
        Object.keys(req.body.name)[0] === "en-US"
          ? (req.body.name["bn-BD"] = translation[0])
          : (req.body.name["en-US"] = translation[0]);
      })
      .catch((err) => {
        throw err;
      }),
    translate
      .translate(
        Object.values(req.body.primeMufti)[0],
        Object.keys(req.body.primeMufti)[0] === "en-US" ? "bn" : "en"
      )
      .then((translation) => {
        Object.keys(req.body.primeMufti)[0] === "en-US"
          ? (req.body.primeMufti["bn-BD"] = translation[0])
          : (req.body.primeMufti["en-US"] = translation[0]);
      })
      .catch((err) => {
        throw err;
      }),
  ])
    .then(() => bcrypt.hash(req.body.pass, 10))
    .then(
      (hashed) =>
        new Jamia({
          ...req.body,
          pass: hashed,
          role: "jamia",
        })
    )
    .then((submission) => submission.save())
    .then(() => res.status(200).json("application submitted!"))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});
router.route("/validateId/:id").get((req, res) => {
  Source.findOne({ id: req.params.id })
    .then((source) => {
      if (source) {
        res.status(400).json("id already exists.");
      } else {
        res.status(200).json("id is valid");
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//------------------------------------------------JAMIA ACCOUNT STUFF!!
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
          user.appl = req.user.appl;
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
          user.mob = req.user.mob;
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
router.route("/authenticate").get(passport.authenticate("jwt"), (req, res) => {
  const user = {};
  if (req.user.role === "jamia") {
    user.name = req.user.name;
    user.appl = req.user.appl;
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
    user.mob = req.user.mob;
  }
  user.id = req.user.id;
  user._id = req.user._id;
  user.role = req.user.role;
  res.status(200).json({ isAuthenticated: true, user });
});
router
  .route("/logout")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: null, success: true });
  });

router.route("/passRecovery").put((req, res) => {
  Jamia.findOne({ id: req.body.id }).then((source) => {
    if (source === null) {
      res.status(404).json("profile not found");
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
            id: source.id,
            code: hash,
          });
        })
        .then((newToken) => newToken.save())
        .then(() => {
          const message = encodeURI(
            `Hello,\nYour password reset code is ${code}. \nFatwa Archive.`
          );
          return fetch(
            `http://api.greenweb.com.bd/api.php/?token=${process.env.SMS_TOKEN}&to=${source.appl.mob}&message=${message}`,
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
            .then((hash) => Jamia.findOneAndUpdate({ id: id }, { pass: hash }))
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

//------------------------------------------------------------TESTS
router.route("/sources").get((req, res) => {
  const source = new Source();
  const jamia = new Jamia();
  const mufti = new Mufti();
  console.log({ source, jamia, mufti });
  res.json("test done");
});

module.exports = router;
