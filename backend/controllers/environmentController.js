const { response } = require("express");
const { changeKey, fetchAllFlags } = require("../model/environmentModel");
const AppError = require("../utils/AppError");


exports.rotateEnvironmentKey = async (req, res)=>{
    const envId = req.params.envId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(envId))
        throw new AppError("Invalid environment id", 400);
    const sdk_key = await changeKey(envId);

    if(!sdk_key)
        throw new AppError("Environment not found", 404);
    return res.status(200).json(sdk_key)
}


exports.getAllFlags = async (req, res)=>{
    const envId = req.params.envId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(envId))
        throw new AppError("Invalid environment id", 400);

    const flags = await fetchAllFlags(envId);
    console.log(flags)
    return res.json(flags);
}
