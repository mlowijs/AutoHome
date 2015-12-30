let config = require("../config/main.json");
let moment = require("moment");

class Logger {
    constructor() {
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
        tag = tag || "";
        let now = moment().format("YYYY-MM-DD HH:mm:ss");

        let logMessage = `${now} - ${level}\t\t[${tag}] ${message}`;
        console.log(logMessage);
    }
}

Logger.DEBUG = 0;
Logger.INFO = 1;
Logger.WARN = 2;
Logger.ERROR = 3;
Logger.FATAL = 4;

Logger._export = true;

module.exports = Logger;