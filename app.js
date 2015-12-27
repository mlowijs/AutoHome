//
// AutoHome
//
let config = require("./config/main.json");

let DependencyResolver = require("./DependencyResolver");
let dr = new DependencyResolver(["src"]);

let Logger = require("./src/Logger");
let logger = new Logger(config.log.level);

let ThingManager = require("./src/ThingManager");
let thingManager = new ThingManager(logger);

let BinderManager = require("./src/BinderManager");
let binderManager = new BinderManager(logger, thingManager);

binderManager.hookupBindings();

//
// Express
//
let express = require("express")();

// Web app routes
express.get("/", (req, res) => {
   res.status(200).send("Under construction.");
});

// API routes
if (config.api.enabled) {
    express.put("/api/:thingId/:value", (req, res) => {
        let thingId = req.params.thingId;
        let value = req.params.value;

        let thing = thingManager.getThing(thingId);

        if (thing === undefined) {
            res.status(404).end();
            return;
        }

        thing.setValue(value);
        res.status(204).end();
    });
}

express.listen(config.server.port, () => {
    logger.info(`AutoHome webserver is listening on port ${config.server.port}.`, "express.listen");
});