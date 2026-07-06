const express = require("express");
const { rotateEnvironmentKey, getAllFlags} = require("../controllers/environmentController");

const envRouter = express.Router();

envRouter.patch("/:envId/rotate-key", rotateEnvironmentKey);
envRouter.get("/:envId/flags", getAllFlags); //^Get all flags for the environment

module.exports = envRouter;