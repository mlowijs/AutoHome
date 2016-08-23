const config = require("../config.json");
const glob = require("glob");
const path = require("path");

class BinderManager {
    constructor(loggerFactory) {
        this._loggerFactory = loggerFactory;
        this._logger = loggerFactory.getLogger("BinderManager");

        this.binders = new Map();
    }

    loadBinders(binderLoaded) {
        const binderFolders = config.binderFolders;
        binderFolders.push("node_modules");

        binderFolders.forEach(bf => {
           glob("**/autohome-binder.json", { cwd: bf, realpath: true }, (err, files) => {
               if (files.length === 0)
                   return;

               files.forEach(f => this._loadBinder(f, binderLoaded));
           });
        });
    }

    _loadBinder(jsonPath, binderLoaded) {
        const dir = path.dirname(jsonPath);

        const Binder = require(dir);
        const binder = new Binder(this._loggerFactory, config.binders);

        if (this.binders.has(binder.getType())) {
            this._logger.error(`A binder with type ${binder.getType()} already exists.`, "BinderManager._loadBinder");
            return;
        }

        this.binders.set(binder.getType(), binder);

        this._logger.debug(`Loaded '${binder.getType()}' binder.`, "BinderManager._loadBinder");

        if (binderLoaded)
            binderLoaded(binder);
    }
}

module.exports = BinderManager;