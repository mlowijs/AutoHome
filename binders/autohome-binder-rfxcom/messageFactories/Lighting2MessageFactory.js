const Lighting2Message = require("../messages/Lighting2Message");

class Lighting2MessageFactory {
    createMessage(sequenceNr, binding, value) {
        switch (binding.subType.toLowerCase()) {
            case Lighting2Message.PACKET_SUBTYPE_AC_STRING:
                return this._createAcMessage(sequenceNr, binding.id, binding.unit, value, false);
        }

        return null;
    }

    _createAcMessage(sequenceNr, id, unit, onOff, isGroup) {
        const packet = [Lighting2Message.PACKET_TYPE_ID, Lighting2Message.PACKET_SUBTYPE_AC_ID, sequenceNr,
            (id & 0xff000000) >> 24, (id & 0xff0000) >> 16, (id & 0xff00) >> 8, (id & 0xff), unit,
        ];

        if (isGroup)
            packet.push(onOff ? 0x04 : 0x03);
        else
            packet.push(onOff ? 0x01 : 0x00);

        packet.push(onOff ? 0x0f : 0x00);
        packet.push(0x00); // Signal level

        packet.unshift(packet.length);

        return packet;
    }
}

module.exports = Lighting2MessageFactory;