const express = require("express");
const { rotateEnvironmentKey } = require("../controllers/environmentController");

const envRouter = express.Router();

envRouter.patch("/:id/rotate-key", rotateEnvironmentKey)

module.exports = envRouter;