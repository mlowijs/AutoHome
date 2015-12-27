let EventEmitter = require("events");
let moment = require("moment");

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
        let date = null;
        let number = null;

        if (typeof value === "boolean" || typeof value === "number" || value instanceof Date)
            this._value = value;
        else if (value === "true" || value === "false")
            this._value = value === "true";
        else if ((date = moment(value, moment.ISO_8601)).isValid())
            this._value = date.toDate();
        else if (!Number.isNaN(number = Number.parseFloat(value, 10)))
            this._value = number;
        else
            this._value = value;

        this.emit("valueSet", this);
    }
}

module.exports = Thing;