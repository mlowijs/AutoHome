let BidirectionalBinder = require("autohome-binder").BidirectionalBinder;
let request = require("request");

class HttpBinder extends BidirectionalBinder {
    constructor(logger) {
        super(logger);
    }
    
    getType() {
        return "http";
    }
    
    validateBinding(binding) {
        let bindingValid = super.validateBinding(binding);

        if (binding.url === undefined || binding.url === "")
            bindingValid = "url";

        if (binding.direction == "in") {
            if (binding.interval === undefined || binding.interval <= 0)
                bindingValid = "interval";
        } else {
            if (!binding.getOptions && !(binding.url && binding.method))
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

    // bind(thing, binding) {
    //     setInterval(() => this._doGet(thing, binding), binding.interval * 1000);
    //
    //     if (binding.initialize === true)
    //         this._doGet(thing, binding);
    // }

    // _doGet(thing, binding) {
    //     this._logger.debug(`Calling HTTP GET '${binding.url}' for thing '${thing.id}'`, "HttpBinder.doGet");
    //
    //     http.get(binding.url, (resp) => {
    //         let buffer = "";
    //
    //         resp.on("data", data => buffer += data);
    //         resp.on("end", () => {
    //             if (binding.transform !== undefined) {
    //                 this._logger.debug(`Executing transformation function for '${thing.id}'`, "HttpBinder.doGet");
    //                 thing.setValue(binding.transform(buffer));
    //             } else {
    //                 thing.setValue(buffer);
    //             }
    //         });
    //     }).on("error", (error) => {
    //         this._logger.error(`Error occurred during HTTP GET request: ${error.message}`, "HttpBinder.doGet");
    //     });
    // }
}

module.exports = HttpBinder;