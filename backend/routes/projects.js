const express = require("express");
const {getProjects, insertProject,getAuditLogs, deleteAuditLogs, getProjectEnvironments, createProjectEnvironments, createFlag, deleteProjectEnvironment, editProject, deleteProject} = require("../controllers/projectController")

const projectRouter = express.Router();

projectRouter.get("/", getProjects)
projectRouter.post("/", insertProject);
projectRouter.patch("/:id", editProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.get("/:id/environments", getProjectEnvironments)
projectRouter.post("/:id/environments", createProjectEnvironments)
projectRouter.delete("/:id/environments/:envId", deleteProjectEnvironment)
projectRouter.post("/:id/flags", createFlag);
projectRouter.get("/:id/auditlogs", getAuditLogs)
projectRouter.delete("/:id/auditlogs", deleteAuditLogs)
module.exports = projectRouter;