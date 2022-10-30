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
  z-index: 999 !important;
}

.van-nav-bar__left > * {
  white-space: nowrap;
  font-size: 5vw;
  color: black !important;
}
</style>
