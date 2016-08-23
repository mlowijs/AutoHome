const BidirectionalBinder = require("autohome-binder").BidirectionalBinder;
const request = require("request");

class HttpBinder extends BidirectionalBinder {
    constructor(loggerFactory) {
        super(loggerFactory.getLogger("HttpBinder"));
    }
    
    getType() {
        return "http";
    }
    
    validateBinding(binding) {
        let bindingValid = super.validateBinding(binding);

        if (binding.direction == "in") {
            if (binding.url === undefined || binding.url === "")
                bindingValid = "url";

            if (binding.interval === undefined || binding.interval <= 0)
                bindingValid = "interval";
        } else {
            if (binding.getOptions === undefined && (binding.url === undefined || binding.method === undefined))
                bindingValid = "getOptions or url and method";
        }

        return bindingValid;
    }

    processBinding(binding, thing) {
        let options = null;

        if (binding.getOptions) {
            options = binding.getOptions(thing);
        } else {
            options = {
                method: binding.method,
                url: binding.url
            };
        }

        request(options);
    }

    addBinding(binding, thing) {
        if (!super.addBinding(binding, thing))
            return false;

        setInterval(() => this._doGet(thing, binding), binding.interval * 1000);

        if (binding.initialize === true)
            this._doGet(thing, binding);

        return true;
    }

    _doGet(thing, binding) {
        this._logger.debug(`Calling HTTP GET '${binding.url}' for thing '${thing.id}'`, "HttpBinder.doGet");

        request(binding.url, (error, resp, body) => {
            if (error) {
                this._logger.error(`Error occurred during HTTP GET request: ${error.message}`, "HttpBinder.doGet");
                return;
            }

            if (binding.transform !== undefined) {
                this._logger.debug(`Executing transformation function for '${thing.id}'`, "HttpBinder.doGet");
                thing.pushValue(binding.transform(body));
            } else {
                thing.pushValue(body);
            }
        });
    }
}

module.exports = HttpBinder;