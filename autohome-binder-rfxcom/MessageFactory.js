class MessageFactory {
    static createResetMessage() {
        return [0x0d, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    static createLighting2AcMessage(sequenceNr, id, unit, onOff, isGroup) {
        const packet = [0x0b, 0x11, 0x00, sequenceNr,
            (id & 0xff000000) >> 24, (id & 0xff0000) >> 16, (id & 0xff00) >> 8, (id & 0xff), unit,
        ];

        if (isGroup) {
            if (onOff)
                packet.push(0x04);
            else
                packet.push(0x03);
        } else {
            if (onOff)
                packet.push(0x01);
            else
                packet.push(0x00);
        }

        packet.push(onOff ? 0x0f : 0x00);
        packet.push(0x00);

        return packet;
    }
}

module.exports = MessageFactory;