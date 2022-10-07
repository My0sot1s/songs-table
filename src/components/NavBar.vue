<template>
  <van-nav-bar
    @click-left="back()"
    fixed
    placeholder
    :left-text="navText"
    :left-arrow="leftArrow"
  />
</template>

<script>
export default {
  props: ['navText', 'leftArrow'],
  methods: {
    onClickLeft() {
      console.log('返回')
    },
    back() {
      this.$router.back()
    }
  }
}
</script>

<style>
.van-nav-bar {
  height: 28vw;
}
.van-nav-bar__content {
  position: absolute !important;
  bottom: 2vw;
}
.van-nav-bar__left > * {
  white-space: nowrap;
  font-size: 5vw;
  color: black !important;
}
</style>
