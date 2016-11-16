const EventEmitter = require("events");
const InterfaceMessage = require("./messages/InterfaceMessage");
const MessageFactory = require("./MessageFactory");
const MessageParser = require("./MessageParser");
const SerialPort = require("serialport");
const os = require("os");

class RfxcomDriver extends EventEmitter {
    constructor(loggerFactory, portName, portOpened) {
        super();

        this._initialized = false;
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
                buffer = buffer.concat(Array.from(data));

                if (buffer[0] === buffer.length - 1) {
                    this._receiveMessage(buffer);
                    buffer = [];
                }
            });

            portOpened();
        });
    }

    reset() {
        this._logger.debug("Resetting RFXCOM.");

        this._initialized = false;

        this._write(MessageFactory.createResetMessage(), () => setTimeout(() => {
            this._write(MessageFactory.createStatusMessage())
        }, 1000));
    }

    sendMessage(binding, value) {
        if (!this._initialized) {
            this._logger.debug("Did not send message, RFXCOM not initialized.");
            return;
        }

        const messageFactory = MessageFactory.getMessageFactory(binding.packetType);
        const message = messageFactory.createMessage(this._sequenceNumber++, binding, value);

        this._write(message);
    }

    _receiveMessage(data) {
        this._logger.debug(`Received ${data.length} bytes from RFXCOM.`);
        const message = MessageParser.parseMessage(data);

        if (message && message.packetType === InterfaceMessage.PACKET_TYPE_ID && message.commandType === InterfaceMessage.COMMAND_STATUS) {
            this._logger.debug("RFXCOM initialized.");

            this._sequenceNumber = message.sequenceNumber;
            this._initialized = true;

            this.emit("initialized");
            return;
        }

        if (message) {
            this._logger.debug(`Received RFXOM message: ${message.toString()}`);
            this.emit("message", message);
        }
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