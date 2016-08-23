const EventEmitter = require("events");
const MessageFactory = require("./MessageFactory");
const MessageParser = require("./MessageParser");
const SerialPort = require("serialport");

class RfxcomDriver extends EventEmitter {
    constructor(loggerFactory, portName, portOpened) {
        super();

        this._sequenceNumber = 0;
        this._logger = loggerFactory.getLogger("RfxcomDriver");

        this._port = new SerialPort(portName, {
            baudRate: 38400
        }, (error) => {
            if (error) {
                this._logger.error(`Error while opening serial port '${portName}': ${error}`);
                return;
            }

            let buffer = [];

            this._port.on("data", (data) => {
                buffer = buffer.concat(data);

                if (data[0] === data.length - 1) {
                    this._receiveMessage(data);
                    buffer = [];
                }
            });

            portOpened();
        });
    }

    reset() {
        this._logger.debug("Resetting RFXCOM.");

        this._write(MessageFactory.createResetMessage(), () => setTimeout(() =>
            this._write(MessageFactory.createStatusMessage()), 500)
        );
    }

    sendMessage(binding, value) {
        const messageFactory = MessageFactory.getMessageFactory(binding.packetType);
        const message = messageFactory.createMessage(this._sequenceNumber++, binding, value);

        this._write(message);
    }

    _receiveMessage(data) {
        // this._logger.debug(`Received message: ${dataString}`);

        const message = MessageParser.parseMessage(data);

        if (message && message.packetType === 0x01 && message.commandType === 0x02) {
            this._logger.info("RFXCOM initialized.");

            this._sequenceNumber = message.sequenceNumber;

            this.emit("initialized");
            return;
        }

        this.emit("message", message);
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