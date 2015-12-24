let fs = require("fs");

class ThingManager {
    constructor(logger) {
        this.logger = logger;
        this.things = [];

        for (let f of fs.readdirSync("./things")) {
            let thing = require(`./things/${f}`);

            thing.id = f.replace(/\.[^/.]+$/, "");
            Object.defineProperty(thing, 'value', {
                get: () => { return thing._value; },
                set: (value) => {
                    thing._value = value;
                    this.logger.debug(`Set value for thing '${thing.id}' to: ${value}`);
                }
            });

            this.things.push(thing);
        }
    }
}

module.exports = ThingManager;