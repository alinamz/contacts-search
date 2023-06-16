const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const contacts = require('./static/data');
const { Contact } = require('./models');

class Application {
  constructor(config) {
    this.expressApp = express();
    this.cors = config.cors;
    this.slowRequestsMs = config.slowRequestsMs;
    this.contacts = contacts;
    this.configureRoutes();
  }

  configureRoutes() {
    let app = this.expressApp;

    app.use(cors({ origin: this.cors }));

    app.use(bodyParser.json());

    app.use((req, res, next) => {
      req.traceId = new Date().getTime();
      console.log(`[${req.traceId}] Входящий запрос ${req.method} ${req.path}`);
      console.log(`[${req.traceId}] Тело запроса`, req.body);
      next();
    });

    if (this.slowRequestsMs > 0) {
      app.use(async (req, res, next) => {
        await new Promise(resolve => {
          console.log(`[${req.traceId}] Заддержка запроса на ${this.slowRequestsMs} мс`);
          setTimeout(resolve, this.slowRequestsMs);
        });
        next();
      });
    }

    app.post('/api/contacts/find', this.findContactHandler.bind(this));

    app.use((err, req, res, next) => {
      console.log(`[${req.traceId}] Исключение при запросе ${req.method} ${req.path}:`, err);

      res.status(500).send({
        "error": {
          "message": "Что-то пошло не так",
          "details": err.message
        }
      });

      next();
    });
  }

  findContactHandler(req, res) {
    const reqContact = new Contact(req.body.email, req.body.number);

    const validationErrors = reqContact.validate();
    if (validationErrors.length > 0) {
      console.log(`[${req.traceId}] Найдены ошибки валидации ${validationErrors.length}`);
      res.status(400).json({ "validationErrors": validationErrors });
      return;
    }

    console.log(`[${req.traceId}] Поиск контакта`, reqContact);
    let resContact = contacts.findContact(reqContact);
    if (resContact == null) {
      console.log(`[${req.traceId}] Контакт не найден`);
      res.status(204).json({});
    } else {
      console.log(`[${req.traceId}] Контакт найден`, resContact);
      res.status(200).json(resContact);
    }
  }
}

module.exports = Application;
