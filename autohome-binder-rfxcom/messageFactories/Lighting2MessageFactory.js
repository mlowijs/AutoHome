class Lighting2MessageFactory {
    createMessage(sequenceNr, binding, value) {
        switch (binding.subType.toLowerCase()) {
            case "ac":
                return this._createAcMessage(sequenceNr, binding.id, binding.unit, value, false);
        }

        return null;
    }

    _createAcMessage(sequenceNr, id, unit, onOff, isGroup) {
        const packet = [0x0b, 0x11, 0x00, sequenceNr,
            (id & 0xff000000) >> 24, (id & 0xff0000) >> 16, (id & 0xff00) >> 8, (id & 0xff), unit,
        ];

        if (isGroup)
            packet.push(onOff ? 0x04 : 0x03);
        else
            packet.push(onOff ? 0x01 : 0x00);

        packet.push(onOff ? 0x0f : 0x00);
        packet.push(0x00);

        return packet;
    }
}

module.exports = Lighting2MessageFactory;