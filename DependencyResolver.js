let fs = require("fs");
let path = require("path");

class DependencyResolver {
    constructor(paths) {
        this.types = [];

        for (let p of paths) {
            for (let file of fs.readdirSync(p)) {
                let type = require(`./${p}/${file}`);

                this.types.push({
                    name: path.parse(file).name,
                    //type: new type()
                });
            }
        }

        // Inject dependencies
        for (let dep in this.types) {

        }

    }
}

module.exports = DependencyResolver;