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
    const response = await db.query("SELECT id, name, slug, sdk_key, created_at FROM environments WHERE project_id = $1", [projectId]);
    return response.rows;
}

exports.insertEnvironment = async (name, slug, projectId) =>{
    await db.query("INSERT INTO environments (project_id, name, slug) VALUES ($1, $2, $3)", [projectId, name, slug]);
}

exports.insertFlag = async (projectId, key, name, type, defaultValue)=>{
    //! Violates referential integrity Constraint if Env id id sent instead if project Id and server crashes
    const project = await db.query("SELECT * FROM projects WHERE id = $1", [projectId]);
    if(project.rows.length === 0)
        throw new AppError("No project found", 404);

    const response = await db.query("INSERT INTO flags (project_id, key, name, type) VALUES ($1, $2, $3, $4) RETURNING id", [projectId, key, name, type]);
    const flag_id = response.rows[0].id;
    await db.query(`INSERT INTO flag_values (flag_id, environment_id, default_value)
                    SELECT $1, id, $2
                    FROM environments
                    WHERE project_id = $3`, [flag_id, defaultValue, projectId]);    
}