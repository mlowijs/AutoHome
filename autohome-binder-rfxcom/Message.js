class Message {
    constructor(data) {
        this.length = data[0];
        this.packetType = data[1];
        this.subType = data[2];
        this.sequenceNumber = data[3];
    }
}

module.exports = Message;