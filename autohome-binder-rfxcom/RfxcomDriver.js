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
                this._logger.error(`Error while opening serial port: ${error}`);
                return;
            }

            this.reset(() => portOpened());
        });
    }

    reset(deviceReset) {
        this._logger.debug("Resetting RFXCOM.");
        this._write(MessageFactory.createResetMessage(), () => deviceReset());
    }

    test(binding, value) {
        this._write(MessageFactory.createLighting2AcMessage(this._sequenceNr++, binding.id, binding.unit, value, false), () => {});
    }

    _write(data, dataWritten) {
        this._logger.debug(`Writing ${data.length} bytes to RFXCOM.`);

        this._port.write(data, () => {
            this._port.drain(() => dataWritten())
        });
    }
}

module.exports = RfxcomDriver;