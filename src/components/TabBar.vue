<template>
  <div>
    <van-tabbar
      fixed
      :placeholder="true"
      route
      v-model="index"
      @change="change"
    >
      <van-tabbar-item to="/admin/home" icon="home-o"></van-tabbar-item>
      <van-tabbar-item to="/admin/applyList" icon="orders-o"></van-tabbar-item>
      <van-tabbar-item to="/admin/setting" icon="setting-o"></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0
    }
  },
  methods: {
    change(i) {
      const oldIndex = localStorage.getItem('oldIndex')
      if (oldIndex - i >= 0) this.$router.isBack = true
      localStorage.setItem('oldIndex', this.index)
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabbar {
  height: 10vh;
}
</style>
