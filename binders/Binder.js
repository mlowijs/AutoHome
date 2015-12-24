class Binder {
    getType() {
        return Binder.TYPE;
    }

    send(thing, binding) {
        throw new Error("Not implemented.");
    }

    hookupBinding(thing, binding) {
        throw new Error("Not implemented.");
    }
}

Binder.TYPE = null;

module.exports = Binder;