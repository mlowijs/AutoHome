let fs = require("fs");
let path = require("path");

class DependencyResolver {
    constructor(paths, callback) {
        this.exports = [];

        this.loadExports(paths);
        this.injectDependencies();
    }

    loadExports(paths) {
        for (let p of paths) {
            for (let file of fs.readdirSync(p)) {
                let type = require(`../${p}/${file}`);

                if (!type._export)
                    continue;

                this.exports.push({
                    name: path.parse(file).name,
                    type: type,
                    instance: new type()
                });
            }
        }
    }

    injectDependencies() {
        for (let exp of this.exports) {
            for (let propName in exp.instance) {
                let prop = exp.instance[propName];

                if (prop === null || typeof prop !== "object" || !prop.import || prop.type === undefined)
                    continue;

                if (Array.isArray(prop.type) && typeof prop.type[0] === "function") {
                    let parts = this.exports.filter(t => t.instance instanceof prop.type[0]);
                    exp.instance[propName] = parts.map(p => p.instance);
                } else {
                    let part = this.exports.find(t => t.instance instanceof prop.type);
                    exp.instance[propName] = part !== undefined ? part.instance : null;
                }
            }
        }
    }

    get(type) {
        let exp = this.exports.find(t => t.type === type);

        return exp !== undefined ? exp.instance : null;
    }
}

module.exports = DependencyResolver;