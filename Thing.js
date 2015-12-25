let EventEmitter = require("events");

class Thing extends EventEmitter {
    constructor(id) {
        super();

        this.id = id;
        this._value = null;

        Object.defineProperty(this, 'value', {
            get: function() { return this._value; }
        });
    }

    setValue(value) {
        if (typeof value === "boolean" || typeof value === "number")
            this._value = value;
        else if (value === "true" || value === "false")
            this._value = value === "true";
        else if (!Number.isNaN(Number(value).valueOf()))
            this._value = Number(value).valueOf();
        else
            this._value = value;

        this.emit("valueSet", this);
    }
}

module.exports = Thing;