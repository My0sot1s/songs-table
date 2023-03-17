<template>
  <van-nav-bar
    @click-left="back()"
    :left-text="this.$route.meta.name"
    :left-arrow="this.$route.meta.leftArrow"
    fixed
    placeholder
  />
</template>

<script>
export default {
  props: ['navText', 'leftArrow'],
  methods: {
    onClickLeft() {
      /* console.log('返回') */
    },
    back() {
      if (!this.$route.meta.leftArrow) return
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
.van-nav-bar {
  z-index: 9 !important;
}

//适配软键盘弹出
.van-nav-bar {
  height: 45px;
  .van-nav-bar__content {
    height: 45px !important;
  }
  .van-nav-bar__left {
    height: 45px !important;
    .van-nav-bar__arrow {
      font-size: 5vw !important;
    }
    .van-nav-bar__text {
      font-size: 5vw !important;
    }
  }
}

.van-nav-bar__left > * {
  white-space: nowrap;
  font-size: 5vw;
  color: black !important;
}
</style>
