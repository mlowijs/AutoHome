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
let express = require("express");
let app = express();

// Setup view engine
app.set("view engine", "jade");
app.set("views", `${__dirname}/webapp/views`);

// Static routes
app.use("/css", express.static(`${__dirname}/webapp/css`));
app.use("/fonts", express.static(`${__dirname}/webapp/fonts`));
app.use("/images", express.static(`${__dirname}/webapp/images`));
app.use("/js", express.static(`${__dirname}/webapp/js`));

// Web app routes
app.get("/", (req, res) => {
    res.render("index", {
        message: "Bye world!"
    });
});

// API routes
app.put("/api/:thingId/:value", (req, res) => {
    let thing = thingManager.getThingById(req.params.thingId);

    if (thing === undefined) {
        res.status(404).end();
        return;
    }

    thing.setValue(req.params.value);
    res.status(204).end();
});

app.listen(config.server.port, () => {
    logger.info(`AutoHome webserver is listening on port ${config.server.port}.`, "express.listen");
});