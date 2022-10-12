<template>
  <div id="app">
    <NavBar
      fixed
      placeholder
      v-if="this.$store.state.navText"
      :navText="this.$store.state.navText"
      :leftArrow="this.$store.state.leftArrow"
    />
    <keep-alive include="ApplyList,adminHome">
      <router-view />
    </keep-alive>
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

.admin-navBar {
  display: flex;
  justify-content: space-between;
  background-color: #fafbfd;
  padding: 1vh 0;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;

  & > div {
    display: flex;
    align-items: center;
  }
}

/* 顶部导航栏样式 */
.van-nav-bar__content {
  height: 6vh !important;
}

.van-nav-bar__text {
  font-size: 2.8vh;
}

.van-nav-bar__arrow {
  font-size: 2.6vh !important;
}
</style>
