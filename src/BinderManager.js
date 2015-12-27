let fs = require("fs");
let Logger = require("./Logger");
let ThingManager = require("./ThingManager");

class BinderManager {
    constructor() {
        this.logger = Logger;
        this.thingManager = ThingManager;
        this._binders = null;
    }

    _loadBinders() {
        this._binders = [];

        fs.readdirSync("./binders").forEach(f => {
            let Binder = require(`../binders/${f}`);
            let binder = new Binder(this.logger);

            if (binder.getType() === null)
                return;

            this._binders.push(binder);
        });
    }

    hookupBindings() {
        if (this._binders === null)
            this._loadBinders();

        for (let thing of this.thingManager.getThings()) {
            if (thing.bindings === undefined)
                continue;

            thing.bindings.forEach((binding, i) => {
                let binder = this._binders.find(b => b.getType() === binding.type);

                if (binder === undefined) {
                    this.logger.error(`Binder for type '${binding.type}' was not found, ignoring binding #${i} on '${thing.id}'.`, "BinderManager.hookupBindings");
                    return;
                }

                binder.hookupBinding(thing, binding);
            });
        }
    }
}

BinderManager._export = true;

module.exports = BinderManager;