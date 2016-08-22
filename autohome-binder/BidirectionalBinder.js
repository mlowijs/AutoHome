let Binder = require("./Binder");

class BidirectionalBinder extends Binder {
    validateBinding(binding) {
        let bindingValid = super.validateBinding(binding);

        if (!binding.direction || !["in", "out"].includes(binding.direction))
            bindingValid = "direction";

        return bindingValid;
    }
}

module.exports = BidirectionalBinder;