<template>
  <div id="app">
    <NavBar :navText="this.$store.state.navText" :leftArrow="this.$store.state.leftArrow" />
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
export default {
  components: { NavBar }
}
</script>

<style lang="less">
*::-webkit-scrollbar {
  width: 0 !important;
}
hr {
  height: 1px;
  background-color: #ccc;
  border: none;
  margin-top: 1vh;
  margin-bottom: 1vh;
}

.admin-header {
  margin: 2vh;
  font-size: 3vh;
}
</style>
