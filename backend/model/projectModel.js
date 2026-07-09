const db = require("../config/postgres");
const AppError = require("../utils/AppError");

exports.createProject = async (name, slug, owner_id) =>{
    const response = await db.query("INSERT INTO projects (name, slug, owner_id) VALUES ($1, $2, $3) RETURNING name, id", [name, slug, owner_id]);
    return response.rows[0];
}

// exports.createDefaultEnvironments = async (id)=>{
//     await db.query("INSERT INTO environments (project_id, name, slug) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)",
//         [id, "Development", "dev",
//         id, "Staging", "staging",
//         id, "Production", "production"]
//     )
// }

exports.getProjects = async (owner_id)=>{
    const response = await db.query("SELECT id, name, slug, created_at FROM projects WHERE owner_id = $1", [owner_id]);
    return response.rows;
}

exports.fetchAllEnvironments = async (projectId) =>{
    const response = await db.query(`SELECT e.id, e.name, e.slug, e.sdk_key, e.created_at, e.icon, COUNT(fv.flag_id) as total_flags
        FROM environments e
        JOIN flag_values fv ON fv.environment_id = e.id
        WHERE project_id = $1
        GROUP BY e.id`, [projectId]);

    const project = await db.query("SELECT id, name, slug, created_at FROM projects WHERE id = $1", [projectId])
    if(project.rows.length === 0)
        throw new AppError("Project Not found", 400);
    return {project: project.rows[0], environments: response.rows};
}

exports.insertEnvironment = async (name, slug, projectId) =>{
    await db.query("INSERT INTO environments (project_id, name, slug) VALUES ($1, $2, $3)", [projectId, name, slug]);
}

exports.insertFlag = async (projectId, key, name, type, defaultValue)=>{
    // ! Violates referential integrity Constraint if Env id id sent instead if project Id and server crashes
    try{
        const project = await db.query("SELECT * FROM projects WHERE id = $1", [projectId]);
        if(project.rows.length === 0)
            throw new AppError("No project found", 404);

        const response = await db.query("INSERT INTO flags (project_id, key, name, type) VALUES ($1, $2, $3, $4) RETURNING id", [projectId, key, name, type]);
        const flag_id = response.rows[0].id;
        const evnIds = await db.query(`INSERT INTO flag_values (flag_id, environment_id, default_value)
                        SELECT $1, id, $2
                        FROM environments
                        WHERE project_id = $3 RETURNING environment_id`, [flag_id, defaultValue, projectId]);    
        return {flag_id, envIds: evnIds.rows};
    }catch (err){
        if(err.code === "23514")
            throw new AppError("Invalid flag type", 400);
        else if(err.code === "23505")
            throw new AppError("Flag key already exists", 400)
        else
            throw err;
    }
}