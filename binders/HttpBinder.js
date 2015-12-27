let Binder = require("./Binder");
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

    receive(thing, binding) {
        this.logger.debug(`Calling HTTP GET '${binding.url}' for thing '${thing.id}'`, "HttpBinder.receive");

        http.get(binding.url, (resp) => {
            let buffer = "";

            resp.on("data", (data) => buffer += data);
            resp.on("end", () => {
                if (binding.transform !== undefined) {
                    this.logger.debug(`Executing transformation function for '${thing.id}'`, "HttpBinder.receive");
                    thing.setValue(binding.transform(buffer));
                } else {
                    thing.setValue(buffer);
                }
            });
        }).on("error", (error) => {
            this.logger.error(`Error occurred during HTTP GET request: ${error.message}`, "HttpBinder.receive");
        });
    }

    bind(thing, binding) {
        setInterval(() => this.receive(thing, binding), binding.interval * 1000);
    }
}

module.exports = HttpBinder;