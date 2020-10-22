const { Jamia } = require("../models/jamiaModel");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    (payload, done) => {
      let Model = null;
      payload.role === "jamia" && (Model = Jamia);
      Model.findOne({ id: payload.sub }, (err, model) => {
        if (err) return done(err, false);
        if (model) return done(null, model);
        else return done(null, false);
      });
    }
  )
);

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, next) => {
      if (!req.body.role) return next(null, false);
      let Model = null;
      req.body.role === "jamia" && (Model = Jamia);
      Model.findOne({ id: username })
        .then((model) => {
          if (!model) return next(null, false);
          if (!bcrypt.compareSync(password, model.password))
            return next(null, false);
          return next(null, model);
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    }
  )
);

passport.serializeUser((user, next) => {
  next(null, user._id);
});
passport.deserializeUser((userId, next) => {
  User.findById(userId)
    .then((user) => next(null, user))
    .catch((err) => {
      console.log(err);
      next(err);
    });
});
