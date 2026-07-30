const db = require("../config/postgres");
const AppError = require("../utils/AppError");

exports.changeFlagValue = async ({is_enabled,  rollout_percentage, targeting_attribute, targeting_value, targeting_return_value, flagId, envId}) => {
    let response = {}; 
    response["old"] = await db.query(`SELECT is_enabled, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value
        FROM flag_values WHERE flag_id = $1 AND environment_id = $2`, [flagId, envId]);
    
    if(response.old.rows.length === 0)
        throw new AppError("Flag not found", 404);

    if(typeof targeting_return_value === 'string')
        targeting_return_value = JSON.stringify(targeting_return_value);

    response["new"] = await db.query(`UPDATE flag_values SET 
        is_enabled = $1,
        rollout_percentage = $2,
        targeting_attribute = $3,
        targeting_value = $4,
        targeting_return_value = $5
        WHERE flag_id = $6 AND environment_id = $7
        RETURNING is_enabled, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value`, 
        [is_enabled, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value, flagId, envId]);

    return response;
}

exports.removeFlag = async (flagId) => {
    const response = await db.query("DELETE FROM flags where id = $1 RETURNING id", [flagId]);
    if(response.rows.length === 0)
        throw new AppError("Flag not found", 404);
}

exports.changeFlagStatus = async ({flagId, envId, is_enabled})=>{
    const response = await db.query(`UPDATE flag_values SET is_enabled = $1, updated_at = NOW() WHERE flag_id = $2 AND environment_id = $3 
        RETURNING flag_id, is_enabled, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value`, [is_enabled, flagId, envId])
    if(response.rows.length === 0)
        throw new AppError("Unable to change the flag value", 404);
    return response.rows[0];
}

exports.getEnvIdsOfFlags = async (flagId)=>{
    const envIds = await db.query("SELECT environment_id FROM flag_values WHERE flag_id = $1", [flagId])
    return envIds.rows;
}