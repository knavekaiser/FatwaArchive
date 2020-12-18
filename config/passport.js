const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
};

passport.use(
  "Admin",
  new LocalStrategy((username, password, next) => {
    User.findOne({ id: username })
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.pass))
          return next(null, user);
        return next(null, false);
      })
      .catch((err) => next(err, false));
  })
);
passport.use(
  "Source",
  new LocalStrategy((username, password, next) => {
    Source.findOne({ id: username, status: "active" })
      .then((source) => {
        if (source && bcrypt.compareSync(password, source.pass))
          return next(null, source);
        return next(null, false);
      })
      .catch((err) => next(err, false));
  })
);
passport.use(
  "SourceAuth",
  new JwtStrategy(
    { jwtFromRequest: cookieExtractor, secretOrKey: process.env.JWT_SECRET },
    (payload, next) => {
      Source.findOne({ _id: payload.sub, status: "active" })
        .then((source) => (source ? next(null, source) : next(null, false)))
        .catch((err) => next(err, false));
    }
  )
);
passport.use(
  "AdminAuth",
  new JwtStrategy(
    { jwtFromRequest: cookieExtractor, secretOrKey: process.env.JWT_SECRET },
    (payload, next) => {
      User.findOne({ _id: payload.sub, role: "admin" })
        .then((source) => (source ? next(null, source) : next(null, false)))
        .catch((err) => next(err, false));
    }
  )
);

passport.serializeUser((user, next) => next(null, user._id));
passport.deserializeUser((userId, next) => {
  User.findById(userId)
    .then((user) => next(null, user))
    .catch((err) => {
      console.log(err);
      next(err);
    });
});
