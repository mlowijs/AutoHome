class Message {
    constructor(data) {
        this.length = data[0];
        this.packetType = data[1];
        this.subType = data[2];
        this.sequenceNumber = data[3];
    }

    getType() {
        throw new Error("Not implemented.");
    }

    matchBinding(binding) {
        throw new Error("Not implemented.");
    }

    getValue() {
        throw new Error("Not implemented.");
    }
}

module.exports = Message;