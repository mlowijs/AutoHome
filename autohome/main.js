const BinderManager = require("./src/BinderManager");
const BindingManager = require("./src/BindingManager");
const LoggerFactory = require("./src/LoggerFactory");
const ThingManager = require("./src/ThingManager");

const loggerFactory = new LoggerFactory();
const thingManager = new ThingManager(loggerFactory);
const binderManager = new BinderManager(loggerFactory);
const bindingManager = new BindingManager(loggerFactory, thingManager, binderManager);

const logger = loggerFactory.getLogger("main");
const packageJson = require("./package.json");
logger.info(`Autohome v${packageJson.version} starting up...`);

// Load things, binders, bindings
thingManager.loadThings(() => {
    binderManager.loadBinders(binder => {
        bindingManager.hookupBindings(binder);
    });
});

// Start webserver
const autoHome = require("./src/AutoHome");
autoHome(loggerFactory, thingManager);