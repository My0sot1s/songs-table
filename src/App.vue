<template>
  <div id="app" :style="`height: ${height}'px'`">
    <transition :name="transitionName">
      <keep-alive include="ApplyList,adminHome">
        <router-view class="view" />
      </keep-alive>
    </transition>
    <TabBar
      v-if="$route.path.includes('admin') && !$route.path.includes('login')"
    />
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
export default {
  components: { TabBar },
  data() {
    return {
      height: document.body.clientHeight,
      transitionName: 'van-fade',
      timer: null
    }
  },
  watch: {
    $route(to, from) {
      const isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        console.log(this.$route)
        if (this.$route.path === '/home') {
          this.transitionName = 'van-fade'
        } else {
          this.transitionName = 'slide-left'
        }
      }
      this.$router.isBack = false
    }
  },
  beforeDestroy() {
    localStorage.removeItem('oldIndex')
  },
  mounted() {
    if (
      window.innerWidth > window.innerHeight &&
      this.$route.path !== '/error'
    ) {
      this.$router.push('/error')
    }
    window.addEventListener('resize', () => {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          if (
            window.innerWidth > window.innerHeight &&
            this.$route.path !== '/error'
          ) {
            this.$router.push('/error')
          } else if (
            window.innerWidth <= window.innerHeight &&
            this.$route.path === '/error'
          ) {
            this.$router.back()
          }
          this.timer = null
        }, 500)
      }
    })
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

.view {
  box-sizing: border-box;
  width: 100vw; // transition翻页时保持宽度，让按钮不乱跳
  height: 100%; // transition翻页时保持高度，让按钮不乱跳
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

.van-dropdown-menu__bar {
  background-color: transparent !important;
  box-shadow: none !important
  ;
}

.slide-left-enter,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
  position: absolute;
}

.slide-left-leave-to,
.slide-right-enter {
  opacity: 0;
  transform: translateX(-100%);
  position: absolute;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: 0.3s;
  position: absolute;
}
</style>
