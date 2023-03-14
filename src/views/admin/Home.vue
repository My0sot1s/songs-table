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
          :cover="item.cover"
          :songName="item.songName"
          :singer="item.singer"
          :time="item.time"
          :campus="item.state === 3 ? item.campus : '已结束'"
          :iconName="item.state === 3 ? 'ellipsis' : ''"
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
      @submit="delItem"
      @cancle="showDialog = false"
    />
  </div>
</template>

<script>
import ApplyInfo from '@/components/ApplyInfo'
import FieldDialog from '@/components/FieldDialog.vue'
import formatDate from '@/tools/FormatDate'
import lottie from 'lottie-web'
import empty from '@/assets/empty.json'
import { Toast } from 'vant'
import { getList } from '@/request/api/common1'
import { passOrNot } from '@/request/api/admin1'

export default {
  name: 'adminHome',
  components: {
    ApplyInfo,
    FieldDialog
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
      offsetTop: '0',
      showDialog: false
    }
  },
  computed: {
    curDayList() {
      return this.$store.state.applyList.filter(
        (item) =>
          item.time === this.dateString.split(' ')[1] &&
          (item.state === 3 || item.state === 0)
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
        this.$store.commit('setShowLoading', true)
        getList('/admin/songList', this.$store.state.applyList, this).then(
          () => {
            this.$store.commit('setShowLoading', false)
            Toast.success('加载完成')
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
      this.showDialog = true
    },
    /* 确认删除后触发 */
    async delItem(reason) {
      Toast.loading({
        message: '请求中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      const [err] = await passOrNot('/admin/noPass', {
        id: this.curDayList[this.curIndex].id,
        noPassReason: reason
      })
      if (!err) {
        this.$store.commit('noPassApply', this.curDayList[this.curIndex].id)
        Toast.clear()
        Toast.success('驳回成功')
        this.showDialog = false
      } else {
        Toast.fail(err)
      }
    },
    toExamine(index) {
      const { id, cover, songName, singer, time, listenUrl } =
        this.curDayList[index]
      localStorage.setItem(
        'musicInfo',
        JSON.stringify({
          showBtn: false,
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

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
