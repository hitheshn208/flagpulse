const AppError = require("../utils/AppError");
const {changeFlagValue, removeFlag, changeFlagStatus} = require("../model/flagModel");
const {invalidateFlagValuesFromCache} = require("../model/flagCache");
const { insertAuditLog, getLogs } = require("../model/auditLogModel");
const { sendClient } = require("../services/sse");

exports.editFlagValue = async (req, res) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    const flagId = req.params.flagId;
    if (!uuidRegex.test(flagId))
        throw new AppError("Invalid flag id", 400);

    const envId = req.params.envId;
    if (!uuidRegex.test(envId))
        throw new AppError("Invalid environment id", 400);

    const { is_enabled, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value, reason } = req.body;

    const response = await changeFlagValue({flagId, envId, is_enabled, rollout_percentage, targeting_attribute, targeting_value, targeting_return_value});
    await invalidateFlagValuesFromCache(envId);//^Invalidate from cache
    
    const old_value = JSON.stringify(response.old.rows[0]);
    const new_value = JSON.stringify(response.new.rows[0]);

    await insertAuditLog(flagId, envId, req.user.id, "Flag value changed", old_value, new_value, reason ? reason : null, "update"); //^Log the changes
    console.log("Sending SSE event to:", envId)
    await sendClient(envId, { type: "flag_updated", ...response.new.rows[0] } ); //^Send edited flags
    return res.json(response.new.rows);
}

exports.deleteFlag = async (req, res)=>{
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    const flagId = req.params.flagId;
    if (!uuidRegex.test(flagId))
        throw new AppError("Invalid flag id", 400);

    const envIds = await removeFlag(flagId);
    await invalidateFlagValuesFromCache(envIds);//^Invalidate in cache
    await insertAuditLog(flagId, envIds, req.user.id, "Flag deleted", null, null, null, "delete");//^add to Log
    
    await Promise.all(envIds.map(id=> sendClient(id.environment_id, {type: "flag_deleted", flag_id: flagId})));//^Send event to all evnironments associated to the flag

    return res.json({
        success: true,
        message: "Flag deleted"
    })
}

exports.flagLogs = async (req,res)=>{
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    const flagId = req.params.flagId;
    if (!uuidRegex.test(flagId))
        throw new AppError("Invalid flag id", 400);

    const logs = await getLogs(flagId);

    return res.json(logs);
}

exports.toggleFlag = async (req, res) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    const flagId = req.params.flagId;
    if (!uuidRegex.test(flagId))
        throw new AppError("Invalid flag id", 400);

    const envId = req.params.envId;
    if (!uuidRegex.test(envId))
        throw new AppError("Invalid environment id", 400);

    const {is_enabled} = req.body;
    const response = await changeFlagStatus({envId, flagId, is_enabled});
    await invalidateFlagValuesFromCache(envId);
    await sendClient(envId, { type: "flag_updated", ...response } );
    return res.json(response);
}