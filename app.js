//
// AutoHome
//
let config = require("./config/main.json");

let BinderManager = require("./src/BinderManager");
let DependencyResolver = require("./src/DependencyResolver");
let Logger = require("./src/Logger");
let ThingManager = require("./src/ThingManager");

let dr = new DependencyResolver(["src", "binders"]);
let logger = dr.get(Logger);

let binderManager = dr.get(BinderManager);
binderManager.hookupBindings();

let thingManager = dr.get(ThingManager);

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

        let thing = thingManager.getThingById(thingId);

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