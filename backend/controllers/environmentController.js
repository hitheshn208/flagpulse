const { response } = require("express");
const { changeKey, fetchAllFlags } = require("../model/environmentModel");
const AppError = require("../utils/AppError");
const { insertAuditLog } = require("../model/auditLogModel");
const { invalidateSdkKeyAndSet } = require("../model/flagCache");


exports.rotateEnvironmentKey = async (req, res)=>{
    const envId = req.params.envId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(envId))
        throw new AppError("Invalid environment id", 400);

    const row = await changeKey(envId);

    if (!row)
        throw new AppError("Environment not found", 404);
    const { old_sdk_key, new_sdk_key, name } = row;

    await invalidateSdkKeyAndSet(old_sdk_key, new_sdk_key, envId)
    await insertAuditLog(req.projectId, null, envId, req.user.id, `Rotated SDK Key of ${name} environment`, null, null, null, "key_rotation", "environment")
    return res.status(200).json(new_sdk_key)
}


exports.getAllFlags = async (req, res)=>{
    const envId = req.params.envId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(envId))
        throw new AppError("Invalid environment id", 400);

    const flags = await fetchAllFlags(envId);
    return res.json(flags);
}
