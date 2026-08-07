const { getEnvId } = require("../model/sdkModel");
const AppError = require("../utils/AppError");
const connections = new Map();
const dashboardConnections = new Map();

exports.addClient = async (sdkKey, res)=>{
    const dbRes = await getEnvId(sdkKey);
    if(dbRes.length === 0){
        console.log("Changed the sdk key");
        res.write(`data: ${JSON.stringify({"sdkKeyChanged": true})}\n\n`);
        return null;
    }
    const envId = dbRes[0].id;
    if(!connections.has(envId))
        connections.set(envId, []);
    connections.get(envId).push(res);                                                                                                                                          
    console.log("Connection set");
    broadcastPresence(envId);
    return envId;
}

exports.removeClient = async (envId, res)=>{
    const envClients = connections.get(envId);
    if(envClients){
        const updated = envClients.filter(client => client !== res);
        connections.set(envId, updated);
        broadcastPresence(envId);
        console.log("Removed a client");
    }
}

exports.sendClient = async (envId, data) => {
    const envClients = connections.get(envId);
    if(!envClients){
        return;
    }
    envClients.forEach(res => {
        res.write(`data: ${JSON.stringify(data)}\n\n`)
    });
}

exports.addDashboardClient = async(res, envId)=>{
    if (!dashboardConnections.has(envId)) {
        dashboardConnections.set(envId, []);
    }
    dashboardConnections.get(envId).push(res);
    console.log("Dasboard Client added");
    
};

function broadcastPresence(environmentId) {
    const sdkClients = connections.get(environmentId) ?? [];
    const dashboardClients = dashboardConnections.get(environmentId) ?? [];
    const payload = `event: presence\ndata: ${JSON.stringify({ count: sdkClients.length })}\n\n`;

    // push the count to whoever's watching the dashboard
    dashboardClients.forEach(res => res.write(payload));
}


exports.removeDashboardClient = async (envId, res)=>{
    const envClients = dashboardConnections.get(envId);
    if(envClients){
        const updated = envClients.filter(client => client !== res);
        dashboardConnections.set(envId, updated);
        console.log("Removed a dashboard client");
    }
}