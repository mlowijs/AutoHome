let Logger = require("../src/Logger");

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

    _hookupBinding(thing, binding) {
        let validationResult = this.validateBinding(binding);
        if (validationResult !== true) {
            this._logger.error(`'${binding.type}' binding on '${thing.id}' cannot be activated: missing or invalid property '${validationResult}'.`, "Binder._hookupBinding");
            return;
        }

        if (this.bind(thing, binding) === false)
            return;

        this._bindings.push({
            thing: thing,
            binding: binding
        });
    }
}

module.exports = Binder;