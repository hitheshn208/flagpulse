const db = require("../config/postgres");
const AppError = require("../utils/AppError");

exports.insertAuditLog = async (projectId, flagId, envId, user_id, change_summary, old_value, new_value, reason, type, domain)=>{
    if(Array.isArray(envId)) {
        await Promise.all(envId.map(id => {
            return db.query(`INSERT INTO audit_logs (project_id, flag_id, environment_id, user_id, change_summary, old_value, new_value, reason, type, domain)        
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8. $9, $10)`,[projectId, flagId, id.environment_id, user_id, change_summary, old_value, new_value, reason, type, domain])
        }))
    }else{
        await db.query(`INSERT INTO audit_logs (project_id, flag_id, environment_id, user_id, change_summary, old_value, new_value, reason, type, domain)        
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,[projectId, flagId, envId, user_id, change_summary, old_value, new_value, reason, type, domain])
    }

    return;
}

exports.getLogs = async (flagId, projectId, userId) =>{
    const response = await db.query(`SELECT 
        al.id,
        al.project_id,
        al.flag_id,
        al.environment_id,
        al.user_id,
        al.change_summary,
        al.old_value,
        al.new_value,
        al.reason,
        al.type,
        al.domain,
        al.created_at,
        f.key as flag_key,
        e.name as environment_name,
        u.name as user_name
        
        FROM audit_logs al
        
        LEFT JOIN flags f ON f.id = al.flag_id
        LEFT JOIN environments e ON e.id = al.environment_id
        LEFT JOIN users u ON u.id = al.user_id

        WHERE al.project_id = $1 AND al.user_id = $2 AND al.flag_id = $3

        ORDER BY al.created_at DESC
        
        LIMIT 5`, [projectId, userId, flagId]);

    return response.rows;
}

exports.getProjectLogs = async (userId, projectId)=>{
    const response = await db.query(`SELECT 
        al.id,
        al.project_id,
        al.flag_id,
        al.environment_id,
        al.user_id,
        al.change_summary,
        al.old_value,
        al.new_value,
        al.reason,
        al.type,
        al.domain,
        al.created_at,
        f.key as flag_key,
        e.name as environment_name,
        u.name as user_name
        
        FROM audit_logs al
        
        LEFT JOIN flags f ON f.id = al.flag_id
        LEFT JOIN environments e ON e.id = al.environment_id
        LEFT JOIN users u ON u.id = al.user_id

        WHERE al.project_id = $1 AND al.user_id = $2

        ORDER BY al.created_at DESC
        
        LIMIT 15`, [projectId, userId]);

        return response.rows
}


exports.removeAuditLogs = async (userId, projectId)=>{
    await db.query("DELETE FROM audit_logs WHERE user_id = $1 AND project_id = $2", [userId, projectId])
    return;
}