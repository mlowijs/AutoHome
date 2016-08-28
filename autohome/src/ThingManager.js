const EventEmitter = require("events");
const glob = require("glob");
const path = require("path");
const Thing = require("./Thing");

class ThingManager extends EventEmitter {
    constructor(loggerFactory) {
        super();

        this._logger = loggerFactory.getLogger("ThingManager");
        this.things = new Map();
    }
    
    loadThings(thingsLoaded) {
        glob("things/**/*.js", { realpath: true }, (error, files) => {
            files.forEach(file => this._loadThing(file));

            this._logger.debug(`Loaded ${this.things.size} thing(s).`, "ThingManager.ctor");
            
            if (thingsLoaded)
                thingsLoaded();
        });
    }
    
    _loadThing(file) {
        const id = path.parse(file).name;

        if (this.things.has(id)) {
            this.logger.error(`A thing with id '${id}' already exists. Make sure to give yout things unique ids.`);
            return;
        }

        const thing = require(file);
        Object.setPrototypeOf(thing, new Thing(id));

        thing.on("valueSet", () => {
            this._logger.info(`Set value of '${thing.id}' to '${thing.value}' (${typeof thing.value}).`, "ThingManager.thing.valueSet");

            if (thing.valueSet !== undefined)
                thing.valueSet();

            this.emit("valueSet", thing);

            if (!thing.children)
                return;

            thing.children.map(id => this.things.get(id)).forEach(child => child.setValue(thing.value));
        });

        thing.on("valuePushed", () => {
            this._logger.info(`Pushed '${thing.value}' (${typeof thing.value}) to '${thing.id}'.`, "ThingManager.thing.valueChanged");

            if (thing.valuePushed !== undefined)
                thing.valuePushed();

            this.emit("valuePushed", thing);

            if (!thing.children)
                return;

            thing.children.map(id => this.things.get(id)).forEach(child => child.pushValue(thing.value));
        });

        this.things.set(thing.id, thing);
    }
}

module.exports = ThingManager;