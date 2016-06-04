let Binder = require("autohome-binder");
let http = require("http");

class HttpBinder extends Binder {
    constructor(logger) {
        super(logger);
    }
    
    getType() {
        return "http";
    }
    
    validateBinding(binding) {
        if (binding.url === undefined || binding.url === "")
            return "url";

        if (binding.interval === undefined || binding.interval <= 0)
            return "interval";

        return true;
    }

    _doGet(thing, binding) {
        this._logger.debug(`Calling HTTP GET '${binding.url}' for thing '${thing.id}'`, "HttpBinder.doGet");

        http.get(binding.url, (resp) => {
            let buffer = "";

            resp.on("data", data => buffer += data);
            resp.on("end", () => {
                if (binding.transform !== undefined) {
                    this._logger.debug(`Executing transformation function for '${thing.id}'`, "HttpBinder.doGet");
                    thing.value = binding.transform(buffer);
                } else {
                    thing.value = buffer;
                }
            });
        }).on("error", (error) => {
            this._logger.error(`Error occurred during HTTP GET request: ${error.message}`, "HttpBinder.doGet");
        });
    }

    bind(thing, binding) {
        setInterval(() => this._doGet(thing, binding), binding.interval * 1000);

        if (binding.initialize === true)
            this._doGet(thing, binding);
    }
}

module.exports = HttpBinder;