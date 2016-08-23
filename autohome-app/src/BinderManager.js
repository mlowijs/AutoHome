const glob = require("glob");
const path = require("path");
const config = require("../config/main.json");

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
        const Binder = require(path.dirname(jsonPath));
        const binder = new Binder(this._loggerFactory);
        const binderType = binder.getType();

        if (this.binders.has(binderType)) {
            this._logger.error(`A binder with type '${binderType}' already exists.`, "BinderManager._loadBinder");
            return;
        }

        let binderConfig = null;

        try {
            binderConfig = require(`../config/${binderType}.json`);
        } catch (ex) { }

        binder.configure(binderConfig, () => {
            this.binders.set(binderType, binder);

            this._logger.debug(`Loaded '${binderType}' binder.`, "BinderManager._loadBinder");

            if (binderLoaded)
                binderLoaded(binder);
        });
    }
}

module.exports = BinderManager;