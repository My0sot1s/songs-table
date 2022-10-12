<template>
  <div>
    <div class="admin-content">
      <!-- <div class="admin-header">申请列表</div> -->
      <van-sticky offset-top="6vh">
        <div class="admin-navBar">
          <div>
            <div
              class="nav"
              v-for="(nav, index) in ['待处理', '已处理']"
              :key="index"
              :class="{ 'active-nav': curNav === index }"
              @click="curNav = index"
            >
              {{ nav }}
            </div>
          </div>
          <div class="time" @click="showCalendar = true">
            <div>{{ dateString || '所有时间' }}</div>
            <div><van-icon size="3.5vh" name="calendar-o" /></div>
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
          :state="item.state"
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
          :state="item.state"
          iconName="ellipsis"
          @click.native="toExamine(index)"
          @action="
            actionSheet.show = true
            curIndex = index
          "
        />
      </div>
      <div ref="lottie" v-show="showEmpty"></div>
    </div>

    <TabBar />
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
            >全部日期</van-button
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
  </div>
</template>

<script>
import ApplyInfo from '@/components/ApplyInfo'
import TabBar from '@/components/TabBar'
import formatDate from '@/tools/FormatDate'
import { Dialog, Toast } from 'vant'
import lottie from 'lottie-web'
import empty from '@/assets/empty.json'

export default {
  name: 'ApplyList',
  components: {
    TabBar,
    ApplyInfo
  },
  data() {
    return {
      applyList: [],
      dateString: '',
      /* 当前导航 0：待处理，1：已处理 */
      curNav: 0,
      /* 当前点击的卡片 */
      curIndex: Number,
      showCalendar: false,
      actionSheet: {
        show: false,
        actions: [{ name: '重新审核' }]
      }
    }
  },
  computed: {
    curDayPendingList() {
      return this.applyList.filter(
        (item) =>
          (!this.dateString || item.time === this.dateString.split(' ')[1]) &&
          item.state === 1
      )
    },
    curDayProcessedList() {
      return this.applyList.filter(
        (item) =>
          (!this.dateString || item.time === this.dateString.split(' ')[1]) &&
          (item.state === 2 || item.state === 3)
      )
    },
    showEmpty() {
      return (
        (this.curNav === 0 && this.curDayPendingList.length === 0) ||
        (this.curNav === 1 && this.curDayProcessedList.length === 0)
      )
    }
  },
  mounted() {
    lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: empty
    })
  },
  activated() {
    this.applyList = []
    this.getApplyList()
  },
  methods: {
    getApplyList() {
      this.$axios.get('/admin/songList').then((res) => {
        if (res.data.code === 200 && res.data.data) {
          res.data.data.forEach((item) => {
            const temp = {}
            temp.id = item.ID
            temp.state = item.status
            temp.time = formatDate(new Date(item.broadcast_date)).split(' ')[1]
            this.$musicApi.NetEaseCloudDetail(item.song_id).then((detail) => {
              if (!detail.data.songs || detail.data.songs.length === 0) return
              temp.imgUrl = detail.data.songs[0].al.picUrl
              temp.songName = detail.data.songs[0].name
              temp.singer = detail.data.songs[0].ar[0].name
              for (let i = 1; i < detail.data.songs[0].ar.length; i++) {
                temp.singer += ' ' + detail.data.songs[0].ar[i].name
              }
              this.applyList.push(temp)
            })
          })
        }
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
      const showBtn = this.curNav === 0
      this.$router.push({
        name: 'Examine',
        params: {
          showBtn
        }
      })
    },
    retried() {
      Toast.loading({
        message: '请求中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      const state = this.curDayProcessedList[this.curIndex].state
      let url = ''
      if (state === 2) url = '/admin/pass'
      else if (state === 3) url = '/admin/noPass'
      this.$axios
        .post(url, {
          id: this.curDayProcessedList[this.curIndex].id
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.curDayProcessedList[this.curIndex].state = state === 2 ? 3 : 2
            this.$forceUpdate()
            Toast.clear()
          } else {
            Toast.fail(res.data.msg)
          }
        })
        .catch(() => {
          Toast.fail('请求异常')
        })
    }
  }
}
</script>

<style lang='less' scoped>
.admin-content {
  margin-bottom: 20vh;
}

.admin-navBar {
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
</style>
