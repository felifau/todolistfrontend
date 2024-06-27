<template>
  <div id="background">
    <slot></slot>
  </div>
</template>

<style scoped>
#background {
  background: rgb(251,226,214);
  background: radial-gradient(circle, rgba(251,226,214,1) 0%, rgba(254,202,177,1) 100%);
  border-radius: 10px;
  padding: 20px;
}
</style>
