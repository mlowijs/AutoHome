module.exports = {
    name: "Test dingetje 2",
    bindings: [
        {
            type: "http",
            direction: "in",
            initialize: true,
            interval: 300,
            transform(data) { return JSON.parse(data).main.temp; },
            url: "http://api.openweathermap.org/data/2.5/weather?q=Groningen,nl&appid=c440dff2a92e5ca46159f2fe3e67fda9&units=metric",
            method: "get"
        },
        {
            type: "http",
            direction: "out",
            getOptions(thing) {
                return {
                    method: "post",
                    url: `http://requestb.in/1fux9yt1?value=${thing.value}`
                }
            }
        }
    ]
};