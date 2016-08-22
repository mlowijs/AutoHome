let Binder = require("./Binder");

class BidirectionalBinder extends Binder {
    validateBinding(binding) {
        let bindingValid = super.validateBinding(binding);

        if (bindingValid !== true)
            return bindingValid;

        if (!binding.direction || !["in", "out"].includes(binding.direction))
            return "direction";

        return true;
    }
}

module.exports = BidirectionalBinder;