const { getFlagsFromDb, getEnvId} = require("../model/sdkModel");
const {getFlagsFromCache, setFlagValuesToCache, getEnvIdFromCache, setEnvIdToCache } = require("../model/flagCache");

exports.fetchFlags = async (req, res)=>{
    const sdkKey = req.get("x-sdk-key");
    if(!sdkKey)
        return res.status(401).json({
            message: "No sdk key"
    });

    try{
        let environment_id = await getEnvIdFromCache(sdkKey);

        if(!environment_id){
            environment_id = await getEnvId(sdkKey); //^ fallback to db
            if(!environment_id)
                return res.status(401).json({ message: "Invalid sdk key" });
            await setEnvIdToCache(environment_id, sdkKey);
        }


        let flags = await getFlagsFromCache(environment_id); //^ Fallback to db
        if(!flags){
            flags = await getFlagsFromDb(environment_id);
            await setFlagValuesToCache(environment_id, flags);
        }
        
        return res.json(flags);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            messsge: "Internal Server error"
        })
    }
}