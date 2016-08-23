class BindingManager {
    constructor(loggerFactory, thingManager, binderManager) {
        this._logger = loggerFactory.getLogger("BindingManager");
        this._thingManager = thingManager;
        this._binderManager = binderManager;

        this._thingManager.on("valueSet", (thing, oldValue) => this._handleValueSet(thing, oldValue));
    }

    hookupBindings(binder) {
        for (const [id, thing] of this._thingManager.things) {
            for (const binding of thing.bindings.filter(binding => binding.type === binder.getType())) {
                let bindingValid = binder.validateBinding(binding);

                if (bindingValid !== true) {
                    this._logger.error(`Binding has missing or invalid property '${bindingValid}'`);
                    return;
                }

                if (!binder.addBinding(binding, thing)) {
                    this._logger.debug(`Did not add binding for '${thing.id}'`);
                }
            }
        }
    }

    _handleValueSet(thing, oldValue) {
        for (const binding of thing.bindings) {
            const binder = this._binderManager.binders.get(binding.type);

            if (binder === undefined)
                return;

            binder.processBinding(binding, thing);
        }
    }
}

module.exports = BindingManager;