let EventEmitter = require("events");
let fs = require("fs");
let path = require("path");
let Thing = require("./Thing");

class ThingManager extends EventEmitter {
    constructor(logger) {
        super();

        this._logger = logger;
        
        for (let file of fs.readdirSync("things")) {
            let thing = require(`../things/${file}`);
            Object.setPrototypeOf(thing, new Thing(path.parse(file).name));

            thing.on("valueSet", (thing, oldValue) => {
                this._logger.info(`Value for '${thing.id}' was set to '${thing.value}' (${typeof thing.value}).`, "ThingManager.ctor.thing.valueSet");

                if (thing.valueSet !== undefined)
                    thing.valueSet(oldValue);

                this.emit("valueSet", thing);
            });
            
            thing.on("valueChanged", (thing, oldValue) => {
                this._logger.info(`Value for '${thing.id}' was changed to '${thing.value}' (${typeof thing.value}).`, "ThingManager.ctor.thing.valueChanged");

                if (thing.valueChanged !== undefined)
                    thing.valueChanged(oldValue);
            });

            ThingManager.things[thing.id] = thing;
        }

        this._logger.debug(`Loaded ${Object.keys(ThingManager.things).length} things.`, "ThingManager.ctor");
    }
}

ThingManager.things = {};

module.exports = ThingManager;