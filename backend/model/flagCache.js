const redisClient = require("../config/redis");
const rd = require("../config/redis");

exports.getFlagsFromCache = async (environment_id)=>{
    const flags = await rd.get(`flags@${environment_id}`);
    return JSON.parse(flags);
}

exports.setFlagValuesToCache = async (environment_id, flags)=>{
    await rd.set(`flags@${environment_id}`, JSON.stringify(flags), {type: "EX", value: 300});
}

exports.invalidateFlagValuesFromCache = async (envIds) => {
    if(Array.isArray(envIds)) {
        await Promise.all(envIds.map(id => rd.del(`flags@${id.environment_id}`)))
    } else {
        await rd.del(`flags@${envIds}`)    }
}

exports.editFlagValuesInCache = async (environment_id, flag)=>{
    const oldFlags = await this.getFlagsFromCache(environment_id);
    if(!oldFlags)
        return;

    const updatedFlags = oldFlags.map(f=>
        f.flag_id === flag.flag_id ?
        {...f, ...flag} :
        f
    )

    await this.setFlagValuesToCache(environment_id, updatedFlags);
}