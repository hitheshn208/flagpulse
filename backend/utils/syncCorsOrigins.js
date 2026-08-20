const redisClient = require("../config/redis");
const { getAllUrls } = require("../model/projectModel");

const syncCorsOrigins = async () => {
    try {
        const dbresponse = await getAllUrls();

        const origins = dbresponse.flatMap(({ url }) => {
            try {
                return url ? [new URL(url).origin] : [];
            } catch {
                return [];
            }
        });

        if (origins.length) {
            await redisClient.sAdd("cors:origin", origins);
            console.log(`CORS origins synced: ${origins.length} origins`);
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = syncCorsOrigins;
