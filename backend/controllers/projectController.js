const {createProject, createDefaultEnvironments, getProjects, fetchAllEnvironments, insertEnvironment, insertFlag, removeEnvironment, updateProject, removeProject} = require("../model/projectModel");
const {invalidateFlagValuesFromCache} = require("../model/flagCache");
const AppError = require("../utils/AppError");
const { insertAuditLog } = require("../model/auditLogModel");
const { sendClient } = require("../services/sse");

exports.getProjects = async (req, res)=>{
    const owner_id = req.user.id;
    const projects = await getProjects(owner_id);
    res.json(projects);        
}

exports.insertProjects = async (req, res)=>{
    const {name, description} = req.body;
    if(!name)
        throw new AppError("Project name required", 400);
    
    const owner_id = req.user.id;
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const project = await createProject(name, slug, owner_id, description);
    // await createDefaultEnvironments(project.id);  //!LOOOK INTO THISS
    res.status(201).json(project)      
}

exports.getProjectEnvironments = async (req, res)=>{
    const projectId = req.params.id;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        throw new AppError("Invalid Project Id", 400)
    const {project, environments, stats} = await fetchAllEnvironments(projectId);

    return res.json({project, environments, stats});
}

exports.createProjectEnvironments = async (req, res)=>{
    const projectId = req.params.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        throw new AppError("Invalid project Id", 400);

    const {name, icon} = req.body;
    if(!name)
        throw new AppError("Environment name required", 400);
    
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const {environment, flags} = await insertEnvironment(name, slug, projectId, icon);
    return res.status(201).json({
        environment, 
        flags
    });
}

exports.createFlag = async (req, res)=>{
    const projectId = req.params.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        throw new AppError("Invalid project Id", 400);
    
    const {key, name, type, value, description} = req.body;

    if(!key || !name || !type)
        throw new AppError("Information missing", 404);

    const validTypes = ['boolean', 'string', 'number', 'json']
    if (!validTypes.includes(type))
        throw new AppError("Invalid flag type", 400);

    let serialisedValue = value;

    if(type === 'string' || type === 'json')
        serialisedValue = JSON.stringify(value);

    const {flag_id, envIds} = await insertFlag(projectId, key, name, type, serialisedValue, description);
    await invalidateFlagValuesFromCache(envIds);//^Invalidate in cache
    await insertAuditLog(flag_id, envIds, req.user.id, "New flag added", null, null, null, "create"); //^Log creation
    await Promise.all(envIds.map(id=> sendClient(id.environment_id, {type: "flag_created", flag_id}))); //^Send event

    return res.status(201).json({
        message: "Flag created"
    });
}


exports.deleteProjectEnvironment = async (req, res)=>{
    const projectId = req.params.id;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        throw new AppError("Invalid project Id", 400);

    const envId = req.params.envId;
    if (!uuidRegex.test(envId))
        throw new AppError("Invalid environment Id", 400);

    await removeEnvironment(projectId, envId)

    return res.status(200).json({
        message : "Flag delete successfully"
    })
}

exports.editProject = async (req, res) => {
    const projectId = req.params.id;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        throw new AppError("Invalid project Id", 400);

    const {name} = req.body;
        if(!name)
            throw new AppError("Project Name required", 404);

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    await updateProject(projectId, name, slug);
    return res.json({
        message: "Project updated successfully"
    })
}

exports.deleteProject = async (req, res) => {
    const projectId = req.params.id;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        throw new AppError("Invalid project Id", 400);

    await removeProject(projectId);
    return res.json({
        message: "Project deleted successfully"
    })
}