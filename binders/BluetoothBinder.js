let Binder = require("./Binder");
let childProcess = require("child_process");

class BluetoothBinder extends Binder {
    constructor(logger) {
        super(logger);
    }

    getType() {
        return "bt";
    }

    receive(thing, binding) {
        clearInterval(binding._interval);

        this.logger.debug(`Executing l2ping to get presence for '${thing.id}'`);

        childProcess.exec(`l2ping -c 1 ${binding.mac}`, { "stdio": "ignore" }, (error) => {
            thing.setValue(error === null);

            let interval = thing.value ? binding.intervalPresent : binding.intervalAbsent;
            binding._interval = setInterval(() => this.receive(thing, binding), interval * 1000);
        });
    }

    hookupBinding(thing, binding) {
        if (binding.direction === "in") {
            binding._interval = setInterval(() => this.receive(thing, binding), binding.intervalAbsent * 1000);
        } else {
            return;
        }

        super.hookupBinding(thing, binding);
    }
}

module.exports = BluetoothBinder;