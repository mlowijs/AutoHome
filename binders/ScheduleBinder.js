let Binder = require("./Binder");
let Logger = require("../src/Logger");

class ScheduleBinder extends Binder {
    constructor() {
        super();

        this.logger = { import: true, type: Logger }
    }

    getType() {
        return "schedule";
    }

    bind(thing, binding) {

    }
}

ScheduleBinder._export = true;

module.exports = ScheduleBinder;