// AutoHome
let BinderManager = require("./BinderManager");
let ThingManager = require("./ThingManager");
let Logger = require("./Logger");

let logger = new Logger(Logger.DEBUG);
let thingManager = new ThingManager(logger);
let binderManager = new BinderManager(logger, thingManager);

binderManager.hookupBindings();

//
// Express
//
var express = require("express");
var expressApp = express();

// Web app routes

// API routes
expressApp.put("/api/:thingId/:value", (req, res) => {
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

expressApp.listen(3000, () => {
    console.log("Express is listening");
});