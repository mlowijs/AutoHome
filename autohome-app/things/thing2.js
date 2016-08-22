module.exports = {
    name: "Test dingetje 2",
    bindings: [
        // {
        //     type: "http",
        //     direction: "out",
        //     initialize: true,
        //     interval: 300,
        //     transform(data) { return JSON.parse(data).main.temp; },
        //     url: "http://api.openweathermap.org/data/2.5/weather?q=Groningen,nl&appid=c440dff2a92e5ca46159f2fe3e67fda9&units=metric"
        // },
        {
            type: "http",
            direction: "out",
            method: "POST",
            url: "http://requestb.in/pajk2rpa?test=aap"
        }
    ]
};