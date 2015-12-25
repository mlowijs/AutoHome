//
// AutoHome
//
let config = require("./config/main.json");

let Logger = require("./Logger");
let logger = new Logger(Logger.DEBUG);

let ThingManager = require("./ThingManager");
let thingManager = new ThingManager(logger);

let BinderManager = require("./BinderManager");
let binderManager = new BinderManager(logger, thingManager);

binderManager.hookupBindings();

//
// Express
//
var express = require("express")();

// Web app routes
express.get("/", (req, res) => {
   res.status(200).send("Under construction.");
});

// API routes
express.put("/api/:thingId/:value", (req, res) => {
    let thingId = req.params.thingId;
    let value = req.params.value;

    let thing = thingManager.getThing(thingId);

    if (thing === undefined) {
        res.status(404).end();
        return;
    }

    thing.setValue(value);
    res.status(200).end();
});

express.listen(config.server.port, () => {
    logger.info(`AutoHome webserver is online at port ${config.server.port}.`);
});