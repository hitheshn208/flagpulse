const {getFlags, getFlagsFromDb} = require("../model/sdkModel");
const {getFlagsFromCache, setFlagValuesToCache} = require("../model/flagCache");

exports.fetchFlags = async (req, res)=>{
    const sdkKey = req.get("x-sdk-key");
    if(!sdkKey)
        return res.status(401).json({
            message: "No sdk key"
    });

    try{
        const environment_id = await getFlags(sdkKey);
        
        if(!environment_id)
            return res.status(401).json({
                message: "Invalid sdk key"
        })

        let flags = await getFlagsFromCache(environment_id.id);
        //Fallback to db
        if(!flags){
            flags = await getFlagsFromDb(environment_id.id);
            await setFlagValuesToCache(environment_id.id, flags);
            console.log("Cache miss");
        }else
            console.log("Cache hit");
        
        return res.json(flags);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            messsge: "Internal Server error"
        })
    }
}