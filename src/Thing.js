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
        let number = null;

        if (typeof value === "boolean" || typeof value === "number" || value instanceof Date)
            this._value = value;
        else if (value === "true" || value === "false")
            this._value = value === "true";
        else if (/\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?((\+\d{4})|Z)?)?$/.test(value))
            this._value = new Date(value);
        else if (!Number.isNaN(number = Number.parseFloat(value, 10)))
            this._value = number;
        else
            this._value = value;

        this.emit("valueSet", this);
    }
}

module.exports = Thing;