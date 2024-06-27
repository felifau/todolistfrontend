<template>
  <div id="background">
    <slot></slot>
  </div>
</template>

<style scoped>
#background {
  background: rgb(235,182,153);
  background: linear-gradient(90deg, rgba(235,182,153,1) 0%, rgba(255,208,183,1) 50%, rgba(255,228,214,1) 100%);
  border-radius: 30px;
  padding: 100px;
}
</style>
