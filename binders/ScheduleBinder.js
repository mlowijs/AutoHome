let Binder = require("./Binder");
let CronJob = require("cron").CronJob;
let Logger = require("../src/Logger");

class ScheduleBinder extends Binder {
    constructor() {
        super();

        this.logger = { import: true, type: Logger }
    }

    getType() {
        return "schedule";
    }

    validateBinding(binding) {
        if (binding.schedule === undefined || binding.schedule === "")
            return "schedule";

        return true;
    }

    bind(thing, binding) {
        let job = new CronJob(binding.schedule, function() {
            binding.elapsed.call(thing);
        });
        job.start();

        binding._job = job;
    }
}

ScheduleBinder._export = true;

module.exports = ScheduleBinder;