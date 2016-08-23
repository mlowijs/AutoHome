const SerialPort = require("serialport");
const MessageFactory = require("./MessageFactory");

class RfxcomDriver {
    constructor(loggerFactory, portName, portOpened) {
        this._sequenceNr = 0;
        this._logger = loggerFactory.getLogger("RfxcomDriver");

        this._port = new SerialPort(portName, {
            baudRate: 38400
        }, (error) => {
            if (error) {
                this._logger.error(`Error while opening serial port '${portName}': ${error}`);
                return;
            }

            portOpened();
        });
    }

    reset(deviceReset) {
        this._logger.info("Resetting RFXCOM.");
        this._write(MessageFactory.createResetMessage(), () => deviceReset());
    }

    sendValue(binding, value) {
        const messageFactory = MessageFactory.getMessageFactory(binding.packetType);
        const message = messageFactory.createMessage(this._sequenceNr++, binding, value);

        this._write(message);
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