const InterfaceMessage = require("./messages/InterfaceMessage");
const Lighting2Message = require("./messages/Lighting2Message");

class MessageParser {
    static parseMessage(data) {
        const packetType = data[1];

        switch (packetType) {
            case InterfaceMessage.packetType:
                return new InterfaceMessage(data);

            case Lighting2Message.packetType:
                return new Lighting2Message(data);
        }

        return null;
    }
}

module.exports = MessageParser;