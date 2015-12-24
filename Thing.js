let EventEmitter = require("events");

class Thing extends EventEmitter {
    constructor(id) {
        super();

        this.id = id;
        this.value = null;
    }

    setValue(value) {
        if (value === "true" || value === "false") {
            this.value = value === "true";
        } else if (!Number.isNaN(Number(value).valueOf())) {
            this.value = Number(value).valueOf();
        } else {
            this.value = value;
        }

        this.emit("valueSet", this);
    }
}

module.exports = Thing;