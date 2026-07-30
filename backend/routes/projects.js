const express = require("express");
const {getProjects, insertProjects, getProjectEnvironments, createProjectEnvironments, createFlag, deleteProjectEnvironment, editProject, deleteProject} = require("../controllers/projectController")

const projectRouter = express.Router();

projectRouter.get("/", getProjects)
projectRouter.post("/", insertProjects);
projectRouter.patch("/:id", editProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.get("/:id/environments", getProjectEnvironments)
projectRouter.post("/:id/environments", createProjectEnvironments)
projectRouter.delete("/:id/environments/:envId", deleteProjectEnvironment)
projectRouter.post("/:id/flags", createFlag); //^Creating the flag for whole project

module.exports = projectRouter;