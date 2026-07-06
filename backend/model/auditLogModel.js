const db = require("../config/postgres");
const AppError = require("../utils/AppError");

exports.insertAuditLog = async (flagId, envId, user_id, change_summary, old_value, new_value, reason, type)=>{
    if(Array.isArray(envId)) {
        await Promise.all(envId.map(id => {
            return db.query(`INSERT INTO audit_logs (flag_id, environment_id, user_id, change_summary, old_value, new_value, reason, type)        
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,[flagId, id.environment_id, user_id, change_summary, old_value, new_value, reason, type])
        }))
    }else{
        await db.query(`INSERT INTO audit_logs (flag_id, environment_id, user_id, change_summary, old_value, new_value, reason, type)        
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,[flagId, envId, user_id, change_summary, old_value, new_value, reason, type])
    }
}

exports.getLogs = async (flagId) =>{
    const response = await db.query("SELECT * FROM audit_logs WHERE flag_id = $1 ORDER BY created_at DESC", [flagId]);
    if(response.rows.length === 0)
        throw new AppError("Flag not found", 404); //^ Min 1 log (when the flag was created) will be there

    return response.rows;
}