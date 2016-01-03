class BinderManager {
    constructor(logger, thingManager) {
        this.logger = logger;
        this.thingManager = thingManager;

        this._binders = [];
    }

    getBinder(type) {
        let binder = this._binders.find(b => b.getType() === binding.type);

        if (binder !== undefined)
            return binder;

        try {
            let Binder = require(`autohome-binder-${type}`);

            binder = new Binder();
            this._binders.push(binder);

            return binder;
        } catch (err) {
            this.logger.error(`Binder for type '${type}' was not found, try running 'npm install autohome-binder-${type}'.`, "BinderManager.getBinder");
            return null;
        }
    }

    hookupBindings() {
        for (let thingId in this.thingManager.things) {
            let thing = this.thingManager.things[thingId];

            if (thing.bindings === undefined || thing.bindings.length === 0)
                continue;

            thing.bindings.forEach((binding, i) => {
                let binder = this.getBinder(binding.type);

                if (binder === null)
                    return;

                binder._hookupBinding(thing, binding);
            });
        }
    }
}

module.exports = BinderManager;