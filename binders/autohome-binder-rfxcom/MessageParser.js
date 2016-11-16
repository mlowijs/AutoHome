const InterfaceMessage = require("./messages/InterfaceMessage");
const Lighting2Message = require("./messages/Lighting2Message");

class MessageParser {
    static parseMessage(data) {
        const packetType = data[1];

        switch (packetType) {
            case InterfaceMessage.PACKET_TYPE_ID:
                return new InterfaceMessage(data);

            case Lighting2Message.PACKET_TYPE_ID:
                return new Lighting2Message(data);
        }

        return null;
    }
}

module.exports = MessageParser;