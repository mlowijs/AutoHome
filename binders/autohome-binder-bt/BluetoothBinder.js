const Binder = require("autohome-binder");
const childProcess = require("child_process");

class BluetoothBinder extends Binder {
    constructor(loggerFactory) {
        super(loggerFactory.getLogger("BluetoothBinder"));
    }
    
    getType() {
        return "bt";
    }
    
    validateBinding(binding) {
        let validationResult = super.validateBinding(binding);

        if (binding.mac === undefined || binding.mac === "")
            validationResult = "mac";

        if (binding.intervalPresent === undefined || binding.intervalPresent <= 0)
            validationResult = "intervalPresent";

        if (binding.intervalAbsent === undefined || binding.intervalAbsent <= 0)
            validationResult = "intervalAbsent";

        return validationResult;
    }

    _scan(thing, binding) {
        clearInterval(binding._interval);

        this.logger.debug(`Executing l2ping to get presence for '${thing.id}'`, "BluetoothBinder.receive");

        childProcess.exec(`l2ping -c 3 ${binding.mac}`, { "stdio": "ignore" }, (error) => {
            thing = error === null;

            const interval = thing.value ? binding.intervalPresent : binding.intervalAbsent;
            binding._interval = setInterval(() => this.scan(thing, binding), interval * 1000);
        });
    }

    bind(thing, binding) {
        binding._interval = setInterval(() => this._scan(thing, binding), binding.intervalAbsent * 1000);
    }
}

module.exports = BluetoothBinder;