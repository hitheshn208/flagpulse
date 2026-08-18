const db = require("../config/postgres");
const AppError = require("../utils/AppError");

exports.createProject = async ({name, slug, url, owner_id, description = null, environment_name, environment_slug, environment_icon}) =>{
    const client = await db.connect();
    try{
        await client.query("BEGIN");
        const response = await client.query("INSERT INTO projects (name, slug, url, owner_id, description) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, slug, url, created_at, description", [name, slug, url, owner_id, description]);
        await client.query("INSERT INTO environments (project_id, name, slug, icon) VALUES ($1, $2, $3, $4)", [response.rows[0].id, environment_name, environment_slug, environment_icon]);
        await client.query("COMMIT");
        response.rows[0]["environments_count"] = 1;
        response.rows[0]["flags_count"] = 0;
        return response.rows[0];
    }catch(error){
        await client.query("ROLLBACK")
        throw error
    }finally{
        client.release()        
    }
}

exports.getProjects = async (owner_id)=>{
    // const response = await db.query("SELECT id, name, slug, created_at FROM projects WHERE owner_id = $1", [owner_id]);
    const response = await db.query(`SELECT p.id, p.name, p.slug, p.created_at, p.description, count(distinct e.id) as environments_count, count(distinct f.id) as flags_count
                                        FROM projects p
                                        LEFT JOIN environments e ON p.id = e.project_id
                                        LEFT JOIN Flags f on p.id = f.project_id
                                        WHERE owner_id = $1
                                        GROUP BY p.id
                                        ORDER BY p.created_at`, [owner_id]);
    return response.rows;
}

exports.fetchAllEnvironments = async (projectId) =>{
    const project = await db.query(`SELECT id, name, slug, created_at FROM projects WHERE id = $1`, [projectId])
    if(project.rows.length === 0)
        throw new AppError("Project Not found", 400);

    const response = await db.query(`SELECT e.id, e.name, e.slug, e.sdk_key, e.created_at, e.icon, COUNT(fv.flag_id) as total_flags
        FROM environments e
        LEFT JOIN flag_values fv ON fv.environment_id = e.id
        WHERE e.project_id = $1
        GROUP BY e.id
        ORDER BY e.created_at`, [projectId]);

    return {project: project.rows[0], environments: response.rows};
}

exports.insertEnvironment = async (name, slug, projectId, icon) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const project = await client.query("SELECT * FROM projects WHERE id = $1", [projectId]);
        if (project.rows.length === 0)
            throw new AppError("No project found", 404);

        const envResult = await client.query(
            "INSERT INTO environments (project_id, name, slug, icon) VALUES ($1, $2, $3, $4) RETURNING id, name, slug, sdk_key, created_at, icon",
            [projectId, name, slug, icon]
        );
        const environment = envResult.rows[0];

        const rows = await client.query(
            `INSERT INTO flag_values (flag_id, environment_id, is_enabled, targeting_return_value)
            SELECT id, $1, false, default_value
            FROM flags
            WHERE project_id = $2
            RETURNING id`,
        [environment.id, projectId]
        );
            
        await client.query("COMMIT");

        environment["total_flags"] = rows.rowCount;
        return {environment};
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

exports.insertFlag = async (projectId, key, name, type, defaultValue, description) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN");
        const project = await client.query("SELECT * FROM projects WHERE id = $1", [projectId]);
        if (project.rows.length === 0)
            throw new AppError("No project found", 404);


        const response = await client.query(
            "INSERT INTO flags (project_id, key, name, type, default_value, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [projectId, key, name, type, defaultValue, description]
        );
        const flag_id = response.rows[0].id;

        const envIds = await client.query(
            `INSERT INTO flag_values (flag_id, environment_id, targeting_return_value)
            SELECT $1, id, $3
            FROM environments
            WHERE project_id = $2
            RETURNING environment_id`,
            [flag_id, projectId, defaultValue]
        );

        await client.query("COMMIT");
        return { flag_id, envIds: envIds.rows };

    } catch (err) {
        await client.query("ROLLBACK");

        if (err.code === "23514")
            throw new AppError("Invalid flag type", 400);
        else if (err.code === "23505")
            throw new AppError("Flag key already exists", 400);
        else
            throw err;

    }finally{
        await client.release();
    }
};

exports.removeEnvironment = async (projectId, envId) =>{
    const project = await db.query("SELECT * FROM projects WHERE id = $1", [projectId])
    if(project.rows.length === 0)
        throw new AppError("Project Not found", 400);

    const response = await db.query("DELETE FROM environments WHERE id = $1 AND project_id=$2 RETURNING *", [envId, projectId]);
    return response.rows[0]
}


exports.updateProject = async (projectId, name, slug)=>{
    const response = await db.query("UPDATE projects SET name = $1, slug = $2 WHERE id = $3", [name, slug, projectId]);
}

exports.removeProject = async (projectId)=>{
    const response = await db.query("DELETE FROM projects WHERE id = $1", [projectId]);
}


exports.testQuery = async ()=>{
    const response = await db.query(`select * from flags f join flag_values fs ON fs.flag_id = f.id`);
    return response.rows;
}