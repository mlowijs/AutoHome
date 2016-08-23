//
// AutoHome
//
const config = require("./config.json");

const BinderManager = require("./src/BinderManager");
const BindingManager = require("./src/BindingManager");
const LoggerFactory = require("./src/LoggerFactory");
const ThingManager = require("./src/ThingManager");

const loggerFactory = new LoggerFactory();
const logger = loggerFactory.getLogger("app");

const thingManager = new ThingManager(loggerFactory);
const binderManager = new BinderManager(loggerFactory);
const bindingManager = new BindingManager(loggerFactory, thingManager, binderManager);

thingManager.loadThings(() => {
    binderManager.loadBinders(binder => {
        bindingManager.hookupBindings(binder);
    });
});

//
// Express
//
let express = require("express");
let http = require("http");
let minify = require("express-minify");

let app = express();
let server = http.Server(app);
let io = require("socket.io")(server);

// Setup auto LESS compile/minify
express.static.mime.define({
    "text/less": ["less"]
});
app.use(minify());

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
    logger.debug(`HTTP GET ${req.path}`, "app.get.page");

    let page = req.params.page || "index";
    res.render(page);
});

// API routes
app.get("/api/:thingId", (req, res) => {
    let thing = thingManager.things.get(req.params.thingId);

    if (!thing) {
        res.status(404).end();
        return;
    }

    res.status(200).send(thing.value);
});

app.put("/api/:thingId/:value", (req, res) => {
    let thing = thingManager.things.get(req.params.thingId);

    if (!thing) {
        res.status(404).end();
        return;
    }

    thing.pushValue(req.params.value);
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

        if (thing)
            thing.pushValue(value);
    });
});