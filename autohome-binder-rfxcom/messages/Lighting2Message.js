const Message = require("./Message");

class Lighting2Message extends Message {
    constructor(data) {
        super(data);

        this.id = data[4] << 24 | data[5] << 16 | data[6] << 8 | data[7];
        this.unit = data[8];
        this.isGroup = data[9] === 0x03 || data[9] === 0x04;
        this.onOff = data[10] === 0x0f;
        this.signalLevel = data[11];
    }

    getType() {
        return "lighting2";
    }

    matchBinding(binding) {
        if (binding.packetType !== this.getType())
            return false;

        if (binding.isGroup)
            return false;

        return binding.unit === this.unit && binding.id === this.id;
    }

    getValue() {
        return this.onOff;
    }
}

Lighting2Message.packetType = 0x11;

module.exports = Lighting2Message;