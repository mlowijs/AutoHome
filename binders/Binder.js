class Binder {
    constructor(logger) {
        this.logger = logger;

        this.bindings = [];
    }

    getType() {
        return null;
    }

    validateBinding(binding) {
        return true;
    }

    bind(thing, binding) {
        throw new Error("Not implemented.");
    }

    hookupBinding(thing, binding) {
        let validationResult = this.validateBinding(binding);
        if (validationResult !== true) {
            this.logger.error(`'${binding.type}' binding on '${thing.id}' cannot be used, missing or invalid property '${validationResult}'.`);
            return;
        }

        if (this.bind(thing, binding) === false)
            return;

        this.bindings.push({
            thing: thing,
            binding: binding
        });
    }
}

module.exports = Binder;