const rd = require("../config/redis");

exports.getFlagsFromCache = async (environment_id)=>{
    const flags = await rd.get(`flags@${environment_id}`);
    return JSON.parse(flags);
}

exports.setFlagValuesToCache = async (environment_id, flags)=>{
    await rd.set(`flags@${environment_id}`, JSON.stringify(flags));
}