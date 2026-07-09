const express = require("express");
const flagRouter = express.Router();
const {editFlagValue, deleteFlag, flagLogs, toggleFlag} = require("../controllers/flagController")

flagRouter.patch("/:flagId/environments/:envId/toggle", toggleFlag);
flagRouter.patch("/:flagId/environments/:envId", editFlagValue);
flagRouter.delete("/:flagId", deleteFlag);
flagRouter.get("/:flagId/audit", flagLogs);

module.exports = flagRouter;