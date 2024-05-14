<script>
export default {
  props: {
    onClick: Function
  }
};
</script>

<template>
  <button @click="onClick">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  border-radius: 20px;
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
</style>