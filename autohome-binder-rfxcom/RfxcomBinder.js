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
        if (!configuration) {
            this._logger.error(`Configuration file 'rfxcom.json' not found!`);
            return;
        }

        this._driver = new RfxcomDriver(this._loggerFactory, configuration.serialPort, () => {
            this._driver.reset();
        });

        this._driver.on("initialized", () => configurationCompleted());
    }

    processBinding(binding, thing) {
        this._driver.sendMessage(binding, thing.value);
    }
}

module.exports = RfxcomBinder;