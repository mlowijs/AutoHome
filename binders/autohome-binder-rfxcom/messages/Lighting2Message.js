const Message = require("./Message");
const os = require("os");

class Lighting2Message extends Message {
    constructor(data) {
        super(data);

        this.id = data[4] << 24 | data[5] << 16 | data[6] << 8 | data[7];
        this.unit = data[8];
        this.isGroup = data[9] === 0x03 || data[9] === 0x04;
        this.onOff = data[10] === 0x0f;
        this.signalLevel = data[11];
    }

    matchBinding(binding) {
        if (binding.packetType !== Lighting2Message.PACKET_TYPE_STRING)
            return false;

        if (binding.isGroup)
            return false;

        return binding.unit === this.unit && binding.id === this.id;
    }

    getValue() {
        return this.onOff;
    }


    toString() {
        return [
            super.toString(),
            `ID: ${this.id}`,
            `Unit: ${this.unit}`,
            `Is group: ${this.isGroup}`,
            `On/off: ${this.onOff}`,
            `Signal level: ${this.signalLevel}`
        ].join(os.EOL);
    }
}

Lighting2Message.PACKET_TYPE_ID = 0x11;
Lighting2Message.PACKET_TYPE_STRING = "lighting2";

Lighting2Message.PACKET_SUBTYPE_AC_ID = 0x00;
Lighting2Message.PACKET_SUBTYPE_AC_STRING = "ac";

module.exports = Lighting2Message;