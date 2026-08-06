export default class SSEManager{
    constructor(baseUrl, onUpdate){
        this.baseUrl = baseUrl;
        this.onUpdate = onUpdate;
        this.es = null;
        this.retryDelay = 1000;
        this.maxDelay = 30000;
        this.timeout = null
    }

    connect(sdkKey){
        if (this.es) {
            this.es.close();
        }
        this.es = new EventSource(`${this.baseUrl}/api/v1/stream?sdkKey=${sdkKey}`);

        this.es.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.onUpdate(data);
        }

        this.es.onerror = (err) =>{
            this.es.close();
            this.timeout = setTimeout(()=>{
                this.connect(sdkKey)
            }, this.retryDelay);
            this.retryDelay = Math.min(this.retryDelay * 2, this.maxDelay);
        }

        this.es.onopen = ()=>{
            this.retryDelay = 1000;
        }
    }

    disconnect() {
        if (this.es) {
            this.es.close();
            this.es = null;
        }
        clearTimeout(this.timeout);
    }
}