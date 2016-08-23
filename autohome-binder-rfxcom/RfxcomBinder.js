const Binder = require("autohome-binder");
const RfxcomDriver = require("./RfxcomDriver");

class RfxcomBinder extends Binder {
    constructor(loggerFactory) {
        super(loggerFactory.getLogger("RfxcomBinder"));

        this._loggerFactory = loggerFactory;
    }

    getType() {
        return "rfxcom";
    }

    configure(configuration, configurationCompleted) {
        this._driver = new RfxcomDriver(this._loggerFactory, configuration.serialPort, () => configurationCompleted());
    }

    processBinding(binding, thing) {
        this._driver.test(binding, thing.value);
    }
}

module.exports = RfxcomBinder;