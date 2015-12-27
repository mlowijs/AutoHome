let EventEmitter = require("events");
let fs = require("fs");
let Thing = require("./Thing");

class ThingManager extends EventEmitter {
    constructor(logger) {
        super();

        this.logger = logger;
        this._things = [];

        Object.defineProperty(this, 'things', {
            get: function() { return this._things; }
        });

        for (let f of fs.readdirSync("things")) {
            let thing = require(`../things/${f}`);
            thing.__proto__ = new Thing(f.replace(/\.[^/.]+$/, ""));

            thing.on("valueSet", (thing) => {
               this.logger.debug(`Value for '${thing.id}' was set to '${thing.value}' (${typeof thing.value}).`);
            });

            this._things.push(thing);
        }
    }

    getThing(thingId) {
        return this.things.find(t => t.id == thingId);
    }
}

module.exports = ThingManager;