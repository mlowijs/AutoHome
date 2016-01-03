class BinderManager {
    constructor(logger, thingManager) {
        this.logger = logger;
        this.thingManager = thingManager;

        this._binders = [];
    }

    getBinder(type, thing) {
        let binder = this._binders.find(b => b.getType() === binding.type);

        if (binder !== undefined)
            return binder;

        try {
            let Binder = require(`autohome-binder-${type}`);

            binder = new Binder(this.logger);
            this._binders.push(binder);

            return binder;
        } catch (err) {
            this.logger.error(`Binder for type '${type}' on '${thing.id} was not found, ignoring binding. Try running 'npm install autohome-binder-${type}'.`, "BinderManager.getBinder");
            return null;
        }
    }

    hookupBindings() {
        for (let thingId in this.thingManager.things) {
            let thing = this.thingManager.things[thingId];

            if (thing.bindings === undefined || thing.bindings.length === 0)
                continue;

            for (let binding of thing.bindings) {
                let binder = this.getBinder(binding.type, thing);

                if (binder === null)
                    continue;

                binder._hookupBinding(thing, binding);
            }
        }
    }
}

module.exports = BinderManager;