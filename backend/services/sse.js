const { getEnvId } = require("../model/sdkModel");
const connections = new Map();

exports.addClient = async (sdkKey, res)=>{
    const envId = await getEnvId(sdkKey);
    if(!connections.has(envId))
        connections.set(envId, []);
    connections.get(envId).push(res);                                                                                                                                          
    console.log("Connection set");
    return envId;
}

exports.removeClient = async (envId, res)=>{
    const envClients = connections.get(envId);
    if(envClients){
        const updated = envClients.filter(client => client !== res);
        connections.set(envId, updated);
        console.log("Removed a client");
    }
}

exports.sendClient = async (envId, data) => {
    const envClients = connections.get(envId);
    if(!envClients)
        return;
    envClients.forEach(res => {
        res.write(`data: ${JSON.stringify(data)}\n\n`)
    });
}