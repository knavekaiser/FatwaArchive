router
  .route("/admin/sources")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    Source.find({ status: "active" }, "name varified id")
      .then((sources) => {
        res.json({ code: "ok", data: sources });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "something went wrong" });
      });
  });
router
  .route("/admin/newFatwa")
  .post(passport.authenticate("AdminAuth"), (req, res) => {
    const { topic, title, ques, ans, ref, img, meta, source } = req.body;
    if (!title["en-US"] && !ques["en-US"] && !ans["en-US"]) {
      TranslateAll([title["bn-BD"], ques["bn-BD"], ans["bn-BD"]], true)
        .then((translations) => {
          return new Fatwa({
            topic: topic,
            link: {
              "bn-BD": title["bn-BD"].replace(/\s/g, "-"),
              "en-US": translations[0].replace(/\s/g, "-"),
            },
            title: { "bn-BD": title["bn-BD"], "en-US": translations[0] },
            ques: { "bn-BD": ques["bn-BD"], "en-US": translations[1] },
            ans: { "bn-BD": ans["bn-BD"], "en-US": translations[2] },
            ref: ref,
            img: img,
            meta: meta,
            status: "live",
            translation: false,
            source: source,
          });
        })
        .then((newFatwa) => newFatwa.save())
        .then(() => Source.updateFatwaCount(source))
        .then(() => res.send({ code: "ok", message: "fatwa added" }))
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            res.status(400).json({
              code: err.code,
              field: Object.keys(err.keyValue)[0],
            });
          } else {
            res
              .status(400)
              .json({ code: 500, message: "something went wrong" });
          }
        });
    } else {
      newFatwa = new Fatwa({
        topic: req.body.topic,
        title: title,
        ques: ques,
        ans: ans,
        ref: ref,
        img: img,
        write: write,
        atts: atts,
        source: req.user._id,
        translation: true,
      })
        .save()
        .then(() => res.send({ code: "ok", message: "fatwa added" }))
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            res.status(400).json({
              code: err.code,
              field: Object.keys(err.keyValue)[0],
            });
          } else {
            res
              .status(400)
              .json({ code: 500, message: "something went wrong" });
          }
        });
    }
  });
router
  .route("/admin/editFatwa/:_id")
  .patch(passport.authenticate("AdminAuth"), (req, res) => {
    const newData = {
      translation:
        req.body["title.en-US"] &&
        req.body["ques.en-US"] &&
        req.body["ans.en-US"]
          ? true
          : false,
      ...(req.body["title.bn-BD"] && {
        ["link.bn-BD"]: req.body["title.bn-BD"].replace(/\s/g, "-"),
      }),
      ...(req.body["title.en-US"] && {
        ["link.en-US"]: req.body["title.en-US"].replace(/\s/g, "-"),
      }),
      ...req.body,
      status: "live",
    };
    if (ObjectID.isValid(req.params._id)) {
      Fatwa.findByIdAndUpdate(req.params._id, newData)
        .then(() =>
          Promise.all([
            Source.updateFatwaCount(req.body.source),
            Source.updateFatwaCount(req.body.oldSource),
          ])
        )
        .then(() => {
          res.json({ code: "ok", message: "updated" });
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(400).json({
              code: err.code,
              field: Object.keys(err.keyValue)[0],
            });
          } else {
            console.log(err);
            res
              .status(500)
              .json({ code: 500, message: "something went wrong" });
          }
        });
    } else {
      res.status(400).json({ code: 400, message: "invalid id" });
    }
  });

//----------------------------------FATWA
router
  .route("/admin/allfatwa/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const locale = req.headers["accept-language"];
    const { title, ques, ans, topic, translation, perPage, page } = req.query;
    const query = { status: "live" };
    const sort = { column: req.query.column, order: req.query.order };
    title && (query[`title.${locale}`] = RegExp(title));
    ques && (query[`ques.${locale}`] = RegExp(ques));
    ans && (query[`ans.${locale}`] = RegExp(ans));
    topic && (query[`topic.${locale}`] = topic);
    (translation === "Auto" || translation === "গুগল") &&
      (query.translation = false);
    (translation === "Manual" || translation === "ব্যক্তি") &&
      (query.translation = true);
    if (locale.length > 5) {
      res.status(400).json({
        code: 400,
        message: "No language selected or formation is wrong",
      });
      return;
    }
    Fatwa.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "sources",
          localField: "source",
          foreignField: "_id",
          as: "source",
        },
      },
      { $unwind: "$source" },
      { $sort: { [sort.column]: sort.order === "des" ? -1 : 1 } },
      // {
      //   $project: {
      //     _id: 1,
      //     [`link.${locale}`]: 1,
      //     [`title.${locale}`]: 1,
      //     [`ques.${locale}`]: 1,
      //     [`ans.${locale}`]: 1,
      //     [`topic.${locale}`]: 1,
      //     createdAt: 1,
      //     translation: 1,
      //     [`source.id`]: 1,
      //     [`source.name.${locale}`]: 1,
      //   },
      // },
      {
        $facet: {
          fatwas: [{ $skip: +perPage * (+page - 1) }, { $limit: +perPage }],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((data) => {
        res.json({
          code: "ok",
          total: data[0].pageInfo[0] ? data[0].pageInfo[0].count : 0,
          content: data[0].fatwas,
        });
      })
      .catch((err) => {
        res.status(500).json({ code: 500, message: "something went wrong" });
        console.log(err);
      });
  });
