const express = require("express");
const {getProjects, insertProjects, getProjectEnvironments, createProjectEnvironments, createFlag} = require("../controllers/projectController")

const projectRouter = express.Router();

projectRouter.get("/", getProjects)
projectRouter.post("/", insertProjects);
projectRouter.get("/:id/environments", getProjectEnvironments)
projectRouter.post("/:id/environments", createProjectEnvironments)
projectRouter.post("/:id/flags", createFlag); //^Creating the flag for whole project

module.exports = projectRouter;