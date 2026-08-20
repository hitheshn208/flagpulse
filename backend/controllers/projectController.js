const {
    createProject,
    getProjects,
    fetchAllEnvironments,
    insertEnvironment,
    insertFlag,
    removeEnvironment,
    updateProject,
    removeProject
} = require("../model/projectModel");
const { invalidateFlagValuesFromCache } = require("../model/flagCache");
const AppError = require("../utils/AppError");
const { insertAuditLog, getProjectLogs, removeAuditLogs } = require("../model/auditLogModel");
const { sendClient } = require("../services/sse");
const { response } = require("express");

exports.getProjects = async (req, res) => {
    const owner_id = req.user.id;
    const projects = await getProjects(owner_id);
    res.json(projects);
};

exports.insertProject = async (req, res) => {
    const { name, description, url, environment_name, environment_icon } =
        req.body;
    if (!name) throw new AppError("Project name required", 400);

    const owner_id = req.user.id;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const environment_slug = environment_name.toLowerCase().replace(/\s+/g, "-");

    const project = await createProject({
        name,
        slug,
        url,
        owner_id,
        description,
        environment_name,
        environment_icon,
        environment_slug,
    });
    await insertAuditLog(
        project.id,
        null,
        null,
        req.user.id,
        `New Project ${project.name} was created`,
        null,
        null,
        null,
        "project_creation",
        "project",
    );
    res.status(201).json(project);
};

exports.getProjectEnvironments = async (req, res) => {
    const projectId = req.params.id;

    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) throw new AppError("Invalid Project Id", 400);
    const { project, environments, stats } =
        await fetchAllEnvironments(projectId);

    return res.json({ project, environments, stats });
};

exports.createProjectEnvironments = async (req, res) => {
    const projectId = req.params.id;
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) throw new AppError("Invalid project Id", 400);

    const { name, icon } = req.body;
    if (!name) throw new AppError("Environment name required", 400);

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const { environment } = await insertEnvironment(name, slug, projectId, icon);
    await insertAuditLog(
        projectId,
        null,
        null,
        req.user.id,
        `New environment ${environment.name} was created`,
        null,
        null,
        null,
        "environment_creation",
        "environment",
    );
    return res.status(201).json({
        environment,
    });
};

exports.createFlag = async (req, res) => {
    const projectId = req.params.id;
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) throw new AppError("Invalid project Id", 400);

    const { key, name, type, default_value, description } = req.body;

    if (!key || !name || !type) throw new AppError("Information missing", 404);

    const validTypes = ["boolean", "string", "number", "json"];
    if (!validTypes.includes(type)) throw new AppError("Invalid flag type", 400);

    let serialisedValue = default_value;

    if (type === "string" || type === "json")
        serialisedValue = JSON.stringify(default_value);

    const { flag_id, envIds } = await insertFlag(
        projectId,
        key,
        name,
        type,
        serialisedValue,
        description,
    );
    await invalidateFlagValuesFromCache(envIds); //^Invalidate in cache
    await insertAuditLog(
        projectId,
        flag_id,
        null,
        req.user.id,
        `New flag ${name} was created`,
        null,
        serialisedValue,
        null,
        "flag_creation",
        "flag",
    ); //^Log creation
    await Promise.all(
        envIds.map((id) =>
            sendClient(id.environment_id, { type: "flag_created", flag_id }),
        ),
    ); //^Send event

    return res.status(201).json({
        flag_id,
        envIds,
        message: "Flag created",
    });
};

exports.deleteProjectEnvironment = async (req, res) => {
    const projectId = req.params.id;

    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) throw new AppError("Invalid project Id", 400);

    const envId = req.params.envId;
    if (!uuidRegex.test(envId)) throw new AppError("Invalid environment Id", 400);

    const deletedEnv = await removeEnvironment(projectId, envId);
    await insertAuditLog(
        projectId,
        null,
        null,
        req.user.id,
        `${deletedEnv.name} environment was deleted`,
        deletedEnv.name,
        null,
        null,
        "environment_deletion",
        "environment",
    );
    return res.status(200).json({
        message: "Flag delete successfully",
    });
};

exports.editProject = async (req, res) => {
    const projectId = req.params.id;

    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) throw new AppError("Invalid project Id", 400);

    const { name, url } = req.body;
    if (!name) throw new AppError("Project Name required", 404);

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    await updateProject(projectId, name, slug, url);
    return res.json({
        message: "Project updated successfully",
    });
};

exports.deleteProject = async (req, res) => {
    const projectId = req.params.id;

    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) throw new AppError("Invalid project Id", 400);

    await removeProject(projectId);
    return res.json({
        message: "Project deleted successfully",
    });
};

exports.getAuditLogs = async (req, res)=>{
    const userId = req.user.id;
    const projectId = req.params.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) throw new AppError("Invalid project Id", 400);

    const logs = await getProjectLogs(userId, projectId);

    return res.json(logs);
}

exports.deleteAuditLogs = async (req, res)=>{
    const userId = req.user.id;
    const projectId = req.params.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) throw new AppError("Invalid project Id", 400);

    await removeAuditLogs(userId, projectId);

    return res.json({
        message: "Audit logs deleted"
    })
}