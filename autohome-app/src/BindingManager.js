class BindingManager {
    constructor(loggerFactory, thingManager, binderManager) {
        this._logger = loggerFactory.getLogger("BindingManager");
        this._thingManager = thingManager;
        this._binderManager = binderManager;

        this._thingManager.on("valueSet", (thing, oldValue) => this._handleValueSet(thing, oldValue));
    }

    validateBindings(binder) {
        let bindings = this._getBindingsForBinder(binder);

        bindings.forEach(binding => {
            let validationResult = binder.validateBinding(binding);

            if (validationResult !== true)
                this._logger.error(`Binding has missing or invalid property '${validationResult}'`);
        })
    }

    _handleValueSet(thing, oldValue) {
        for (let binding of thing.bindings) {
            let binder = this._binderManager.binders.get(binding.type);

            if (binder === undefined)
                return;

            binder.processBinding(binding, thing);
        }
    }

    _getBindingsForBinder(binder) {
        // let bindingsMap = new Map();

        return Array.from(this._thingManager.things.values())
                    .map(thing => thing.bindings)
                    .reduce((x, y) => x.concat(y))
                    .filter(binding => binding.type === binder.getType());

        // for (let [id, thing] of this._thingManager.things) {
        //     let bindings = thing.bindings.filter(binding => binding.type == binder.getType());
        //
        //     if (bindings.length > 0)
        //         bindingsMap.set(id, bindings);
        // }
        //
        // return bindingsMap;
    }
}

module.exports = BindingManager;