const config = require("./../config/main.json");

function optionalAuthMiddleware(passport) {
    return (req, res, next) => {
        if (config.users) {
            const result = passport.authenticate('basic', { session: false });

            result(req, res, next);
        } else {
            next();
        }
    }
}

function setupPassport(app) {
    const passport = require("passport");
    const BasicStrategy = require("passport-http").BasicStrategy;

    app.use(passport.initialize());

    passport.use(new BasicStrategy((userName, password, done) => {
        const savedPassword = config.users[userName];

        if (!savedPassword || password !== savedPassword)
            return done(null, false);

        return done(null, true);
    }));

    return passport;
}

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

function setupWebAppRoutes(logger, app, passport) {
    app.get("/favicon.ico", (req, res) => {
        res.set("Content-Type", "image/png");
        res.sendFile(`${__dirname}/../webapp/images/favicon.png`);
    });

    app.get("/:page?", optionalAuthMiddleware(passport), (req, res) => {
            logger.debug(`HTTP GET ${req.path}`, "app.get.page");

            const page = req.params.page || "index";
            res.render(page);
    });
}

function setupApiRoutes(app, passport, thingManager) {
    app.get("/api/:thingId", optionalAuthMiddleware(passport), (req, res) => {
        const thing = thingManager.things.get(req.params.thingId);

        if (!thing) {
            res.status(404).end();
            return;
        }

        res.status(200).send(thing.value);
    });

    app.put("/api/:thingId/:value", optionalAuthMiddleware(passport), (req, res) => {
        const thing = thingManager.things.get(req.params.thingId);

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
        function emitValueEvent(thing) {
            socket.emit("value", thing.id, thing.value);
        }

        thingManager.on("valueSet", emitValueEvent);
        thingManager.on("valuePushed", emitValueEvent);

        socket.on("setValue", (thingId, value) => {
            logger.debug(`Received setValue event for '${thingId}' with value '${value}'`, "socketio.socket.setValue");

            const thing = thingManager.things.get(thingId);

            if (thing)
                thing.pushValue(value);
        });
    });
}

module.exports = (loggerFactory, thingManager) => {
    const logger = loggerFactory.getLogger("AutoHome");

    const express = require("express");
    const http = require("http");

    const app = express();
    const server = http.Server(app);

    const passport = setupPassport(app);
    setupLessMinify(app, express);
    setupJadeViewEngine(app);
    setupStaticRoutes(app, express);
    setupWebAppRoutes(logger, app, passport);
    setupApiRoutes(app, passport, thingManager);
    setupSocketIo(logger, server, thingManager);

    server.listen(config.server.port, () => {
        logger.info(`Web server is listening on port ${config.server.port}.`);
    });
};