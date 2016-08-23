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

        if (binding.getOptions === undefined && (binding.url === undefined || binding.method === undefined))
            bindingValid = "getOptions or url and method";

        return bindingValid;
    }

    processBinding(binding, thing) {
        request(this._getBindingOptions(binding, thing));
    }

    addBinding(binding, thing) {
        if (!super.addBinding(binding, thing))
            return false;

        setInterval(() => this._doRequest(thing, binding), binding.interval * 1000);

        if (binding.initialize === true)
            this._doRequest(thing, binding);

        return true;
    }

    _doRequest(thing, binding) {
        this._logger.debug(`Calling '${binding.url}' for thing '${thing.id}'`, "HttpBinder._doRequest");

        request(this._getBindingOptions(binding, thing), (error, resp, body) => {
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