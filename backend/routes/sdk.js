const express = require('express');
const sdkRouter = express.Router()

const {fetchFlags} = require("../controllers/sdkControllers")

sdkRouter.get("/flags", fetchFlags);

module.exports = sdkRouter;