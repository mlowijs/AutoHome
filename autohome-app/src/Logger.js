const config = require("../config.json");
const moment = require("moment");

class Logger {
    constructor(context) {
        this._context = context;
        
        this.level = config.log.level;
    }

    debug(message, tag) {
        if (this.level <= Logger.DEBUG)
            this._log("DEBUG", message, tag);
    }

    info(message, tag) {
        if (this.level <= Logger.INFO)
            this._log("INFO", message, tag);
    }

    warn(message, tag) {
        if (this.level <= Logger.WARN)
            this._log("WARN", message, tag);
    }

    error(message, tag) {
        if (this.level <= Logger.ERROR)
            this._log("ERROR", message, tag);
    }

    fatal(message, tag) {
        if (this.level <= Logger.FATAL)
            this._log("FATAL", message, tag);
    }

    _log(level, message, tag) {
        const now = moment().format("YYYY-MM-DD HH:mm:ss");

        const logMessage = `${now} - ${level}\t\t[${this._context}] ${message}`;
        console.log(logMessage);
    }
}

Logger.DEBUG = 0;
Logger.INFO = 1;
Logger.WARN = 2;
Logger.ERROR = 3;
Logger.FATAL = 4;

module.exports = Logger;