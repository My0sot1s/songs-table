<template>
  <div>
    <div ref="content" class="admin-content" @scroll="handelScroll">
      <!-- <div class="admin-header">申请列表</div> -->
      <van-sticky :offset-top="offsetTop">
        <div class="admin-navBar">
          <div>
            <div
              class="nav"
              v-for="(nav, index) in ['待处理', curState]"
              :key="index"
              :class="{ 'active-nav': curNav === index }"
              @click="changeNav(index)"
            >
              {{ nav }}
            </div>

            <van-dropdown-menu v-show="curNav === 1" active-color="#1989fa">
              <van-dropdown-item
                title=" "
                v-model="menu.state"
                :options="menu.states"
              />
            </van-dropdown-menu>
          </div>
          <div class="time" @click="showCalendar = true">
            <div>{{ dateString || '所有时间' }}</div>
            <div>
              <van-icon size="3.5vh" name="calendar-o" />
            </div>
          </div>
        </div>
      </van-sticky>

      <div v-show="curNav === 0">
        <ApplyInfo
          v-for="(item, index) in curDayPendingList"
          :key="item.id"
          :imgUrl="item.imgUrl"
          :songName="item.songName"
          :singer="item.singer"
          :time="item.time"
          :state="item.state + ''"
          @click.native="toExamine(index)"
        />
      </div>
      <div v-show="curNav === 1">
        <ApplyInfo
          v-for="(item, index) in curDayProcessedList"
          :key="index"
          :imgUrl="item.imgUrl"
          :songName="item.songName"
          :singer="item.singer"
          :time="item.time"
          :state="item.state + ''"
          :iconName="item.state === 2 || item.state === 3 ? 'ellipsis' : ''"
          @click.native="toExamine(index)"
          @action="
            actionSheet.show = true
            curIndex = index
          "
        />
      </div>
      <div ref="lottie" v-show="showEmpty"></div>
    </div>

    <div class="goTop" v-show="showGoTop" @click="goTop">
      <van-icon name="back-top" />
    </div>

    <van-calendar
      color="#3c9cff"
      :min-date="new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)"
      :max-date="new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)"
      v-model="showCalendar"
      @select="selDay"
    >
      <template #footer>
        <div class="calendar-footer">
          <van-button
            class="calendar-btn"
            round
            color="#3c9cff"
            @click="
              dateString = ''
              showCalendar = false
            "
            >所有时间</van-button
          >
        </div>
      </template>
    </van-calendar>

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
  </div>
</template>

<script>
import ApplyInfo from '@/components/ApplyInfo'
import formatDate from '@/tools/FormatDate'
import { Dialog, Toast } from 'vant'
import lottie from 'lottie-web'
import empty from '@/assets/empty.json'
import { getList } from '@/api'

