const db = require("../config/postgres");
const AppError = require("../utils/AppError");

exports.changeFlagValue = async ({is_enabled, default_value, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value, flagId, envId}) => {
    let response = {}; 
    response["old"] = await db.query(`SELECT is_enabled, default_value, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value
        FROM flag_values WHERE flag_id = $1 AND environment_id = $2`, [flagId, envId]);
    
    if(response.old.rows.length === 0)
        throw new AppError("Flag not found", 404);

    response["new"] = await db.query(`UPDATE flag_values SET 
        is_enabled = $1,
        default_value = $2,
        rollout_percentage = $3,
        targeting_attribute = $4,
        targeting_value = $5,
        targeting_return_value = $6
        WHERE flag_id = $7 AND environment_id = $8
        RETURNING is_enabled, default_value, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value`, 
        [is_enabled, default_value, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value, flagId, envId]);

    return response;
}

exports.removeFlag = async (flagId) => {
    const envIds = await db.query("SELECT environment_id FROM flag_values WHERE flag_id = $1", [flagId])
    const response = await db.query("DELETE FROM flags where id = $1 RETURNING id", [flagId]);
    if(response.rows.length === 0)
        throw new AppError("Flag not found", 404);
    return envIds.rows;
}
