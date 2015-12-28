let Binder = require("./Binder");
let childProcess = require("child_process");

class BluetoothBinder extends Binder {
    constructor() {
        super();
    }

    getType() {
        return "bt";
    }

    receive(thing, binding) {
        clearInterval(binding._interval);

        this.logger.debug(`Executing l2ping to get presence for '${thing.id}'`, "BluetoothBinder.receive");

        childProcess.exec(`l2ping -c 1 ${binding.mac}`, { "stdio": "ignore" }, (error) => {
            thing.setValue(error === null);

            let interval = thing.value ? binding.intervalPresent : binding.intervalAbsent;
            binding._interval = setInterval(() => this.receive(thing, binding), interval * 1000);
        });
    }

    bind(thing, binding) {
        binding._interval = setInterval(() => this.receive(thing, binding), binding.intervalAbsent * 1000);
    }
}

BluetoothBinder._export = true;

module.exports = BluetoothBinder;