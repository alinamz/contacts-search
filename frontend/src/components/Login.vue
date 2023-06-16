<template>
  <div class="login">
    <h1 class="login__title">Добро пожаловать</h1>
    <form
      novalidate="true"
      class="login__form"
      v-on:submit.prevent="SubmitForm"
    >
      <label class="login__label">
        <p class="login__name-input">Введите e-mail</p>
        <input
          id="email__data"
          v-model="v$.form.email.$model"
          type="email"
          class="login__input"
        />
        <span v-if="v$.form.email.$error" class="login__span">
          <template v-if="v$.form.$errors && v$.form.$errors.length">
            Некорректный email
          </template>
        </span>
      </label>

      <label class="login__label">
        <p class="login__name-input">Введите номер</p>
        <input
          v-model="v$.form.number.$model"
          type="text"
          id="number__date"
          class="login__input"
          v-sixNumbersMask
        />
        <span v-if="v$.form.number.$error" class="login__span">
          <template v-if="v$.form.$errors && v$.form.$errors.length">
            Номер должен состоять из 6 цифр
          </template>
        </span>
      </label>

      <button
        :disabled="v$.form.$invalid"
        class="login__button"
        :class="[v$.form.$invalid ? 'login__button_dis' : 'login__button_act']"
        type="submit"
      >
        Найти
      </button>
    </form>
  </div>
</template>

<script>
import { required, email, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "Login-app",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      form: {
        email: "",
        number: "",
      },
    };
  },
  methods: {
    SubmitForm() {
      let data = {
        email: this.form.email,
        number: this.form.number.replace(/-/g, ""),
      };
      this.$emit("handleSubmitForm", data);
      this.form.email = "";
      this.form.number = "";
    },
  },
  validations() {
    return {
      form: {
        email: {
          required,
          email,
        },
        number: {
          min: minLength(6),
        },
      },
    };
  },
  directives: {
    sixNumbersMask: {
      mounted(el) {
        el.oninput = function (e) {
          if (!e.isTrusted) {
            return;
          }

          let match;
          const rawValue = this.value.replace(/[\D- ]/g, "");

          if (rawValue.length <= 2) {
            this.value = rawValue;
            return;
          }

          if (rawValue.length > 2 && rawValue.length < 5) {
            match = rawValue.match(/(\d{0,2})(\d{0,2})/);
            this.value = match[1] + "-" + match[2];
            return;
          }

          match = rawValue.match(/(\d{0,2})(\d{0,2})(\d{0,2})/);
          this.value = match[1] + "-" + match[2] + "-" + match[3];
        };
      },
    },
  },
};
</script>

<style scoped>
.login {
  width: 40%;
  margin: 0 auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login__title {
  padding: 60px 0 70px;
  margin: 0;
  font-size: 41px;
}

.login__label {
  position: relative;
  width: 100%;
}

.login__name-input {
  margin: 0 auto 10px;
  padding: 0;
  text-align: left;
  font-weight: 600;
  font-size: 20px;
}

.login__input {
  width: 98%;
  height: 35px;
  border-radius: 5px;
  outline: none;
  border: none;
  padding-left: 5px;
  background-color: rgb(130, 186, 161);
  color: #2c3e50;
  font-size: 15px;
  font-weight: 300;
}

.login__button {
  outline: none;
  border: none;
  border-radius: 5px;
  width: 100%;
  height: 50px;
  margin: 26px auto;
  font-size: 20px;
  font-size: 18px;
  font-weight: 600;
}
.login__button_act {
  background-color: rgba(0, 52, 28, 0.8);
  color: #fafafa;
}

.login__button_dis {
  background-color: rgba(0, 52, 28, 0.4);
}

.login__span {
  position: absolute;
  color: #ff6347;
  left: 5px;
  top: 75px;
  font-size: 13px;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 85%;
  align-items: center;
}

@media screen and (max-width: 748px) {
  .login {
    width: 50%;
  }

  .login__form {
    width: 100%;
  }

  .login__title {
    padding: 60px 0 50px;
  }
}

@media screen and (max-width: 748px) {
  .login {
    width: 65%;
  }
}

@media screen and (max-width: 748px) {
  .login {
    width: 80%;
  }
}
</style>
