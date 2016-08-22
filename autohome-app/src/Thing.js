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

    updateValue(value) {
        let date = null;
        let number = null;

        if (typeof value === "boolean" || typeof value === "number" || value instanceof Date)
            this._value = value;
        else if (value === "true" || value === "false")
            this._value = value === "true";
        else if ((date = moment(value, moment.ISO_8601)).isValid())
            this._value = date.toDate();
        else if (!Number.isNaN(number = Number.parseFloat(value)))
            this._value = number;
        else
            this._value = value;
    }

    setValue(value) {
        let oldValue = this._value;

        this.updateValue(value);

        this.emit("valueSet", this, oldValue);

        if (value !== oldValue)
            this.emit("valueChanged", this, oldValue);
    }
}

module.exports = Thing;