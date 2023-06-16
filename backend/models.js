const validator = require('validator');

class Contact {
  constructor(email, number) {
    this.email = email != null ? email.toLowerCase() : null;
    this.number = number;
  }

  validate() {
    const validationErrors = [];

    // Валидация почты
    if (this.email == null || this.email === '') {
      validationErrors.push("Не заполнено обязательное поле email");
    } else if (!validator.isEmail(this.email)) {
      validationErrors.push("Указан некорректный email");
    }

    // Валидация номера
    if (this.number != null && this.number !== '') {
      if (this.number.length < 6)
        validationErrors.push(`Минимальное количество символов в поле number должно быть 6, а получено ${this.number.length}`);

      if (!validator.isNumeric(this.number))
        validationErrors.push(`Поле number должно содержать только цифры`);
    }

    return validationErrors;
  }
}

class ContactStorage {
  constructor(contacts) {
    this._contacts = contacts == null
      ? []
      : contacts.map(c => new Contact(c.email, c.number));
  }

  findContact(contact) {
    const email = contact.email;
    const number = contact.number;

    if (email == null)
      return null;

    if (number == null || number === '')
      return this._findContactByEmail(email.toLowerCase());

    return this._findByEmailAndNumber(email.toLowerCase(), number);
  }

  _findContactByEmail(email) {
    console.log('Выполняется поиск по эмейлу', email);
    return this._contacts.find(c => c.email === email);
  }

  _findByEmailAndNumber(email, number) {
    console.log('Выполняется поиск по эмейлу и номеру', email, number);
    return this._contacts.find(c => c.email === email && c.number === number);
  }

}

module.exports = { ContactStorage, Contact };
