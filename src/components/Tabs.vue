<template>
  <div>
    <div ref="content" class="admin-content" @scroll="handelScroll">
      <van-tabs
        v-model="curNav"
        animated
        swipeable
        shrink
        sticky
        color="#1989fa"
        @change="changeNav"
      >
        <van-tab v-for="(nav, index) in navList" :key="index">
          <template #title>
            <div class="tabs-title">
              <span>{{ nav }}</span>
              <van-dropdown-menu
                v-if="menu && index === 1"
                active-color="#1989fa"
              >
                <van-dropdown-item
                  title=" "
                  v-model="menuState"
                  :options="menu.states"
                  @change="selMenu"
                />
              </van-dropdown-menu>
            </div>
          </template>
          <ApplyInfo
            v-for="(item, index2) in applyList[index]"
            :key="item.id"
            :cover="item.cover"
            :songName="item.songName"
            :singer="item.singer"
            :time="item.time"
            :state="state(item)"
            :campus="campus(item)"
            :iconName="iconName(item)"
            @click.native="cardClick(index2)"
            @action="actionClick(index2)"
          />
        </van-tab>
        <template #nav-right>
          <div class="time" @click="showCalendar = true">
            <span class="time-date">{{ dateString || '所有时间' }}</span>
            <van-icon name="notes-o" size="175%" />
          </div>
        </template>
      </van-tabs>
      <div ref="lottie" v-show="showEmpty"></div>
    </div>

    <van-calendar
      color="#3c9cff"
      :min-date="new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)"
      :max-date="new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)"
      :show-confirm="false"
      v-model="showCalendar"
      @select="selDay"
    >
      <template v-if="showFooter" #footer>
        <div class="calendar-footer">
          <van-button
            class="calendar-btn"
            round
            color="#3c9cff"
            @click="allDate"
          >
            所有时间
          </van-button>
        </div>
      </template>
    </van-calendar>

    <div class="goTop" v-show="showGoTop" @click="goTop">
      <van-icon name="back-top" />
    </div>

    <van-action-sheet
      v-model="actionSheet.show"
      :actions="actionSheet.actions"
      cancel-text="取消"
      close-on-click-action
      close-on-popstate
      @select="selAction"
    />

    <van-loading
      class="loading"
      size="40px"
      color="#0094ff"
      vertical
      v-if="$store.state.showLoading"
      >加载中...</van-loading
    >

    <FieldDialog
      :show="showDialog"
      title="驳回原因"
      @submit="submitDialog"
      @cancle="cancelDialog"
    />
  </div>
</template>

<script>
import { debounce } from '@/tools/debounce'
import lottie from 'lottie-web'
import empty from '@/assets/empty.json'
import ApplyInfo from '@/components/ApplyInfo.vue'
import FieldDialog from '@/components/FieldDialog.vue'

