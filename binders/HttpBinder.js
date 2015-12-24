let Binder = require("./Binder");
let http = require("http");

class HttpBinder extends Binder {
    constructor() {
        super();

        this.bindings = [];
    }

    getType() {
        return "http";
    }

    send(thing, binding) {
        http.get(binding.url, (resp) => {
            let buffer = "";

            resp.on("data", (data) => buffer += data);
            resp.on("end", () => {
                if (binding.transform !== undefined)
                    thing.value = binding.transform(buffer);
                else
                    thing.value = buffer;
            });
        });
    }

    hookupBinding(thing, binding) {
        if (binding.direction === "in") {
            setInterval(() => this.send(thing, binding), binding.interval * 1000);
        }

        this.bindings.push({
            thing: thing,
            binding: binding
        });
    }
}

module.exports = HttpBinder;