class Logger {
    constructor(level) {
        this.level = level;
    }

    debug(message) {
        if (this.level >= Logger.DEBUG)
            this._log(`DEBUG: ${message}`);
    }

    info(message) {
        if (this.level >= Logger.DEBUG)
            this._log(`INFO: ${message}`);
    }

    warn(message) {
        if (this.level >= Logger.WARN)
            this._log(`WARN: ${message}`);
    }

    error(message) {
        if (this.level >= Logger.ERROR)
            this._log(`ERROR: ${message}`);
    }

    fatal(message) {
        if (this.level >= Logger.FATAL)
            this._log(`FATAL: ${message}`);
    }

    _log(message) {
        console.log(message);
    }
}

Logger.DEBUG = 0;
Logger.INFO = 1;
Logger.WARN = 2;
Logger.ERROR = 3;
Logger.FATAL = 4;

module.exports = Logger;