const express = require("express");
const flagRouter = express.Router();
const {editFlagValue, deleteFlag, flagLogs, toggleFlag, getFlagValue} = require("../controllers/flagController")

flagRouter.get("/:flagId/environments", getFlagValue);
flagRouter.patch("/:flagId/environments/:envId/toggle", toggleFlag);
flagRouter.patch("/:flagId/environments/:envId", editFlagValue);
flagRouter.delete("/:flagId", deleteFlag);
flagRouter.get("/:flagId/audit", flagLogs);

module.exports = flagRouter;