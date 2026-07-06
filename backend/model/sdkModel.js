const db = require("../config/postgres");

exports.getFlags = async (sdkKey)=>{
    const response = await db.query("SELECT * FROM environments WHERE sdk_key = $1", [sdkKey]);
    return response.rows[0];
}

exports.getFlagsFromDb = async(environment_id)=>{
    const response = await db.query(
`SELECT f.id as flag_id, f.key, f.name, f.type, fv.is_enabled, fv.default_value, fv.rollout_percentage, fv.targeting_attribute, fv.targeting_value, fv.targeting_return_value 
FROM flag_values fv 
JOIN flags f ON f.id = fv.flag_id
WHERE environment_id=$1`, [environment_id]);

    return response.rows;
}

exports.getEnvId = async(sdkKey) =>{
    const response = await db.query("SELECT id FROM environments WHERE sdk_key = $1", [sdkKey]);
    return response.rows[0].id;
}