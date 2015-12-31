module.exports = {
    name: "Eettafel woonkamer",
    bindings: [
        //{
        //    type: "bt",
        //    mac: "4C:7C:5F:61:15:A2",
        //    intervalPresent: 120,
        //    intervalAbsent: 5
        //},
    ],

    valueSet(oldValue, things) {
        things["thing2"].value = this.value;
    }
};