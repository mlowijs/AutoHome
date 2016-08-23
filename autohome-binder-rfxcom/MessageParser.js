const InterfaceMessageParser = require("./messageParsers/InterfaceMessageParser");

class MessageParser {
    static parseMessage(data, messageParsed) {
        const packetType = data[1];

        switch (packetType) {
            case InterfaceMessageParser.getPacketType():
                new InterfaceMessageParser().parseMessage(data, messageParsed);
                break;
        }
    }
}

module.exports = MessageParser;