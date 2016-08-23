class Binder {
    constructor(logger) {
        this._logger = logger;
    }

    getType() {
        throw new Error("Not implemented.");
    }

    configure(configuration, configurationCompleted) {
        configurationCompleted();
    }

    validateBinding(binding) {
        let validationResult = true;

        if (binding.type === undefined)
            validationResult = "type";

        if (binding.direction === undefined || !["in", "out"].includes(binding.direction))
            validationResult = "direction";

        return validationResult;
    }

    processBinding(binding, thing) {
    }

    addBinding(binding, thing) {
    }

    removeBinding(binding, thing) {
    }
}

module.exports = Binder;