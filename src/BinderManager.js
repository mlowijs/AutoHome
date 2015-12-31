let Binder = require("../binders/Binder");
let fs = require("fs");
let Logger = require("./Logger");
let ThingManager = require("./ThingManager");

class BinderManager {
    constructor() {
        this.logger = { import: true, type: Logger };
        this.thingManager = { import: true, type: ThingManager };

        this._binders = { import: true, type: [ Binder ]};
    }

    hookupBindings() {
        for (let thingId in this.thingManager.things) {
            let thing = this.thingManager.things[thingId];

            if (thing.bindings === undefined || thing.bindings.length === 0)
                continue;

            thing.bindings.forEach((binding, i) => {
                let binder = this._binders.find(b => b.getType() === binding.type);

                if (binder === undefined) {
                    this.logger.error(`Binder for type '${binding.type}' was not found, ignoring binding #${i} on '${thingId}'.`, "BinderManager.hookupBindings");
                    return;
                }

                binder._hookupBinding(thing, binding);
            });
        }
    }
}

BinderManager._export = true;

module.exports = BinderManager;