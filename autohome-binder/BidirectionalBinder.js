let Binder = require("./Binder");

class BidirectionalBinder extends Binder {
    validateBinding(binding) {
        let bindingValid = super.validateBinding(binding);

        if (!binding.direction || !["in", "out"].includes(binding.direction))
            bindingValid = "direction";

        return bindingValid;
    }


    addBinding(binding, thing) {
        if (!super.addBinding(binding, thing) || binding.direction === "out")
            return false;

        return true;
    }
}

module.exports = BidirectionalBinder;