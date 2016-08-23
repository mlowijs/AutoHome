const Logger = require("./Logger");

class LoggerFactory {
    getLogger(context) {
        return new Logger(context);
    }
}
module.exports = LoggerFactory;