export default {
  name: 'Tabs',
  components: {
    ApplyInfo,
    FieldDialog
  },
  props: {
    navList: Array, // 导航栏 tabs
    applyList: Array, // 内容列表
    dateString: String, // 右上角日历的日期
    menu: Object, // tab 的附加筛选菜单
    showFooter: Boolean, // 日历是否显示底部按钮
    showCampus: Boolean, // 是否显示校区
    showEmpty: Boolean, // 是否显示空状态缺省图
    showDialog: Boolean, // 是否显示弹窗(填写拒绝原因)
    actions: Array // 底部 actionSheet 选项内容
  },
  data() {
    return {
      routeName: '',
      curNav: 0, // 当前导航下标
      curIndex: Number, // 当前点击的内容
      menuState: this.menu ? this.menu.state : '',
      showCalendar: false, // 是否显示日历
      showGoTop: false, // 是否显示返回顶部
      scrollTop: 0, // 滚动距离
      actionSheet: {
        show: false,
        actions: this.actions
      }
    }
  },
  mounted() {
    // 创建 lottie 动画
    this.lottieInstance = lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: empty
    })
  },
  activated() {
    this.routeName = this.$route.name
    const distance =
      sessionStorage.getItem(`${this.routeName}-scrollTop`) || 0
    this.$refs.content.scrollTop = parseInt(distance)
  },
  deactivated() {
    sessionStorage.setItem(`${this.routeName}-scrollTop`, this.scrollTop)
  },
  destroyed() {
    // 销毁 lottie 动画
    if (!this.lottieInstance) return
    this.lottieInstance.destroy()
    this.lottieInstance = null
  },
  methods: {
    // 处理 state
    state(item) {
      if (this.showCampus) return undefined
      else return item.state + ''
    },
    // 处理campus
    campus(item) {
      if (this.showCampus) return item.state === 3 ? item.campus : '已结束'
      else return undefined
    },
    // 处理 iconName
    iconName(item) {
      if (this.showCampus) return item.state === 3 ? 'ellipsis' : ''
      else return item.state === 2 || item.state === 3 ? 'ellipsis' : ''
    },
    // 改变导航
    changeNav() {
      this.$emit('changeNav', this.curNav)
      sessionStorage.setItem(
        `${this.$route.name}-nav${this.curNav}`,
        this.scrollTop
      )
      let distance = 0
      if (this.curNav === 0) {
        distance = sessionStorage.getItem(`${this.$route.name}-nav1`)
      } else if (this.curNav === 1) {
        distance = sessionStorage.getItem(`${this.$route.name}-nav0`)
      }
      this.$refs.content.scrollTop = parseInt(distance)
    },
    // 选择 menu 筛选状态
    selMenu() {
      this.$emit('changeMenu', this.menuState)
      this.goTop()
    },
    // 选择日期
    selDay(date) {
      this.$emit('selDay', date)
      this.showCalendar = false
    },
    // 点击全部日期
    allDate() {
      this.$emit('allDate')
      this.showCalendar = false
    },
    // 点击 ApplyInfo 组件
    cardClick(index) {
      const { id, cover, songName, singer, time, listenUrl } =
        this.applyList[this.curNav][index]
      const showBtn = this.curNav === 0
      localStorage.setItem(
        'musicInfo',
        JSON.stringify({
          showBtn,
          id,
          cover,
          songName,
          singer,
          time,
          listenUrl
        })
      )
      this.$router.push('/admin/examine')
    },
    // 点击 ellipsis, 弹出底部 actionSheet
    actionClick(index) {
      this.actionSheet.show = true
      this.curIndex = index
    },
    // 选择 actionSheet 中的某一项
    selAction() {
      this.$emit('selAction', this.curIndex)
    },
    // 取消弹窗
    cancelDialog() {
      this.$emit('cancelDialog')
    },
    // 提交弹窗内容
    submitDialog(value) {
      this.$emit('submitDialog', { reason: value, curIndex: this.curIndex })
    },
    // 监听scroll事件，获取scrollTop
    handelScroll: debounce(function (e) {
      this.scrollTop = e.target.scrollTop
      this.showGoTop = this.scrollTop > 200
    }, 200),
    // 返回顶部
    goTop() {
      if (this.scrollTop !== 0) {
        this.scrollTop = 0
        this.$refs.content.scrollTop = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.admin-content {
  overflow: scroll;
  height: calc(100vh - 94.9px);

  @supports (bottom: env(safe-area-inset-bottom)) {
    & {
      height: calc(100vh - 94.9px - constant(safe-area-inset-bottom));
      height: calc(100vh - 94.9px - env(safe-area-inset-bottom));
    }
  }
}

.tabs-title {
  display: flex;
  align-items: center;
}

.calendar-footer {
  margin-bottom: 1vh;
  display: flex;
  justify-content: center;

  .calendar-btn {
    width: 90vw;
    height: 4.4vh;
  }
}

.goTop {
  width: 5vh;
  height: 5vh;
  background-color: #fff;
  box-shadow: 0 0 5px #999;
  position: fixed;
  bottom: 12vh;
  right: 3vw;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3vh;

  @supports (bottom: env(safe-area-inset-bottom)) {
    & {
      bottom: calc(12vh + env(safe-area-inset-bottom));
    }
  }
}

.time {
  display: flex;
  margin-left: 15vw;
  flex: 1;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  margin-right: 3vw;
  font-size: 1.8vh;

  &-date {
    color: #555;
    margin-right: 2vw;
  }
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

::v-deep .van-dropdown-menu__bar {
  transform: translateX(-5px);
  height: calc(5.4vh + 2px);
}

::v-deep .van-dropdown-menu__title::after {
  border-color: transparent transparent #333 #333;
}
</style>
