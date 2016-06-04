const EventEmitter = require("events");
const glob = require("glob");
const path = require("path");
const Thing = require("./Thing");

class ThingManager extends EventEmitter {
    constructor(loggerFactory) {
        super();

        this._logger = loggerFactory.getLogger("ThingManager");
        this.things = [];
    }
    
    loadThings(thingsLoaded) {
        glob("things/*.js", { realpath: true }, (err, files) => {
            files.forEach(file => this._loadThing(file));

            this._logger.debug(`Loaded ${Object.keys(this.things).length} things.`, "ThingManager.ctor");
            
            if (thingsLoaded)
                thingsLoaded();
        });
    }

    getBindingsForBinder(binder) {
        return Object.values(this.things)
                     .map(thing => thing.bindings)
                     .filter(binding => binding.type == binder.getType());
    }
    
    _loadThing(file) {
        let thing = require(file);
        Object.setPrototypeOf(thing, new Thing(path.parse(file).name));

        thing.on("valueSet", (thing, oldValue) => {
            this._logger.info(`Value for '${thing.id}' was set to '${thing.value}' (${typeof thing.value}).`, "ThingManager.thing.valueSet");

            if (thing.valueSet !== undefined)
                thing.valueSet(oldValue, this.things);

            this.emit("valueSet", thing);
        });

        thing.on("valueChanged", (thing, oldValue) => {
            this._logger.info(`Value for '${thing.id}' was changed to '${thing.value}' (${typeof thing.value}).`, "ThingManager.thing.valueChanged");

            if (thing.valueChanged !== undefined)
                thing.valueChanged(oldValue, this.things);
        });

        this.things[thing.id] = thing;
    }
}

module.exports = ThingManager;