<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss" scoped>
#app {
  background-image: url(~@/assets/bg.jpg);
  background-size: contain;
}
</style>
