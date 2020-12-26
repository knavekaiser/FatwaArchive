const regEx = (input) => new RegExp(input.replace(" ", ".+"), "gi");
const signToken = (_id, role) => {
  return jwt.sign(
    {
      iss: "fatwaArchive",
      sub: _id,
      role: role,
    },
    process.env.JWT_SECRET
  );
};

//----------------------------------------------------GENERAL USER
router.route("/siteData").get((req, res) => {
  Source.find({ status: "active" }, "name id -type").then((sources) => {
    res.status(200).json({ sources: sources });
  });
});
router.route("/fatwa/:link").get((req, res) => {
  const locale = req.headers["accept-language"];
  if (locale.length > 5) return res.status(400).json("No language selected.");
  const query = {
    status: "live",
    [`link.${getLan(req.params.link)}`]: req.params.link,
  };
  Fatwa.findOne(query, "-status")
    .populate("source", "name primeMufti")
    .then((fatwa) => {
      if (fatwa) {
        res.json(fatwa);
      } else {
        res.status(404).json("nothing found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("Error: " + err);
    });
});
router.route("/search").get((req, res) => {
  const locale = req.headers["accept-language"];
  const perpage = 10;
  req.query.page <= 0 && (req.query.page = 1);
  if (req.query.q && req.query.q.length > 0) {
    Fatwa.aggregate([
      {
        $search: {
          index: "SearchIndex",
          text: {
            path: [`title.${locale}`, `ques.${locale}`, `ans.${locale}`],
            query: req.query.q,
            fuzzy: {
              maxEdits: 1,
            },
          },
        },
      },
      {
        $match: { status: "live" },
      },
      {
        $lookup: {
          from: "sources",
          localField: "source",
          foreignField: "_id",
          as: "source",
        },
      },
      { $unwind: "$source" },
      {
        $project: {
          _id: 1,
          [`link.${locale}`]: 1,
          [`title.${locale}`]: 1,
          [`ques.${locale}`]: 1,
          // [`ans.${locale}`]: 1,
          [`source.name.${locale}`]: 1,
        },
      },
      {
        $facet: {
          fatwas: [
            { $skip: perpage * (req.query.page - 1) },
            { $limit: perpage },
          ],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((data) => {
        res.json({
          code: "ok",
          total: data[0].pageInfo[0] ? data[0].pageInfo[0].count : 0,
          fatwas: data[0].fatwas,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: err });
      });
  } else {
    res.status(400).json("nope");
  }
});
router.route("/searchSuggestions").get((req, res) => {
  const locale = req.headers["accept-language"];
  if (req.query.q && req.query.q.length > 0) {
    Fatwa.aggregate([
      {
        $search: {
          index: `auto.${locale}`,
          compound: {
            should: [
              {
                autocomplete: {
                  query: req.query.q,
                  path: `title.${locale}`,
                  tokenOrder: "sequential",
                  fuzzy: { maxEdits: 1, prefixLength: 3 },
                },
              },
              {
                autocomplete: {
                  query: req.query.q,
                  path: `ques.${locale}`,
                  tokenOrder: "sequential",
                  fuzzy: { maxEdits: 1, prefixLength: 3 },
                },
              },
              {
                autocomplete: {
                  query: req.query.q,
                  path: `ans.${locale}`,
                  tokenOrder: "sequential",
                  fuzzy: { maxEdits: 1, prefixLength: 3 },
                },
              },
            ],
          },
        },
      },
      {
        $match: { status: "live" },
      },
      {
        $limit: 8,
      },
      {
        $project: {
          [`link.${locale}`]: 1,
          [`title.${locale}`]: 1,
        },
      },
    ])
      .then((fatwas) => {
        res.json({ code: "ok", data: fatwas });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "something went wrong" });
      });
  } else {
    res.status(400).json({ code: 400, message: "something went wrong" });
  }
});

//---------------------------------------------WAY TOOO MUCH WORK HERE!!!
router.route("/askFatwa").post((req, res) => {
  if (
    req.body.user.name &&
    req.body.user.add &&
    req.body.user.mob &&
    req.body.ques.topic &&
    req.body.ques.body
  ) {
    new UserQuestion({ ...req.body })
      .save()
      .then(() => res.json({ code: "ok", content: "question added" }))
      .catch((err) => {
        if (err.code === 11000) {
          res.status(400).json({
            code: err.code,
            field: Object.keys(err.keyValue)[0],
          });
        } else {
          console.log(err);
        }
      });
  } else {
    res.status(400);
  }
});
router.route("/reportFatwa").post((req, res) => {
  new ReportFatwa({ ...req.body })
    .save()
    .then((response) => {
      //here send the notification to jamia and admin.
      //then
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

//-------------------------------------------------------------NEW SOURCE
router.route("/source/new").post((req, res) => {
  const { name, primeMufti } = req.body;
  Promise.all([
    TranslateAll([name, primeMufti]),
    bcrypt.hash(req.body.pass, 10),
  ])
    .then((data) => {
      req.body.name = {
        [getLan(name)]: name,
        [getLan(name, true)]: data[0][0],
      };
      req.body.primeMufti = {
        [getLan(primeMufti)]: primeMufti,
        [getLan(primeMufti, true)]: data[0][1],
      };
      console.log(req.body);
      return new Jamia({
        ...req.body,
        pass: data[1],
        role: "jamia",
      });
    })
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

//------------------------------------------------LOGIN STUFF!!
router.route("/loginSource").post(
  passport.authenticate("Source", { session: false, failWithError: true }),
  (req, res, next) => {
    const user = { ...req.user._doc };
    ["pass", "meta", "type", "__v"].forEach((key) => delete user[key]);
    const token = signToken(req.user._id, "source");
    res.cookie("access_token", token, { httpOnly: true, sameSite: true });
    res.status(200).json({ code: "ok", isAuthenticated: true, user: user });
  },
  (err, req, res, next) => {
    res.status(401).json({ code: 401, message: "invalid credentials" });
  }
);
router.route("/loginAdmin").post(
  passport.authenticate("Admin", { session: false, failWithError: true }),
  (req, res, next) => {
    const user = { ...req.user._doc };
    ["pass", "ghost"].forEach((key) => delete user[key]);
    const token = signToken(req.user._id, "admin");
    res.cookie("access_token", token, { httpOnly: true, sameSite: true });
    res.status(200).json({ code: "ok", isAuthenticated: true, user: user });
  },
  (err, req, res, next) => {
    console.log("this should ran");
    res.status(401).json({ code: 401, message: "invalid credentials" });
  }
);

router.route("/auth").get((req, res) => {
  if (req.cookies && req.cookies.access_token) {
    const token = jwt_decode(req.cookies.access_token);
    if (ObjectID.isValid(token.sub) && token.role === "source") {
      res.redirect("/api/authSource");
    } else if (ObjectID.isValid(token.sub) && token.role === "admin") {
      res.redirect("/api/authAdmin");
    }
  } else {
    res.status(400).json({ code: 400, message: "bad request" });
  }
});
router
  .route("/authSource")
  .get(passport.authenticate("SourceAuth"), (req, res) => {
    const user = { ...req.user._doc };
    ["pass", "meta", "type", "__v"].forEach((key) => delete user[key]);
    res.status(200).json({ code: "ok", isAuthenticated: true, user });
  });
router
  .route("/authAdmin")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const user = { ...req.user._doc };
    ["pass", "ghost"].forEach((key) => delete user[key]);
    res.status(200).json({ code: "ok", isAuthenticated: true, user });
  });

router.route("/logout").get((req, res) => {
  res.clearCookie("access_token");
  res.json({ user: null, success: true });
});

router.route("/passRecovery").put((req, res) => {
  Source.findOne({ id: req.body.id, status: "active" }).then((source) => {
    if (source) {
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
        .then((hash) =>
          new PassRecoveryToken({ id: source.id, code: hash }).save()
        )
        .then(() => {
          const url = "http://api.greenweb.com.bd/api.php/?";
          const message = encodeURI(
            `Hello,\nYour password reset code is ${code}. \nFatwa Archive.`
          );
          return fetch(
            `${url}token=${process.env.SMS_TOKEN}&to=${source.appl.mob}&message=${message}`,
            { method: "POST" }
          );
        })
        .then((smsRes) => {
          res.json({ code: "ok", message: "code sent" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ code: 500, message: "internal error" });
        });
    } else {
      res.status(404).json({ code: 404, message: "profile not found" });
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

module.exports = router;
