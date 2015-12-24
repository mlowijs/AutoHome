let BinderManager = require("./BinderManager");
let ThingManager = require("./ThingManager");
let Logger = require("./Logger");

let logger = new Logger(Logger.DEBUG);
let tm = new ThingManager(logger);
let bm = new BinderManager(logger, tm);

bm.hookupBindings();