let Binder = require("./Binder");
let http = require("http");

class HttpBinder extends Binder {
    constructor(logger) {
        super(logger);
    }

    getType() {
        return "http";
    }

    receive(thing, binding) {
        this.logger.debug(`Calling HTTP GET '${binding.url}' for thing '${thing.id}'`);

        http.get(binding.url, (resp) => {
            let buffer = "";

            resp.on("data", (data) => buffer += data);
            resp.on("end", () => {
                if (binding.transform !== undefined) {
                    this.logger.debug(`Executing transformation function for '${thing.id}'`);
                    thing.setValue(binding.transform(buffer));
                } else {
                    thing.setValue(buffer);
                }
            });
        });
    }

    hookupBinding(thing, binding) {
        if (binding.direction === "in") {
            setInterval(() => this.receive(thing, binding), binding.interval * 1000);
        }

        this.bindings.push({
            thing: thing,
            binding: binding
        });
    }
}

module.exports = HttpBinder;