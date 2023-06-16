const Application = require('./app');
const config = require('./config.json');

let app = new Application(config);

app.expressApp.listen(config.port, config.host, function() {
    console.log(`Сервер начал прослушивание запросов на [${config.host}:${config.port}]`);
});
