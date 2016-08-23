const EventEmitter = require("events");
const MessageFactory = require("./MessageFactory");
const MessageParser = require("./MessageParser");
const SerialPort = require("serialport");

class RfxcomDriver extends EventEmitter {
    constructor(loggerFactory, portName, portOpened) {
        super();

        this._sequenceNr = 0;
        this._logger = loggerFactory.getLogger("RfxcomDriver");

        this._port = new SerialPort(portName, {
            baudRate: 38400
        }, (error) => {
            if (error) {
                this._logger.error(`Error while opening serial port '${portName}': ${error}`);
                return;
            }

            this._port.on("data", (data) => this._receiveMessage(data));
            portOpened();
        });
    }

    reset() {
        this._logger.info("Resetting RFXCOM.");

        this._write(MessageFactory.createResetMessage(), () => setTimeout(() =>
            this._write(MessageFactory.createStatusMessage()), 200)
        );
    }

    sendMessage(binding, value) {
        const messageFactory = MessageFactory.getMessageFactory(binding.packetType);
        const message = messageFactory.createMessage(this._sequenceNr++, binding, value);

        this._write(message);
    }

    _receiveMessage(data) {
        MessageParser.parseMessage(data, (message) => {
            if (message.packetType === 0x01 && message.commandType === 0x02) {
                this._logger.info("RFXCOM initialized.");

                this.emit("initialized");
                return;
            }

            this.emit("message", message);
        });
    }

    _write(data, dataWritten) {
        this._logger.debug(`Writing ${data.length} bytes to RFXCOM.`);

        this._port.write(data, () => {
            this._port.drain(() => {
                if (dataWritten)
                    dataWritten();
            });
        });
    }
}

module.exports = RfxcomDriver;