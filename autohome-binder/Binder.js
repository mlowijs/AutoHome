class Binder {
    constructor(logger) {
        this._logger = logger;
    }

    getType() {
        throw new Error("Not implemented.");
    }

    validateBinding(binding) {
        let bindingValid = true;

        if (!binding.type)
            bindingValid = "type";

        return bindingValid;
    }

    processBinding(binding, thing) {
    }

    addBinding(binding, thing) {
        return true;
    }

    removeBinding(binding, thing) {
    }
}

module.exports = Binder;