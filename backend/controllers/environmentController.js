const { changeKey } = require("../model/environmentModel");

exports.rotateEnvironmentKey = async (req, res)=>{
    const envId = req.params.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(envId))
        return res.status(400).json({ message: "Invalid environment id" })

    try {
        const sdk_key = await changeKey(envId);

        if(!sdk_key)
            return res.status(404).json({message: "Environment not found"});

        return res.status(200).json(sdk_key)
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}