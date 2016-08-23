class InterfaceMessageParser {
    static getPacketType() {
        return 0x01;
    }

    parseMessage(data, messageParsed) {
        const commandType = data[4];

        switch (commandType) {
            case 0x02:
                this._parseStatusMessage(data, messageParsed);
                break;
        }
    }

    _parseStatusMessage(data, messageParsed) {
        messageParsed({
            length: data[0],
            packetType: data[1],
            subType: data[2],
            sequenceNumber: data[3],
            commandType: data[4],
        });
    }
}

module.exports = InterfaceMessageParser;