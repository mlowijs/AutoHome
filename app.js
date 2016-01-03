//
// AutoHome
//
let config = require("./config/main.json");

let BinderManager = require("./src/BinderManager");
let Logger = require("./src/Logger");
let ThingManager = require("./src/ThingManager");

let logger = new Logger();
let thingManager = new ThingManager(logger);
let binderManager = new BinderManager(logger, thingManager);
binderManager.hookupBindings();

//
// Express
//
let express = require("express");
let http = require("http");

let app = express();
let server = http.Server(app);
let io = require("socket.io")(server);

// Jade view engine
app.set("view engine", "jade");
app.set("views", `${__dirname}/webapp/views`);

// Static routes
app.use("/css", express.static(`${__dirname}/webapp/css`));
app.use("/fonts", express.static(`${__dirname}/webapp/fonts`));
app.use("/images", express.static(`${__dirname}/webapp/images`));
app.use("/js", express.static(`${__dirname}/webapp/js`));

// Web app routes
app.get("/favicon.ico", (req, res) => {
    res.set("Content-Type", "image/png");
    res.sendFile(`${__dirname}/webapp/images/favicon.png`);
});

app.get("/:page?", (req, res) => {
    logger.debug(`HTTP ${req.method} ${req.path}`, "app.get.page");

    let page = req.params.page || "index";
    res.render(page);
});

// API routes
app.put("/api/:thingId/:value", (req, res) => {
    let thing = thingManager[req.params.thingId];

    if (thing === null) {
        res.status(404).end();
        return;
    }

    thing.value = req.params.value;
    res.status(204).end();
});

server.listen(config.server.port, () => {
    logger.info(`AutoHome webserver is listening on port ${config.server.port}.`, "app.server.listen");
});

//
// Socket.IO
//
io.on("connection", (socket) => {
    thingManager.on("valueSet", (thing) => {
        socket.emit("valueSet", thing.id, thing.value);
    });

    socket.on("setValue", (thingId, value) => {
        logger.debug(`Received setValue event for '${thingId}' with value '${value}'`, "socketio.socket.setValue");

        let thing = thingManager.things[thingId];

        if (thing !== null)
            thing.value = value;
    });
});