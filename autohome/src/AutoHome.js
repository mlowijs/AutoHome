const config = require("./../config/main.json");

function setupLessMinify(app, express) {
    const minify = require("express-minify");

    express.static.mime.define({
        "text/less": ["less"]
    });

    app.use(minify());
}

function setupJadeViewEngine(app) {
    app.set("view engine", "jade");
    app.set("views", `${__dirname}/../webapp/views`);
}

function setupStaticRoutes(app, express) {
    app.use("/css", express.static(`${__dirname}/../webapp/css`));
    app.use("/fonts", express.static(`${__dirname}/../webapp/fonts`));
    app.use("/images", express.static(`${__dirname}/../webapp/images`));
    app.use("/js", express.static(`${__dirname}/../webapp/js`));
}

function setupWebAppRoutes(logger, app) {
    app.get("/favicon.ico", (req, res) => {
        res.set("Content-Type", "image/png");
        res.sendFile(`${__dirname}/../webapp/images/favicon.png`);
    });

    app.get("/:page?", (req, res) => {
        logger.debug(`HTTP GET ${req.path}`, "app.get.page");

        const page = req.params.page || "index";
        res.render(page);
    });
}

function setupApiRoutes(app, thingManager) {
    app.get("/api/:thingId", (req, res) => {
        const thing = thingManager.things.get(req.params.thingId);

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
}

function setupSocketIo(logger, server, thingManager) {
    const io = require("socket.io")(server);

    io.on("connection", (socket) => {
        thingManager.on("valueSet", (thing) => {
            socket.emit("valueSet", thing.id, thing.value);
        });

        socket.on("setValue", (thingId, value) => {
            logger.debug(`Received setValue event for '${thingId}' with value '${value}'`, "socketio.socket.setValue");

            const thing = thingManager.things.get(thingId);

            if (thing)
                thing.pushValue(value);
        });
    });
}

module.exports = function createServer(loggerFactory, thingManager) {
    const logger = loggerFactory.getLogger("app.server");

    const express = require("express");
    const http = require("http");

    const app = express();
    const server = http.Server(app);

    setupLessMinify(app, express);
    setupJadeViewEngine(app);
    setupStaticRoutes(app, express);
    setupWebAppRoutes(logger, app);
    setupApiRoutes(app, thingManager);
    setupSocketIo(logger, server, thingManager);

    server.listen(config.server.port, () => {
        logger.info(`AutoHome webserver is listening on port ${config.server.port}.`);
    });

    return server;
};