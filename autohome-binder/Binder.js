class Binder {
    constructor(logger) {
        this._logger = logger;
    }

    getType() {
        throw new Error("Not implemented.");
    }

    validateBinding(binding) {
        if (!binding.type)
            return "type";

        return true;
    }

    processBinding(binding, thing) {

    }
}

module.exports = Binder;