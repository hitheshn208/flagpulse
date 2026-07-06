const {createProject, createDefaultEnvironments, getProjects, fetchAllEnvironments, insertEnvironment, insertFlag} = require("../model/projectModel");
const AppError = require("../utils/AppError");

exports.getProjects = async (req, res)=>{
    const owner_id = req.user.id;
    const projects = await getProjects(owner_id);
    res.json(projects);        
}

exports.insertProjects = async (req, res)=>{
    const {name} = req.body;
    if(!name)
        throw new AppError("Project name required", 400);
    
    const owner_id = req.user.id;
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const project = await createProject(name, slug, owner_id);
    // await createDefaultEnvironments(project.id);  //!LOOOK INTO THISS
    res.status(201).json(project)      
}

exports.getProjectEnvironments = async (req, res)=>{
    const projectId = req.params.id;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        throw new AppError("Invalid Project Id", 400)

    const environments = await fetchAllEnvironments(projectId);
    if(environments.length === 0) 
        throw new AppError("No environments for this project", 404)

    return res.json(environments);
}

exports.createProjectEnvironments = async (req, res)=>{
    const projectId = req.params.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        throw new AppError("Invalid project Id", 400);

    const {name} = req.body;
    if(!name)
        throw new AppError("Environment name required", 400);
    
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    await insertEnvironment(name, slug, projectId);
    return res.status(201).json({
        message: "Enviroment added"
    })
    ;
}

exports.createFlag = async (req, res)=>{
    const projectId = req.params.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        throw new AppError("Invalid project Id", 400);
    
    const {key, name, type, default_value} = req.body;
    console.log(key, name, type, default_value);
    if(!key || !name || !type || !default_value)
        throw new AppError("Information missing", 404);

    await insertFlag(projectId, key, name, type, default_value);
    return res.status(201).json({
        message: "Flag created"
    })
    ;
}