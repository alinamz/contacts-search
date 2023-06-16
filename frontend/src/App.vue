<template>
  <Login
    @handleSubmitForm="handleSubmitForm"
    :isSending="isSending"
  />
  <Popup
    :messageResult="messageResult"
    :isOpen="isOpen"
    @handleClosePopup="handleClosePopup"
  />
</template>

<script>
import Login from "./components/Login.vue";
import Popup from "./components/Popup.vue";

let controller = new AbortController();

export default {
  name: "App",
  components: {
    Login,
    Popup,
  },
  data() {
    return {
      isOpen: false,
      messageResult: "",
      isSending: false,
    };
  },
  methods: {
    handleClosePopup(isOpen) {
      this.isOpen = isOpen;
    },
    async handleSubmitForm(data) {
      if (this.isSending) {
        this.isSending = false;
        controller.abort();
      }

      let response;
      try {
        this.isSending = true;
        controller = new AbortController();
        response = await fetch("http://localhost:3000/api/contacts/find", {
          signal: controller.signal,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Текущий запрос прерван, т.к. отправлен новый");
          return;
        } else {
          this.messageResult = "Произошла ошибке при запросе на сервер";
          console.log("Произошла ошибке при запросе на сервер", err);
        }
      }

      if (response != null) {
        switch (response.status) {
          case 200:
            this.messageResult = "Контакт найден в базе";
            break;
          case 204:
            this.messageResult = "По вашему запросу ничего не найдено";
            break;
          case 400:
            this.messageResult = "Были введены некорректные данные";
            break;
          case 500:
            this.messageResult = "Произошла ошибка на сервере! Попробуйте позже";
            break;
          default:
            console.log("Неподдерживаемый код ответа сервера");
            break;
        }
      }
      this.isOpen = true;
      this.isSending = false;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #00341C;
  max-width: 1280px;
  min-width: 320px;
  margin: 0 auto 0;
  min-height: 100vh;
}

body {
  margin: 0;
  padding: 0;
  background-color: rgba(130, 186, 161, 0.5);
}
</style>
