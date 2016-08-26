const BinderManager = require("./src/BinderManager");
const BindingManager = require("./src/BindingManager");
const LoggerFactory = require("./src/LoggerFactory");
const ThingManager = require("./src/ThingManager");

const loggerFactory = new LoggerFactory();

const thingManager = new ThingManager(loggerFactory);
const binderManager = new BinderManager(loggerFactory);
const bindingManager = new BindingManager(loggerFactory, thingManager, binderManager);

// Load things, binders, bindings
thingManager.loadThings(() => {
    binderManager.loadBinders(binder => {
        bindingManager.hookupBindings(binder);
    });
});

// Start webserver
const autoHome = require("./src/AutoHome")(loggerFactory, thingManager);