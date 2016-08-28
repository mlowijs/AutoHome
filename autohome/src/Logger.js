const moment = require("moment");

class Logger {
    constructor(context, level) {
        this._context = context;
        this._level = level;
    }

    debug(message, tag) {
        if (this._level <= Logger.DEBUG)
            this._log("DEBUG", message);
    }

    info(message, tag) {
        if (this._level <= Logger.INFO)
            this._log("INFO", message);
    }

    warn(message, tag) {
        if (this._level <= Logger.WARN)
            this._log("WARN", message, "33");
    }

    error(message, tag) {
        if (this._level <= Logger.ERROR)
            this._log("ERROR", message, "31");
    }

    fatal(message, tag) {
        if (this._level <= Logger.FATAL)
            this._log("FATAL", message, "31");
    }

    _log(level, message, color) {
        color = color || "0";
        level = (level + " ").substr(0, 5); // Pad right

        const now = moment().format("YYYY-MM-DD HH:mm:ss");

        const logMessage = `${now} - \x1b[${color}m${level} [${this._context}] ${message}\x1b[0m`;
        console.log(logMessage);
    }
}

Logger.DEBUG = 0;
Logger.INFO = 1;
Logger.WARN = 2;
Logger.ERROR = 3;
Logger.FATAL = 4;

module.exports = Logger;