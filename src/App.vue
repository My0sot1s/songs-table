<template>
  <div id="app" :style="`height: ${height}'px'`">
    <NavBar
      fixed
      placeholder
      v-if="this.$store.state.navText"
      :navText="this.$store.state.navText"
      :leftArrow="this.$store.state.leftArrow"
    />
    <transition :name="transitionName">
      <keep-alive include="ApplyList,adminHome">
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
export default {
  components: { NavBar },
  data() {
    return {
      height: document.body.clientHeight,
      transitionName: 'slide-right'
    }
  },
  watch: {
    $route(to, from) {
      const isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
    }
  },
  beforeDestroy() {
    localStorage.removeItem('oldIndex')
  }
}
</script>

<style lang="less">
*::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}

* {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
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

.slide-left-enter,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to,
.slide-right-enter {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: 0.3s;
  position: absolute;
}
</style>
