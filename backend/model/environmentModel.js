const db = require("../config/postgres");

exports.changeKey = async (envId)=>{
    const response = await db.query("UPDATE environments SET sdk_key = gen_random_uuid() WHERE id = $1 RETURNING sdk_key, name", [envId]);
    console.log(response.rows);
    return response.rows[0];
}

exports.fetchAllFlags = async (envId)=>{
    const response = await db.query(`
        SELECT f.id, f.name, f.key, f.type, f.description, f.created_at,  fv.environment_id, fv.is_enabled, f.default_value, fv.rollout_percentage, fv.targeting_attribute, fv.targeting_value, fv.targeting_return_value, fv.updated_at
        FROM flag_values fv
        JOIN flags f ON f.id = fv.flag_id
        WHERE fv.environment_id = $1
        ORDER BY created_at `, [envId]);
    return response.rows;
}