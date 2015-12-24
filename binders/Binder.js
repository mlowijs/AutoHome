class Binder {
    constructor(logger) {
        this.logger = logger;

        this.bindings = [];
    }

    getType() {
        return null;
    }

    receive(thing, binding) {
        throw new Error("Not implemented.");
    }

    hookupBinding(thing, binding) {
        throw new Error("Not implemented.");
    }
}

module.exports = Binder;