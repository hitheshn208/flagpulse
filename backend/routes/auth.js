const express = require("express");
const authRouter = express.Router();
const {registerUser, loginUser, logoutUser} = require("../controllers/authController")

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

module.exports = authRouter;