<template>
  <div>
    <div ref="content" class="admin-content" @scroll="handelScroll">
      <!-- <div class="admin-header">歌单列表</div> -->
      <van-sticky :offset-top="offsetTop">
        <div class="admin-navBar">
          <div class="title">歌单</div>
          <div class="time" @click="showCalendar = true">
            <div class="time-date">{{ dateString }}</div>
            <div>
              <van-icon size="3.5vh" name="calendar-o" />
            </div>
          </div>
        </div>
      </van-sticky>

      <div v-for="(item, index) in curDayList" :key="item.id">
        <ApplyInfo
          :imgUrl="item.imgUrl"
          :songName="item.songName"
          :singer="item.singer"
          :time="item.time"
          :campus="item.campus"
          iconName="ellipsis"
          @click.native="toExamine(index)"
          @action="
            actionSheet.show = true
            curIndex = index
          "
        />
      </div>
      <div ref="lottie" v-show="curDayList.length === 0"></div>
    </div>

    <div class="goTop" v-show="showGoTop" @click="goTop">
      <van-icon name="back-top" />
    </div>
    <TabBar />
    <van-calendar
      color="#3c9cff"
      :min-date="new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)"
      :max-date="new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)"
      :show-confirm="false"
      v-model="showCalendar"
      @confirm="selDay"
    />
    <van-action-sheet
      v-model="actionSheet.show"
      :actions="actionSheet.actions"
      cancel-text="取消"
      close-on-click-action
      close-on-popstate
      @select="selAction"
    />
  </div>
</template>

<script>
import ApplyInfo from '@/components/ApplyInfo'
import TabBar from '@/components/TabBar'
import formatDate from '@/tools/FormatDate'
import lottie from 'lottie-web'
import empty from '@/assets/empty.json'
import { Dialog, Toast } from 'vant'
import { getList } from '@/api'

export default {
  name: 'adminHome',
  components: {
    ApplyInfo,
    TabBar
  },
  data() {
    return {
      // applyList: [],
      curIndex: Number,
      dateString: '',
      showCalendar: false,
      actionSheet: {
        show: false,
        actions: [{ name: '取消播送这首歌' }]
      },
      scrollTop: 0,
      showGoTop: false,
      offsetTop: '0'
    }
  },
  computed: {
    curDayList() {
      return this.$store.state.applyList.filter(
        (item) =>
          item.time === this.dateString.split(' ')[1] && item.state === 3
      )
    }
  },
  mounted() {
    this.dateString = formatDate(new Date())

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
    localStorage.setItem('homeScrollTop', this.scrollTop)
  },
  destroyed() {
    localStorage.removeItem('homeScrollTop')
    if (!this.lottieInstance) return
    this.lottieInstance.destroy()
    this.lottieInstance = null
  },
  methods: {
    getApplyList() {
      if (this.$store.state.applyList.length === 0) {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        })
        getList('/admin/songList', this.$store.state.applyList, this).then(
          () => {
            Toast.clear()
          }
        )
      } else {
        this.scrollTop = localStorage.getItem('homeScrollTop')
        this.$nextTick(() => {
          this.$refs.content.scrollTop = this.scrollTop || 0
        })
      }
    },
    /* 选择日期后触发 */
    selDay(Date) {
      this.dateString = formatDate(Date)
      this.showCalendar = false
    },
    selAction() {
      Dialog.confirm({
        title: '真的要将其移出歌单吗',
        message: '您可以在 申请列表 - 已处理 - 该日 内找到并将其恢复'
      })
        .then(() => {
          this.delItem()
        })
        .catch(() => {
          // on cancel
        })
    },
    /* 确认删除后触发 */
    delItem() {
      Toast.loading({
        message: '请求中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      this.$axios
        .post('/admin/noPass', {
          id: this.curDayList[this.curIndex].id
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$store.commit('noPassApply', this.curDayList[this.curIndex].id)
            Toast.clear()
            Toast.success('取消成功')
          } else {
            Toast.fail(res.data.msg)
          }
        })
        .catch(() => {
          Toast.fail('请求异常')
        })
    },
    toExamine(index) {
      const { id, imgUrl, songName, singer, time, listenUrl } =
        this.curDayList[index]
      localStorage.setItem(
        'musicInfo',
        JSON.stringify({
          showBtn: false,
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

/* .admin-content {
  box-sizing: border-box;
  width: 100vw;
} */

.admin-navBar {
  .title {
    font-size: 2.1vh;
    margin-left: 6vw;
  }

  .time {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 3vw;
    font-size: 1.8vh;

    &-date {
      color: #555;
      margin-right: 2vw;
    }
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
</style>
