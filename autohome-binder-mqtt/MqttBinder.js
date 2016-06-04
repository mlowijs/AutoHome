let Binder = require("autohome-binder");
let mqtt = require("mqtt");

class MqttBinder extends Binder {
    constructor(logger, config) {
        super(logger);
        
        this._config = config.mqtt;

        this._brokers = {};

        for (let broker in this._config.brokers) {
            this._brokers[broker] = mqtt.connect(this._config.brokers[broker]);
        }
    }

    getType() {
        return "mqtt";
    }

    validateBinding(binding) {
        return true;
    }

    bind(thing, binding) {
        return false;
    }
}

module.exports = MqttBinder;