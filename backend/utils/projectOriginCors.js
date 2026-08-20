const redisClient = require("../config/redis");
const syncCorsOrigins = require("./syncCorsOrigins");
const cors = require("cors");

const projectOriginCors = cors({
    origin: async (origin, callback) => {
        try {
        if (!origin) {
            return callback(null, true);
        }

        const allowed = await redisClient.sIsMember("cors:origin", origin);

        if (allowed) {
            return callback(null, true);
        }

        callback(new Error("Origin not allowed"));
        } catch (err) {
        callback(err);
        }
    },
    credentials: true,
})

module.exports = projectOriginCors;