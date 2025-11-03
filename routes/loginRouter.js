const { Router } = require("express");
const loginRouter = Router();

const loginController = require("../controllers/loginController.js");

loginRouter.get("/", (req, res) => res.render("login"));
loginRouter.post("/", loginController.handleLogIn);

module.exports = loginRouter;