router
  .route("/admin/fatwa/")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    Fatwa.findByIdAndDelete(req.body.fatwa)
      .then(() => Source.updateFatwaCount(req.body.source))
      .then(() => res.status(200).json("Item Deleted!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
router
  .route("/admin/fatwaSubmissions/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const { title, ques, ans, topic, translation, perPage, page } = req.query;
    const locale = req.headers["accept-language"];
    const query = { $or: [{ status: "pending" }, { status: "pendingEdit" }] };
    const sort = { column: req.query.column, order: req.query.order };
    title && (query[`title.${locale}`] = RegExp(title));
    ques && (query[`ques.${locale}`] = RegExp(ques));
    ans && (query[`ans.${locale}`] = RegExp(ans));
    topic && (query[`topic.${locale}`] = topic);
    Fatwa.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "sources",
          localField: "source",
          foreignField: "_id",
          as: "source",
        },
      },
      { $unwind: "$source" },
      { $sort: { [sort.column]: sort.order === "des" ? -1 : 1 } },
      {
        $facet: {
          fatwas: [{ $skip: +perPage * (+page - 1) }, { $limit: +perPage }],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((data) => {
        res.json({
          code: "ok",
          total: data[0].pageInfo[0] ? data[0].pageInfo[0].count : 0,
          content: data[0].fatwas,
        });
      })
      .catch((err) =>
        res.status(500).json({ code: 500, message: "something went wrong" })
      );
  });
router
  .route("/admin/fatwaSubmissions/accept/:_id")
  .post(passport.authenticate("AdminAuth"), (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json("forbidden");
    if (ObjectID.isValid(req.params._id)) {
      Fatwa.findByIdAndUpdate(req.params._id, { status: "live" })
        .then((fatwa) => Source.updateFatwaCount(fatwa.source))
        .then(() => res.send({ code: "ok", message: "fatwa added" }))
        .catch((err) => {
          console.log(err);
          res.status(500).json({ code: 500, message: "something went wrong" });
        });
    } else {
      res.status(400).json({ code: 400, message: "invalid id" });
    }
  });
router
  .route("/admin/fatwaSubmissions/remove/:_id")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    Fatwa.findByIdAndDelete(req.params._id)
      .then(() => {
        res.json("submission successfully deleted.");
      })
      .catch((err) => res.status(500).json(err));
  });

//----------------------------------SCRAPPED FATWA
router
  .route("/admin/scrappedFatwas/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const locale = req.headers["accept-language"];
    const query = { status: "pending" };
    const { ans, perPage, page } = req.query;
    const sort = { column: req.query.column, order: req.query.order };
    ScrappedFatwa.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "sources",
          localField: "source",
          foreignField: "_id",
          as: "source",
        },
      },
      { $unwind: "$source" },
      { $sort: { [sort.column]: sort.order === "des" ? -1 : 1 } },
      {
        $facet: {
          fatwas: [{ $skip: +perPage * (+page - 1) }, { $limit: +perPage }],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((data) => {
        res.json({
          code: "ok",
          total: data[0].pageInfo[0] ? data[0].pageInfo[0].count : 0,
          content: data[0].fatwas,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "something went wrong" });
      });
  });
