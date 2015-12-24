var fs = require("fs");

class BinderManager {
    constructor(logger, thingManager) {
        this.logger = logger;
        this.thingManager = thingManager;
        this.binders = [];

        fs.readdirSync("./binders").forEach(f => {
            let Binder = require(`./binders/${f}`);
            let binder = new Binder(this.logger);

            if (binder.getType() === null)
                return;

            this.binders.push(binder);
        });
    }

    hookupBindings() {
        for (let thing of this.thingManager.things) {
            let bindings = thing.bindings;

            for (let binding of bindings) {
                let binder = this.binders.find(b => b.getType() === binding.type);

                binder.hookupBinding(thing, binding);
            }
        }
    }
}

module.exports = BinderManager;