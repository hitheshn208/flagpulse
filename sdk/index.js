const CacheManager = require("./cache");
const SSEManager = require("./sse");

class FlagbaseClient {
    constructor({ sdkKey, baseUrl, ttl }) {
        if (!sdkKey) throw new Error("sdkKey is required");
        if (!baseUrl) throw new Error("baseUrl is required");

        this.sdkKey = sdkKey;
        this.baseUrl = baseUrl;

        this.cache = new CacheManager(ttl);
        this.sse = new SSEManager(baseUrl, this._onFlagUpdate.bind(this));

        this.flags = [];
        this.context = null;
        this.listeners = new Set();
    }

    async init() {
        let flags = this.cache.get();

        if (!flags) {
            flags = await this._fetchFlags();
            this.cache.set(flags);
        }

        this.flags = flags;

        this.sse.connect(this.sdkKey);
    }

    async _fetchFlags() {
        const response = await fetch(`${this.baseUrl}/api/v1/flags`, {
            headers: {
                "x-sdk-key": this.sdkKey
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch flags");
        }

        return response.json();
    }

    get(flagKey, fallback) {
        const flag = this.flags.find(f => f.key === flagKey);
        
        if(!flag)
            return fallback;
        if (flag.type === "boolean")
            return flag.is_enabled
        if (flag.type === "string")
            return flag.default_value
        if (flag.type === "number")
            return Number(flag.default_value)
        if (flag.type === "json")
            return JSON.parse(flag.default_value)
        return fallback;
    }

    identify(context) {
        this.context = context;
    }

    async _onFlagUpdate(data) {
        try {
            const flags = await this._fetchFlags();

            this.flags = flags;
            this.cache.set(flags);
            this.listeners.forEach(cb => cb(this.flags));
        } catch (err) {
            console.error("Failed to refresh flags", err);
        }
    }

    onUpdate(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    destroy() {
        this.sse.disconnect();
        this.cache.clear();

        this.flags = [];
        this.context = null;
        this.listeners.clear();  
    }
}

window.FlagbaseClient = FlagbaseClient;