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

        if (bindingValid !== true)
            return bindingValid;

        if (binding.url === undefined || binding.url === "")
            return "url";

        if (binding.direction == "in") {
            if (binding.interval === undefined || binding.interval <= 0)
                return "interval";
        }

        return true;
    }


    processBinding(binding, thing) {
        request.post(binding.url);

        // let req = http.request({
        //     method: binding.method,
        //     hostname: binding.url
        // });
        //
        // req.on('error', (e) => {
        //     console.log(`problem with request: ${e.message}`);
        // });
        //
        // req.end();
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