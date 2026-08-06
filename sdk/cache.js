export default class CacheManager{
    constructor(ttl){
        this.TTL = ttl ?? 300000;
        this.FLAGS_KEY = "flagbase_flags";
        this.TIMESTAMP_KEY = "flagbase_timestamp";
    }

    get(){
        const flags = localStorage.getItem(this.FLAGS_KEY);
        const timestamp = Number(localStorage.getItem(this.TIMESTAMP_KEY));

        if(!flags || !timestamp)
            return null;

        const currentTime = Date.now()
        if(currentTime - timestamp > this.TTL){
            this.clear();
            return null;
        }
        try{
            return JSON.parse(flags);
        }catch(e){
            console.log("Local Flags are corrupted");
            this.clear();
            return null;
        }
    }

    set(flags){
        localStorage.setItem(this.FLAGS_KEY, JSON.stringify(flags));
        localStorage.setItem(this.TIMESTAMP_KEY, Date.now());
    }

    clear(){
        localStorage.removeItem(this.FLAGS_KEY);
        localStorage.removeItem(this.TIMESTAMP_KEY);
    }
}