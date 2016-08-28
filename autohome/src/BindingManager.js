class BindingManager {
    constructor(loggerFactory, thingManager, binderManager) {
        this._logger = loggerFactory.getLogger("BindingManager");
        this._thingManager = thingManager;
        this._binderManager = binderManager;

        this._thingManager.on("valuePushed", (thing) => this._handleValuePushed(thing));
    }

    hookupBindings(binder) {
        for (const [id, thing] of this._thingManager.things) {
            if (!thing.bindings)
                continue;

            for (const binding of thing.bindings.filter(binding => binding.type === binder.getType())) {
                const validationResult = binder.validateBinding(binding);

                if (validationResult !== true) {
                    this._logger.error(`Binding has missing or invalid property/properties: '${bindingValid}'.`);
                    return;
                }

                if (binding.direction === "out")
                    return;

                binder.addBinding(binding, thing);
            }
        }
    }

    _handleValuePushed(thing) {
        for (const binding of thing.bindings) {
            const binder = this._binderManager.binders.get(binding.type);

            if (binder === undefined || binding.direction === "in")
                continue;

            binder.processBinding(binding, thing);
        }
    }
}

module.exports = BindingManager;