import CacheManager from "./cache.js";
import SSEManager from "./sse.js";

export default class FlagPulseClient {
    constructor({ sdkKey, baseUrl, ttl }) {
        if (!sdkKey) throw new Error("sdkKey is required");
        if (!baseUrl) throw new Error("baseUrl is required");

        this.sdkKey = sdkKey;
        this.baseUrl = baseUrl;

        this.cache = new CacheManager(ttl);
        this.sse = new SSEManager(baseUrl, this._onFlagUpdate.bind(this));

        this.context = null;
        this.listeners = new Set();

        const cached = this.cache.get();
        this.flags = cached ?? [];
        this._hydrated = cached !== null && cached !== undefined;
    }

    get isHydrated(){
        console.log("Using localstorage ", this._hydrated);
        return this._hydrated;
    }

    async init() {
        if (!this._hydrated) {
            this.flags = await this._fetchFlags();
            this.cache.set(this.flags);
        }
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
        if(flag.is_enabled)
            return flag.targeting_return_value;
        return fallback;
    }

    identify(context) {
        this.context = context;
    }

    async _onFlagUpdate(data) {
        try {
            // const flags = await this._fetchFlags();
            const flags = this.cache.get();
            console.log(data);
            let updatedFlags;
            if(!flags){
                updatedFlags = await this._fetchFlags();
            } else {
                updatedFlags = flags.map(flag => 
                    flag.flag_id === data.flag_id ?
                    {...flag, ...data} :
                    flag
                )
            }
            this.flags = updatedFlags;
            this.cache.set(updatedFlags);
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
        this.listeners.clear();  
    }

    reset(){
        this.cache.clear();
        this.flags = [];
        this.context = null;
    }
}

export { FlagPulseClient };