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
      if (this.$store.state.leftArrow) {
        if (
          this.$route.name === 'MyApply' ||
          this.$route.name === 'SelectMusic'
        ) {
          // 重新登陆后back会回到带有code的地址
          this.$router.isBack = true
          this.$router.replace('/home')
        } else {
          this.$router.back()
        }
      }
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
