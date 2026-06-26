const express = require("express");
const {getProjects, insertProjects, getProjectEnvironments, createProjectEnvironments} = require("../controllers/projectController")

const projectRouter = express.Router();

projectRouter.get("/", getProjects)
projectRouter.post("/", insertProjects);
projectRouter.get("/:id/environments", getProjectEnvironments)
projectRouter.post("/:id/environments", createProjectEnvironments)

module.exports = projectRouter;