export default {
  name: 'ApplyList',
  components: {
    ApplyInfo
  },
  data() {
    return {
      // applyList: [],
      dateString: '',
      /* 当前导航 0：待处理，1：已处理 */
      curNav: 0,
      /* 当前点击的卡片 */
      curIndex: Number,
      showCalendar: false,
      actionSheet: {
        show: false,
        actions: [{ name: '重新审核' }]
      },
      scrollTop: 0,
      showGoTop: false,
      loading: false,
      finished: false,
      menu: {
        state: -2,
        states: [
          { text: '已处理', value: -2 },
          { text: '已撤回', value: -1 },
          { text: '已结束', value: 0 },
          { text: '未通过', value: 2 },
          { text: '待播放', value: 3 }
        ]
      },
      offsetTop: '0'
    }
  },
  computed: {
    curDayPendingList() {
      return this.$store.state.applyList.filter(
        (item) =>
          (!this.dateString || item.time === this.dateString.split(' ')[1]) &&
          item.state === 1
      )
    },
    curDayProcessedList() {
      return this.$store.state.applyList.filter(
        (item) =>
          (!this.dateString || item.time === this.dateString.split(' ')[1]) &&
          ((this.menu.state === -2 && item.state !== 1) ||
            item.state === this.menu.state)
      )
    },
    showEmpty() {
      return (
        (this.curNav === 0 && this.curDayPendingList.length === 0) ||
        (this.curNav === 1 && this.curDayProcessedList.length === 0)
      )
    },
    curState() {
      return this.menu.states.filter((item) => {
        return item.value === this.menu.state
      })[0].text
    }
  },
  mounted() {
    this.lottieInstance = lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: empty
    })
  },
  activated() {
    setTimeout(() => {
      this.offsetTop = '44.9px'
    }, 400)
    this.getApplyList()
  },
  deactivated() {
    this.offsetTop = '0'
    localStorage.setItem('applyListScrollTop', this.scrollTop)
  },
  destroyed() {
    localStorage.removeItem('applyListScrollTop')
    localStorage.removeItem('nav_0_scrollTop')
    localStorage.removeItem('nav_1_scrollTop')
    if (!this.lottieInstance) return
    this.lottieInstance.destroy()
    this.lottieInstance = null
  },
  methods: {
    getApplyList() {
      // 根据是否是第一次进入页面采取不同方法获取数据
      if (this.$store.state.applyList.length === 0) {
        // Toast.loading({
        //   message: '加载中...',
        //   forbidClick: true,
        //   loadingType: 'spinner',
        //   duration: 0
        // })
        this.$store.commit('setShowLoading', true)
        getList('/admin/songList', this.$store.state.applyList, this).then(
          (res) => {
            // Toast.clear()
            this.$store.commit('setShowLoading', false)
            Toast.success('加载完成')
          }
        )
      } else {
        this.scrollTop = localStorage.getItem('applyListScrollTop')
        this.$nextTick(() => {
          this.$refs.content.scrollTop = this.scrollTop || 0
        })
      }
    },
    // 切换导航时对scroll进行缓存和赋值
    changeNav(index) {
      this.curNav = index
      const otherIndex = index === 0 ? 1 : 0
      localStorage.setItem(`nav_${otherIndex}_scrollTop`, this.scrollTop)
      this.$nextTick(() => {
        this.$refs.content.scrollTop =
          localStorage.getItem(`nav_${index}_scrollTop`) || 0
      })
    },
    selDay(date) {
      this.dateString = formatDate(date)
      this.showCalendar = false
    },
    selAction() {
      Dialog.confirm({
        title: '要重新审核该歌曲吗？'
      })
        .then(() => {
          this.retried()
        })
        .catch(() => {
          // on cancel
        })
    },
    toExamine(index) {
      const { id, imgUrl, songName, singer, time, listenUrl } =
        this.curNav === 0
          ? this.curDayPendingList[index]
          : this.curDayProcessedList[index]
      const showBtn = this.curNav === 0
      localStorage.setItem(
        'musicInfo',
        JSON.stringify({
          showBtn,
          id,
          imgUrl,
          songName,
          singer,
          time,
          listenUrl
        })
      )
      this.$router.push('/admin/examine')
    },
    // 重新审核歌曲
    retried() {
      Toast.loading({
        message: '请求中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      const state = this.curDayProcessedList[this.curIndex].state
      let M = ''
      if (state === 2) M = 'pass'
      else if (state === 3) M = 'noPass'
      this.$axios
        .post(`/admin/${M}`, {
          id: this.curDayProcessedList[this.curIndex].id
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$store.commit(
              `${M}Apply`,
              this.curDayProcessedList[this.curIndex].id
            )
            Toast.clear()
            Toast.success('更改成功')
          } else {
            Toast.fail(res.data.msg)
          }
        })
        .catch(() => {
          Toast.fail('请求异常')
        })
    },
    // 监听scroll事件，获取scrollTop
    handelScroll(e) {
      this.scrollTop = e.path[0].scrollTop
      this.showGoTop = this.scrollTop > 200
    },
    goTop() {
      this.scrollTop = 0
      this.$refs.content.scrollTop = 0
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

.admin-navBar {
  height: 3.4vh;

  .nav {
    margin-left: 6vw;
    font-size: 2.1vh;
    color: #ccc;
  }

  .active-nav {
    color: #333;
  }

  .time div {
    margin-right: 3vw;
    font-size: 1.8vh;
    color: #333;
  }
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

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<style>
.van-dropdown-menu__bar {
  background-color: transparent;
  box-shadow: none;
  transform: translateX(-10px);
}
</style>
