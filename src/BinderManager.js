let config = require("../config.json");
let glob = require("glob");
let path = require("path");
let ThingManager = require("./ThingManager");

class BinderManager {
    constructor(logger) {
        this._logger = logger;

        this._binders = {};
    }

    loadBinders() {
        let binderFolders = config.binderFolders;
        binderFolders.push("node_modules");

        binderFolders.forEach(bf => {
           glob("**/autohome-binder.json", { cwd: bf, realpath: true }, (err, files) => {
               if (files.length === 0)
                   return;

               files.forEach(f => this._loadBinder(f));
           });
        });
    }

    _loadBinder(jsonPath) {
        let dir = path.dirname(jsonPath);

        let Binder = require(dir);
        let binder = new Binder(this._logger, config.binders);

        this._binders[binder.getType()] = binder;

        this._logger.debug(`Loaded '${binder.getType()}' binder.`, "BinderManager._loadBinder");
    }

    hookupBindings() {
        for (let thingId in ThingManager.things) {
            let thing = ThingManager.things[thingId];

            if (thing.bindings === undefined || thing.bindings.length === 0)
                continue;

            for (let binding of thing.bindings) {
                let binder = this._binders[binding.type];

                if (binder === null) {
                    this._logger.warn(`No binder found for type '${binding.type}', binding was not hooked up.`);
                    continue;
                }

                this._hookupBinding(binder, thing, binding);
            }
        }
    }

    _hookupBinding(binder, thing, binding) {
        let validationResult = binder.validateBinding(binding);
        
        if (validationResult !== true) {
            this._logger.error(`'${binding.type}' binding on '${thing.id}' cannot be activated: missing or invalid property '${validationResult}'.`, "Binder._hookupBinding");
            return;
        }

        if (binder.bind(thing, binding) === false)
            return;

        binder._bindings.push({
            thing: thing,
            binding: binding
        });
    }
}

module.exports = BinderManager;