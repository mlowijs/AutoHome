const Message = require("./Message");

class InterfaceMessage extends Message {
    constructor(data) {
        super(data);

        this.commandType = data[4];
        this.transceiverType = data[5];
    }
}

InterfaceMessage.packetType = 0x01;

InterfaceMessage.statusCommand = 0x02;

module.exports = InterfaceMessage;