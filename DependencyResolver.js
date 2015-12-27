let fs = require("fs");
let path = require("path");

class DependencyResolver {
    constructor(paths) {
        this.types = [];

        for (let p of paths) {
            for (let file of fs.readdirSync(p)) {
                let type = require(`./${p}/${file}`);

                if (!type._export)
                    continue;

                this.types.push({
                    name: path.parse(file).name,
                    type: type,
                    instance: new type()
                });
            }
        }

        // Inject dependencies
        for (let dep of this.types) {
            for (let prop in dep.instance) {
                if (typeof dep.instance[prop] === "function") {
                    let part = this.types.find(t => t.name === dep.instance[prop].name);

                    if (part === undefined)
                        continue;

                    dep.instance[prop] = part.instance;

                    console.log(`Set '${prop}' on ${dep.name}`);
                }
            }
        }
    }

    getType(type) {
        let foundType = this.types.find(t => t.type == type);

        if (foundType !== undefined)
            return foundType.instance;

        return null;
    }
}

module.exports = DependencyResolver;