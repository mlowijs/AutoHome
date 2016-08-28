const glob = require("glob");
const path = require("path");

class BinderManager {
    constructor(loggerFactory) {
        this._loggerFactory = loggerFactory;
        this._logger = loggerFactory.getLogger("BinderManager");

        this.binders = new Map();
    }

    loadBinders(binderLoaded) {
        glob("node_modules/**/autohome-binder.json", { realpath: true }, (err, files) => {
            if (files.length === 0)
                return;

            files.forEach(f => this._loadBinder(f, binderLoaded));
        });
    }

    _loadBinder(jsonPath, binderLoaded) {
        const Binder = require(path.dirname(jsonPath));
        const binder = new Binder(this._loggerFactory);
        const binderType = binder.getType();

        if (this.binders.has(binderType)) {
            this._logger.error(`A binder of type '${binderType}' already exists.`, "BinderManager._loadBinder");
            return;
        }

        const config = this._loadConfiguration(binderType);

        binder.configure(config, () => {
            this.binders.set(binderType, binder);

            this._logger.info(`Loaded '${binderType}' binder.`, "BinderManager._loadBinder");

            if (binderLoaded)
                binderLoaded(binder);
        });
    }

    _loadConfiguration(binderType) {
        let binderConfig = null;

        try {
            binderConfig = require(`../config/${binderType}.json`);
        } catch (ex) { }

        return binderConfig;
    }
}

module.exports = BinderManager;