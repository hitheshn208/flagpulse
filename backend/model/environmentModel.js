const db = require("../config/postgres");

exports.changeKey = async (envId)=>{
    const response = await db.query("UPDATE environments SET sdk_key = gen_random_uuid() WHERE id = $1 RETURNING sdk_key", [envId]);
    console.log(response.rows);
    return response.rows[0];
}

exports.fetchAllFlags = async (envId)=>{
    const response = await db.query(`SELECT f.id, f.name, f.key, f.type, fv.environment_id, fv.is_enabled, fv.default_value, fv.rollout_percentage, fv.targeting_attribute, fv.targeting_value, fv.targeting_return_value, fv.updated_at
        FROM flag_values fv
        JOIN flags f ON f.id = fv.flag_id
        WHERE fv.environment_id = $1`, [envId]);
    return response.rows;
}