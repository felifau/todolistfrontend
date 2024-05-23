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
  border-radius: 10px;
  padding: 8px;
  border: lemonchiffon;
  cursor: pointer;
  color: #333333;
}

button {
  transition-duration: 0.4s;
}

button:hover {
  background-color: lemonchiffon;
  color: #333333;
}

/**
 style for disabled button
 */
button.disabled {
  border-radius: 10px;
  cursor: pointer;
  background-color: #f2f2f2;
  color: #333333;
}
button.disabled:hover {
   background-color: #f2f2f2;
 }
</style>