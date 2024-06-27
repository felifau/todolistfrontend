<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent ({
  name: 'DefaultButton',
  props: {
    onClick: Function,
    disabled: Boolean
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click', event);
      }
    }
  }
});
</script>

<template>
  <button :disabled="disabled" @click="handleClick" :class="{ disabled: disabled }">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  border-radius: 20px;
  padding: 15px;
  border: lemonchiffon;
  cursor: pointer;
  color: #333333;
}

button {
  transition-duration: 0.4s;
}

button:hover {
  background: rgb(249,207,178);
  background: radial-gradient(circle, rgba(249,207,178,1) 0%, rgba(255,255,255,1) 100%);
  color: #333333;
}

/**
 style for disabled button
 */
button.disabled {
  border-radius: 10px;
  cursor: pointer;
  background: rgb(232,196,179);
  background: radial-gradient(circle, rgba(232,196,179,1) 0%, rgba(255,255,255,1) 100%);
  color: #333333;
}
button.disabled:hover {
   background-color: #f2f2f2;
 }
</style>