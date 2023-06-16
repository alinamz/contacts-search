<template>
  <div :class="[isOpen ? 'popup' : '']">
    <div :class="[isOpen ? 'popup__opened' : 'popup__dis']">
      <button @click="closePopup" class="popup__close">&#10006;</button>
      <h1 className="popup__text">{{ this.messageResult }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popup-app",
  props: {
    isOpen: Boolean,
    messageResult: String
  },
  data() {
    return {
      isShow: this.isOpen
    };
  },
  methods: {
    closePopup() {
      this.isShow = false;
      this.$emit("handleClosePopup", this.isShow);
    },
  }
};
</script>

<style scoped>
.popup {
  display: flex;
  position: fixed;
  width: 100%;
  visibility: visible;
  opacity: 1;
  height: 100%;
  top: 0;
  flex-direction: column;
  left: 0;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  transition: visibility 0.2s, opacity 0.5s linear;
}
.popup__opened {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #00341C;
  width: 298px;
  height: 100px;
  border: none;
}

.popup__dis {
  display: none;
}

.popup__text {
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
  line-height: 29px;
  margin: 10px;
}

.popup__close {
  outline: none;
  position: absolute;
  right: -31px;
  border: none;
  top: -32px;
  height: 28px;
  width: 32px;
  background-color: rgba(0, 0, 0, 0);
  color: #ffff;
}
</style>