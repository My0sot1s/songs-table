<template>
  <div>
    <van-tabbar route>
      <van-tabbar-item to="/admin/home" icon="home-o"></van-tabbar-item>
      <van-tabbar-item to="/admin/applyList" icon="orders-o"></van-tabbar-item>
      <van-tabbar-item to="/admin/setting" icon="setting-o"></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style lang='less' scoped>
.van-tabbar {
  height: 10vh;
}
</style>
