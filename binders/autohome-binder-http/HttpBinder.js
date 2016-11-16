const Binder = require("autohome-binder");
const request = require("request");

class HttpBinder extends Binder {
    constructor(loggerFactory) {
        super(loggerFactory.getLogger("HttpBinder"));
    }
    
    getType() {
        return "http";
    }
    
    validateBinding(binding) {
        let validationResult = super.validateBinding(binding);

        if (binding.getOptions === undefined && (binding.url === undefined || binding.method === undefined))
            validationResult = "getOptions or url and method";

        return validationResult;
    }

    processBinding(binding, thing) {
        request(this._getBindingOptions(binding, thing));
    }

    addBinding(binding, thing) {
        setInterval(() => this._doRequest(thing, binding), binding.interval * 1000);

        if (binding.initialize === true)
            this._doRequest(thing, binding);
    }

    _doRequest(thing, binding) {
        this._logger.debug(`Calling '${binding.url}' for thing '${thing.id}'.`, "HttpBinder._doRequest");

        request(this._getBindingOptions(binding, thing), (error, resp, body) => {
            if (error) {
                this._logger.error(`Error occurred during HTTP GET request: ${error.message}`, "HttpBinder.doGet");
                return;
            }

            if (binding.transform !== undefined) {
                this._logger.debug(`Executing transformation function for '${thing.id}'.`, "HttpBinder.doGet");
                thing.pushValue(binding.transform(body));
            } else {
                thing.pushValue(body);
            }
        });
    }

    _getBindingOptions(binding, thing) {
        if (binding.getOptions) {
            return binding.getOptions(thing);
        } else {
            return {
                method: binding.method,
                url: binding.url
            };
        }
    }
}

module.exports = HttpBinder;