<script>
export default {
  props: {
    buttonClass: String,
    onClick: Function
  }
};
</script>

<template>
  <button :class="buttonClass" @click="onClick">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  border-radius: 10px;
  padding: 8px;
  border: none;
  cursor: pointer;
}
</style>