let EventEmitter = require("events");
let fs = require("fs");
let path = require("path");
let Thing = require("./Thing");

class ThingManager extends EventEmitter {
    constructor(logger) {
        super();

        this.logger = logger;
        this._things = {};

        Object.defineProperty(this, 'things', {
            get() { return this._things; }
        });

        for (let file of fs.readdirSync("things")) {
            let thing = require(`../things/${file}`);
            Object.setPrototypeOf(thing, new Thing(path.parse(file).name));

            thing.on("valueSet", (thing, oldValue) => {
                this.logger.info(`Value for '${thing.id}' was set to '${thing.value}' (${typeof thing.value}).`, "ThingManager.ctor.thing.valueSet");

                if (thing.valueSet !== undefined)
                    thing.valueSet(oldValue, this.things);

                this.emit("valueSet", thing);
            });

            this._things[thing.id] = thing;
        }

        this.logger.debug(`Loaded ${Object.keys(this.things).length} things.`, "ThingManager.ctor");
    }
}

module.exports = ThingManager;