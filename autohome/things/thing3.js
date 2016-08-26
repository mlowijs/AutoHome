module.exports = {
    name: "Rfxcom dingetje",
    bindings: [
        {
            type: "rfxcom",
            direction: "in",
            packetType: "lighting2",
            subType: "ac",
            id: 17204262,
            unit: 5,
        },
        {
            type: "mqtt",
            direction: "in",
            topic: "test/aap",
            broker: "testBroker1"
        },
        {
            type: "http",
            direction: "out",

            getOptions(thing) {
                return {
                    method: "post",
                    url: `http://requestb.in/1gapntx1?value=${thing.value}`
                };
            }
        },
    ]
};