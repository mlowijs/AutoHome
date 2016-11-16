const Binder = require("autohome-binder");
const mqtt = require("mqtt");

class MqttBinder extends Binder {
    constructor(loggerFactory) {
        super(loggerFactory.getLogger("MqttBinder"));

        this._brokers = new Map();
    }

    configure(configuration, configurationCompleted) {
        if (!configuration) {
            this._logger.error(`Configuration file 'mqtt.json' not found!`);
            return;
        }

        const promises = Object.keys(configuration.brokers).map(brokerName => new Promise((resolve, reject) => {
            const client = mqtt.connect(configuration.brokers[brokerName]);

            client.on("connect", () => {
                this._logger.info(`Connected to broker '${brokerName}'.`);

                this._brokers.set(brokerName, client);
                resolve();
            });

            client.on("error", () => {
                this._logger.error(`Failed to connect to broker '${brokerName}'.`);
                reject();
            });
        }));

        Promise.all(promises).then(() => configurationCompleted());
    }

    getType() {
        return "mqtt";
    }

    validateBinding(binding) {
        let validationResult = super.validateBinding(binding);

        if (!binding.broker || binding.broker === "")
            validationResult = "broker";

        if (!binding.topic || binding.topic === "")
            validationResult = "topic";

        return validationResult;
    }

    processBinding(binding, thing) {
        const client = this._brokers.get(binding.broker);

        client.publish(binding.topic, `${thing.value}`);
    }

    addBinding(binding, thing) {
        const client = this._brokers.get(binding.broker);

        client.subscribe(binding.topic);

        client.on("message", (topic, message) => {
            if (topic !== binding.topic)
                return;

            const messageString = message.toString();

            this._logger.debug(`Received message '${messageString}' from topic '${topic}'.`);
            thing.pushValue(messageString);
        });
    }
}

module.exports = MqttBinder;