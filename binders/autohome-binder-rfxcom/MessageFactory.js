const Lighting2MessageFactory = require("./messageFactories/Lighting2MessageFactory");

const Lighting2Message = require("./messages/Lighting2Message");

class MessageFactory {
    static createResetMessage() {
        return [0x0d, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    static createStatusMessage() {
        return [0x0d, 0, 0, 0x01, 0x02, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    static getMessageFactory(packetType) {
        switch (packetType.toLowerCase()) {
            case Lighting2Message.PACKET_TYPE_STRING:
                return new Lighting2MessageFactory();
        }

        return null;
    }
}

module.exports = MessageFactory;