router
  .route("/admin/scrappedFatwa/accept")
  .post(passport.authenticate("AdminAuth"), (req, res) => {
    const { topic, title, ques, ans, ref, img, meta, _id, source } = req.body;
    if (!title["en-US"] && !ques["en-US"] && !ans["en-US"]) {
      TranslateAll([title["bn-BD"], ques["bn-BD"], ans["bn-BD"]], true)
        .then((translations) => {
          return new Fatwa({
            topic: topic,
            link: {
              "bn-BD": title["bn-BD"].replace(/\s/g, "-"),
              "en-US": translations[0].replace(/\s/g, "-"),
            },
            title: { "bn-BD": title["bn-BD"], "en-US": translations[0] },
            ques: { "bn-BD": ques["bn-BD"], "en-US": translations[1] },
            ans: { "bn-BD": ans["bn-BD"], "en-US": translations[2] },
            ref: ref,
            img: img,
            meta: meta,
            status: "live",
            source: source,
            translation: false,
          });
        })
        .then((newFatwa) => newFatwa.save())
        .then(() => Source.updateFatwaCount(source._id))
        .then(() =>
          ScrappedFatwa.findOneAndUpdate({ _id: _id }, { status: "live" })
        )
        .then(() => res.send({ code: "ok", message: "fatwa added" }))
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            res.status(400).json({
              code: err.code,
              field: Object.keys(err.keyValue)[0],
            });
          } else {
            res
              .status(400)
              .json({ code: 500, message: "something went wrong" });
          }
        });
    } else {
      newFatwa = new Fatwa({
        topic: req.body.topic,
        title: title,
        ques: ques,
        ans: ans,
        ref: ref,
        img: img,
        write: write,
        atts: atts,
        source: req.user._id,
        translation: true,
      })
        .save()
        .then(() => Source.updateFatwaCount(source._id))
        .then(() => res.send({ code: "ok", message: "fatwa added" }))
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            res.status(400).json({
              code: err.code,
              field: Object.keys(err.keyValue)[0],
            });
          } else {
            res
              .status(400)
              .json({ code: 500, message: "something went wrong" });
          }
        });
    }
  });
router
  .route("/admin/scrappedFatwas/live/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const locale = req.headers["accept-language"];
    const query = { status: "live" };
    const { ans, perPage, page } = req.query;
    const sort = { column: req.query.column, order: req.query.order };
    ScrappedFatwa.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "sources",
          localField: "source",
          foreignField: "_id",
          as: "source",
        },
      },
      { $unwind: "$source" },
      { $sort: { [sort.column]: sort.order === "des" ? -1 : 1 } },
      {
        $facet: {
          fatwas: [{ $skip: +perPage * (+page - 1) }, { $limit: +perPage }],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((data) => {
        res.json({
          code: "ok",
          total: data[0].pageInfo[0] ? data[0].pageInfo[0].count : 0,
          content: data[0].fatwas,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "something went wrong" });
      });
  });

//----------------------------------UESR QUESTION
router
  .route("/admin/questionFeed/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const sort = { column: req.query.column, order: req.query.order };
    UserQuestion.find({
      $or: [{ status: "pending" }, { status: "pendingApproval" }],
    })
      .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
      .then((questions) => res.json(questions))
      .catch((err) => {
        console.log(err);
        res.status(500).json("something went wrong");
      });
  });
router
  .route("/admin/userQues/:_id")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
      UserQuestion.findById(req.params._id)
        .populate("ans.source reports.source", "name add")
        .then((ques) => res.json({ code: "ok", content: ques }))
        .catch((err) => {
          console.log(err);
          res.status(500).json("something went wrong");
        });
    } else {
      res.status(400).json("invalid id");
    }
  });
router
  .route("/admin/userQues")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    if (ObjectID.isValid(req.body._id)) {
      UserQuestion.findByIdAndDelete(req.body._id)
        .then(() => {
          res.json({ code: "ok", message: "successfully deleted" });
        })
        .catch((err) => {
          res.status(500).json({ code: 500, message: "something went wrong" });
        });
    } else {
      res.status(400).json({ code: 400, message: "invalid id" });
    }
  });
router
  .route("/admin/userQues/approveAns/:_id")
  .post(passport.authenticate("AdminAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id) && ObjectID.isValid(req.body.ans_id)) {
      UserQuestion.findById(req.params._id)
        .then((ques) => ques.approveAns(req.body.ans_id))
        .then((data) => {
          res.json({ code: "ok", message: "answer approved" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json("internal error");
        });
    } else {
      res.status(400).json("invalid id");
    }
  });
router
  .route("/admin/userQues/answer/:_id")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    if (ObjectID.isValid(req.params._id)) {
      UserQuestion.findById(req.params._id)
        .populate("ans.source", "name primeMufti")
        .then((ques) => ques.dltAns(req.body))
        .then((saved) => {
          res.json({ code: "ok", content: saved });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json("internal error");
        });
    } else {
      res.status(400).json("invalid id");
    }
  });

