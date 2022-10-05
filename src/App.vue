<template>
  <div id="app">
    <router-view />
    <!-- <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o"></van-tabbar-item>
      <van-tabbar-item icon="orders-o"></van-tabbar-item>
      <van-tabbar-item icon="setting-o"></van-tabbar-item>
    </van-tabbar> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style lang="less">
.van-tabbar {
  height: 10vh;
}
</style>
