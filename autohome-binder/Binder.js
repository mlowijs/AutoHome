class Binder {
    constructor(logger) {
        this._logger = logger;

        this._bindings = [];
    }

    getType() {
        throw new Error("Not implemented.");
    }

    validateBinding(binding) {
        return true;
    }

    bind(thing, binding) {
        throw new Error("Not implemented.");
    }

    processBinding(binding, data) {
        throw new Error("Not implemented.");
    }
}

module.exports = Binder;