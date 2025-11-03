const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

async function handleSignUp(req, res, next) {
  const errors = validationResult(req);

  try {
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.render("signup", {
        errors: errors.array(),
        formData: req.body,
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.createUser(
      req.body.username,
      hashedPassword,
      req.body.firstname,
      req.body.lastname,
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  handleSignUp,
};
