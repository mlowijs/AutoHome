let EventEmitter = require("events");
let fs = require("fs");
let Logger = require("./Logger");
let path = require("path");
let Thing = require("./Thing");

class ThingManager extends EventEmitter {
    constructor() {
        super();

        this.logger = { import: true, type: Logger };
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
    }
}

ThingManager._export = true;

module.exports = ThingManager;