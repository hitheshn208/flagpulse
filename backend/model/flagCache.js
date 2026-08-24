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

exports.getEnvIdFromCache = async (sdk_key)=>{
    return await rd.get(`envId@${sdk_key}`);
}

exports.setEnvIdToCache = async (environment_id, sdk_key)=>{
    await rd.set(`envId@${sdk_key}`, environment_id, { EX: 300 })
}

exports.invalidateSdkKeyAndSet = async(oldSdkKey, newSdkKey, environmentId)=>{
    await Promise.all([
        rd.del(`envId@${oldSdkKey}`),
        rd.set(`envId@${newSdkKey}`, environmentId, { EX: 300 })
    ]);
}

exports.addNewOriginToCache = async(url)=>{
    try {
        const origin = new URL(url).origin
        if(origin)
            await rd.sAdd("cors:origin", origin)
    } catch (error) {
        return;
    }
}

exports.removeOriginFromCache = async (url)=>{
    try {
        const origin = new URL(url).origin
        if(origin)
            await rd.sRem("cors:origin", origin)
    } catch (error) {
        return;
    }
}


exports.changeCacheOrigin = async (oldUrl, newUrl)=>{
    try {
        await Promise.all([
            rd.sRem("cors:origin", oldUrl),
            rd.sAdd("cors:origin", newUrl)
        ])
    } catch (error) {
        return;
    }
}