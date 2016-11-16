const Message = require("./Message");

class InterfaceMessage extends Message {
    constructor(data) {
        super(data);

        this.commandType = data[4];
        this.transceiverType = data[5];
    }
}

InterfaceMessage.PACKET_TYPE_ID = 0x01;

InterfaceMessage.COMMAND_STATUS = 0x02;

module.exports = InterfaceMessage;