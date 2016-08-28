const config = require("./main.json");
const Logger = require("./Logger");

class LoggerFactory {
    getLogger(context) {
        return new Logger(context, config.log.level);
    }
}
module.exports = LoggerFactory;