const {createProject, createDefaultEnvironments, getProjects, fetchAllEnvironments, insertEnvironment} = require("../model/projectModel");

exports.getProjects = async (req, res)=>{
    const owner_id = req.user.id;
    try {
        const projects = await getProjects(owner_id);
        res.json(projects);    
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
    
}

exports.insertProjects = async (req, res)=>{
    const {name} = req.body;
    if(!name)
        return res.status(400).json({
            message: "Project name required"
        });
    
    const owner_id = req.user.id;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    
    try{
        const project = await createProject(name, slug, owner_id);
        await createDefaultEnvironments(project.id);
        res.status(201).json(project)
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
        
}

exports.getProjectEnvironments = async (req, res)=>{
    const projectId = req.params.id;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        return res.status(400).json({ message: "Invalid project id" })

    try {
        const environments = await fetchAllEnvironments(projectId);
        if(environments.length === 0) 
            return res.status(404).json({
                message: "No environments found for projects"
            })
        return res.json(environments);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

exports.createProjectEnvironments = async (req, res)=>{
    const projectId = req.params.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(projectId))
        return res.status(400).json({ message: "Invalid project id" })

    const {name} = req.body;
    if(!name)
        return res.status(400).json({
            message: "Environment name required"
        });
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    try {
        await insertEnvironment(name, slug, projectId);
        return res.status(201).json({
            message: "Enviroment added"
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}