const db = require("../config/postgres")
exports.createProject = async (name, slug, owner_id) =>{
    const response = await db.query("INSERT INTO projects (name, slug, owner_id) VALUES ($1, $2, $3) RETURNING name, id", [name, slug, owner_id]);
    return response.rows[0];
}

exports.createDefaultEnvironments = async (id)=>{
    await db.query("INSERT INTO environments (project_id, name, slug) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)",
        [id, "Development", "dev",
        id, "Staging", "staging",
        id, "Production", "production"]
    )
}

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