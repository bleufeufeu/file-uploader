const passport = require("passport");

async function handleLogIn(req, res, next) {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render("login", { user: null, error: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
}

module.exports = {
  handleLogIn,
};
