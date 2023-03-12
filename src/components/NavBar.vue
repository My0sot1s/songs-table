<template>
  <van-nav-bar
    @click-left="back()"
    fixed
    :placeholder="true"
    :left-text="navText"
    :left-arrow="leftArrow"
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
