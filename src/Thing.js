const EventEmitter = require("events");
const moment = require("moment");

class Thing extends EventEmitter {
    constructor(id) {
        super();

        this._id = id;
        this._value = null;

        Object.defineProperty(this, "id", {
            get() { return this._id; }
        });

        Object.defineProperty(this, "value", {
            get() { return this._value; }
        });
    }

    setValue(value) {
        const oldValue = this._setValue(value);
        this.emit("valueSet", oldValue);
    }

    pushValue(value) {
        const oldValue = this._setValue(value);
        this.emit("valuePushed", oldValue);
    }

    _setValue(value) {
        const oldValue = this._value;

        let date = null;
        let number = null;

        if (value === "$toggle")
            this._value = !this._value;
        else if (typeof value === "boolean" || typeof value === "number" || value instanceof Date)
            this._value = value;
        else if (value === "true" || value === "false")
            this._value = value === "true";
        else if ((date = moment(value, moment.ISO_8601)).isValid())
            this._value = date.toDate();
        else if (!Number.isNaN(number = Number.parseFloat(value)))
            this._value = number;
        else
            this._value = value;

        return oldValue;
    }
}

module.exports = Thing;