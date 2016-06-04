let Binder = require("autohome-binder");
let childProcess = require("child_process");

class BluetoothBinder extends Binder {
    constructor(logger) {
        super(logger);
    }
    
    getType() {
        return "bt";
    }
    
    validateBinding(binding) {
        if (binding.mac === undefined || binding.mac === "")
            return "mac";

        if (binding.intervalPresent === undefined || binding.intervalPresent <= 0)
            return "intervalPresent";

        if (binding.intervalAbsent === undefined || binding.intervalAbsent <= 0)
            return "intervalAbsent";

        return true;
    }
    
    _scan(thing, binding) {
        clearInterval(binding._interval);

        this.logger.debug(`Executing l2ping to get presence for '${thing.id}'`, "BluetoothBinder.receive");

        childProcess.exec(`l2ping -c 3 ${binding.mac}`, { "stdio": "ignore" }, (error) => {
            thing = error === null;

            let interval = thing.value ? binding.intervalPresent : binding.intervalAbsent;
            binding._interval = setInterval(() => this.scan(thing, binding), interval * 1000);
        });
    }

    bind(thing, binding) {
        binding._interval = setInterval(() => this._scan(thing, binding), binding.intervalAbsent * 1000);
    }
}

module.exports = BluetoothBinder;