const { getEnvIdFromCache, setEnvIdToCache } = require("../model/flagCache");
const { getEnvId } = require("../model/sdkModel");
const AppError = require("../utils/AppError");
const connections = new Map();
const dashboardConnections = new Map();

exports.addClient = async (sdkKey, res) => {
    try {
        let environment_id = await getEnvIdFromCache(sdkKey);

        if (!environment_id) { // not found in cache
            environment_id = await getEnvId(sdkKey); // db fallback
            if (!environment_id) {
                res.write(`data: ${JSON.stringify({ type: "sdkKeyChanged" })}\n\n`);
                res.end();
                return null;
            }
            await setEnvIdToCache(environment_id, sdkKey);
        }

        if (!connections.has(environment_id))
            connections.set(environment_id, []);
        connections.get(environment_id).push(res);
        // broadcastPresence(environment_id);
        return environment_id;
    } catch (e) {
        res.end();
        return null;
    }
};

exports.removeClient = async (envId, res) => {
    const envClients = connections.get(envId);
    if (envClients) {
        const updated = envClients.filter(client => client !== res);
        connections.set(envId, updated);
        // broadcastPresence(envId);
    }
}

exports.sendClient = async (envId, data) => {
    const envClients = connections.get(envId);
    if (!envClients) {
        return;
    }
    envClients.forEach(res => {
        res.write(`data: ${JSON.stringify(data)}\n\n`)
    });
}

exports.addDashboardClient = async (res, envId) => {
    if (!dashboardConnections.has(envId)) {
        dashboardConnections.set(envId, []);
    }
    dashboardConnections.get(envId).push(res);

};

function broadcastPresence(environmentId) {
    const sdkClients = connections.get(environmentId) ?? [];
    const dashboardClients = dashboardConnections.get(environmentId) ?? [];
    const payload = `event: presence\ndata: ${JSON.stringify({ count: sdkClients.length })}\n\n`;

    // push the count to whoever's watching the dashboard
    dashboardClients.forEach(res => res.write(payload));
}


exports.removeDashboardClient = async (envId, res) => {
    const envClients = dashboardConnections.get(envId);
    if (envClients) {
        const updated = envClients.filter(client => client !== res);
        dashboardConnections.set(envId, updated);
    }
}