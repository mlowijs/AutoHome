let EventEmitter = require("events");
let fs = require("fs");
let Logger = require("./Logger");
let path = require("path");
let Thing = require("./Thing");

class ThingManager extends EventEmitter {
    constructor() {
        super();

        this.logger = Logger;
        this._things = null;
    }

    _loadThings() {
        this._things = [];

        for (let file of fs.readdirSync("things")) {
            let thing = require(`../things/${file}`);
            Object.setPrototypeOf(thing, new Thing(path.parse(file).name));

            thing.on("valueSet", (thing) => {
                this.logger.debug(`Value for '${thing.id}' was set to '${thing.value}' (${typeof thing.value}).`, "ThingManager.ctor.thing.valueSet");
            });

            this._things.push(thing);
        }
    }

    getThings() {
        if (this._things === null)
            this._loadThings();
    }

    getThing(thingId) {
        return this.things.find(t => t.id == thingId);
    }
}

ThingManager._export = true;

module.exports = ThingManager;