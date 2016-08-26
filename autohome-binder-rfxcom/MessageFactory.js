const Lighting2MessageFactory = require("./messageFactories/Lighting2MessageFactory");

class MessageFactory {
    static createResetMessage() {
        return [0x0d, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    static createStatusMessage() {
        return [0x0d, 0, 0, 0x01, 0x02, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    static getMessageFactory(packetType) {
        switch (packetType.toLowerCase()) {
            case "lighting2":
                return new Lighting2MessageFactory();
        }

        return null;
    }
}

module.exports = MessageFactory;