//----------------------------------NEW SOURCE
router
  .route("/admin/sources/submissions/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const locale = req.headers["accept-language"];
    const { perPage, page } = req.query;
    const query = { status: "pending" };
    req.query.role && (query.role = RegExp(req.query.role));
    const sort = { column: req.query.column, order: req.query.order };
    if (locale.length > 5) {
      res.status(400).json("No language selected or formation is wrong");
      return;
    }
    Source.aggregate([
      { $match: query },
      { $sort: { [sort.column]: sort.order === "des" ? -1 : 1 } },
      {
        $project: {
          pass: 0,
          type: 0,
        },
      },
      {
        $facet: {
          sources: [{ $skip: +perPage * (+page - 1) }, { $limit: +perPage }],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((data) => {
        res.json({
          code: "ok",
          total: data[0].pageInfo[0] ? data[0].pageInfo[0].count : 0,
          content: data[0].sources,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "something went wrong" });
      });
  });
router
  .route("/admin/source/accept")
  .post(passport.authenticate("AdminAuth"), (req, res) => {
    Source.findByIdAndUpdate(req.body._id, {
      status: "active",
      joined: new Date(),
    })
      .then((source) => {
        const message = encodeURI(`আপনার আবেদন গৃহীত হয়েছে । ফতোয়া আর্কাইভ`);
        const number = source.role === "jamia" ? source.appl.mob : source.mob;
        return fetch(
          `http://api.greenweb.com.bd/api.php/?token=${process.env.SMS_TOKEN}&to=${number}&message=${message}`,
          { method: "POST" }
        );
      })
      .then(() =>
        res.json({ code: "ok", message: "Jamia successfully accepted" })
      )
      .catch((err) => {
        res.status(500).json({ code: 500, message: "somthing went wrong " });
        console.log(err);
      });
  });
router
  .route("/admin/source/reject")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    Source.findByIdAndDelete(req.body._id)
      .then(() => res.status(200).json("Jamia Submission deleted!"))
      .catch((err) => {
        res.json(err);
      });
  });

//----------------------------------SOURCE
router
  .route("/admin/sources/active/filter")
  .get(passport.authenticate("AdminAuth"), (req, res) => {
    const { perPage, page } = req.query;
    const query = { status: "active" };
    const sort = { column: req.query.column, order: req.query.order };
    req.query.role && (query.role = RegExp(req.query.role));
    Source.aggregate([
      { $match: query },
      { $sort: { [sort.column]: sort.order === "des" ? -1 : 1 } },
      {
        $project: {
          pass: 0,
          type: 0,
        },
      },
      {
        $facet: {
          sources: [{ $skip: +perPage * (+page - 1) }, { $limit: +perPage }],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((data) => {
        res.json({
          code: "ok",
          total: data[0].pageInfo[0] ? data[0].pageInfo[0].count : 0,
          content: data[0].sources,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, data: "something went wrong" });
      });
  });
router
  .route("/admin/source/edit/:_id")
  .patch(passport.authenticate("AdminAuth"), (req, res) => {
    if (Object.keys(req.body).length === 1) {
      Source.findOneAndUpdate({ _id: req.params._id }, req.body)
        .then((jamia) => {
          res.json("data successfully updated!");
        })
        .catch((err) => res.json(err));
    } else if (Object.keys(req.body).length === 3) {
      Source.findById(req.params._id)
        .then((jamia) => bcrypt.compare(req.body.oldPass, jamia.pass))
        .then((match) => {
          if (match) {
            Source.findOneAndUpdate(
              { _id: req.params._id },
              { pass: bcrypt.hashSync(req.body.newPass, 10) }
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
router
  .route("/admin/source")
  .delete(passport.authenticate("AdminAuth"), (req, res) => {
    Source.findByIdAndDelete(req.body._id)
      .then(() => res.json("jamia successfully deleted"))
      .catch((err) => res.status(500).json(err));
  });

//-----------------------------------USER SUBMITIONS
router.route("/admin/userQuestion/filter").get((req, res) => {
  const query = {};
  req.query.name && (query.name = req.query.name);
  const sort = { column: req.query.column, order: req.query.order };
  UserQuestion.find(query)
    .sort(`${sort.order === "des" ? "-" : ""}${sort.column}`)
    .then((questions) => {
      if (questions.length === 0) {
        res.json([]);
        return;
      }
      res.json(questions);
    });
});
router.route("/admin/removeUserQuestion").delete((req, res) => {
  UserQuestion.findByIdAndDelete(req.body._id)
    .then(() => {
      res.json("question successfully deleted");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("something went wrong");
    });
});

//-----------------------------------MORE
router.route("/patreons/filter").get((req, res) => {
  res.status(503).json([{ _id: 235252, item: "make patreons stuff" }]);
});
router.route("/userReview/filter").get((req, res) => {
  res.status(503).json([{ _id: 235252, item: "make userReview stuff" }]);
});

module.exports = router;
