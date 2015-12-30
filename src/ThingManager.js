let EventEmitter = require("events");
let fs = require("fs");
let Logger = require("./Logger");
let path = require("path");
let Thing = require("./Thing");

class ThingManager extends EventEmitter {
    constructor() {
        super();

        this.logger = { import: true, type: Logger };
        this._things = [];

        Object.defineProperty(this, 'things', {
            get: function() { return this._things; }
        });

        for (let file of fs.readdirSync("things")) {
            let thing = require(`../things/${file}`);
            Object.setPrototypeOf(thing, new Thing(path.parse(file).name));

            thing.on("valueSet", (thing) => {
                this.logger.info(`Value for '${thing.id}' was set to '${thing.value}' (${typeof thing.value}).`, "ThingManager.ctor.thing.valueSet");

                this.emit("valueSet", thing);
            });

            this._things.push(thing);
        }
    }

    getThingById(thingId) {
        return this.things.find(t => t.id == thingId) || null;
    }
}

ThingManager._export = true;

module.exports = ThingManager;