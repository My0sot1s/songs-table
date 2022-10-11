<template>
  <div>
    <div class="admin-content">
      <!-- <div class="admin-header">歌单列表</div> -->
      <van-sticky offset-top="6vh">
        <div class="admin-navBar">
          <div class="title">歌单</div>
          <div class="time" @click="showCalendar = true">
            <div class="time-date">{{ dateString }}</div>
            <div><van-icon size="3.5vh" name="calendar-o" /></div>
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

    <TabBar />
    <van-calendar
      color="#3c9cff"
      :min-date="new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)"
      :max-date="new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)"
      confirm-text="选择"
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

export default {
  components: {
    ApplyInfo,
    TabBar
  },
  data() {
    return {
      applyList: [
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅',
          time: '2022-10-11',
          campus: '厦门校区',
          id: 5
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          singer: '许嵩',
          time: '2022-10-10',
          campus: '厦门校区',
          id: 4
        },
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅',
          time: '2022-10-9',
          campus: '厦门校区',
          id: 3
        }
      ],
      curIndex: Number,
      dateString: '',
      showCalendar: false,
      actionSheet: {
        show: false,
        actions: [{ name: '取消播送这首歌' }]
      }
    }
  },
  computed: {
    curDayList() {
      return this.applyList.filter(
        (item) => item.time === this.dateString.split(' ')[1]
      )
    }
  },
  mounted() {
    this.dateString = formatDate(new Date())

    this.$axios.get('/admin/songList').then((res) => {
      if (res.data.code === 200 && res.data.data) {
        res.data.data.forEach((item) => {
          // if (item.state === 3) {
          const temp = {}
          temp.id = item.ID
          temp.time = formatDate(new Date(item.broadcast_date)).split(' ')[1]
          temp.campus = item.school_district
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
          // }
        })
      }
    })

    // this.$axios.get('/admin/songList').then((res) => {
    //   if (res.data.code === 200 && res.data.data) {
    //     const tempList = []
    //     const promiseList = []
    //     res.data.data.forEach((item) => {
    //       const promise = new Promise((resolve, reject) => {
    //         this.$musicApi.NetEaseCloudDetail(item.song_id).then((detail) => {
    //           if (!detail.data.songs || detail.data.songs.length === 0) return
    //           const temp = {}
    //           temp.id = item.ID
    //           temp.time = formatDate(new Date(item.broadcast_date)).split(
    //             ' '
    //           )[1]
    //           temp.campus = item.school_district
    //           temp.imgUrl = detail.data.songs[0].al.picUrl
    //           temp.songName = detail.data.songs[0].name
    //           temp.singer = detail.data.songs[0].ar[0].name
    //           for (let i = 1; i < detail.data.songs[0].ar.length; i++) {
    //             temp.singer += ' ' + detail.data.songs[0].ar[i].name
    //           }
    //           tempList.push(temp)
    //           resolve()
    //         })
    //       })
    //       promiseList.push(promise)
    //     })
    //     /* 当所有promise都处理完成后再展示,数量多了会有一段时间白屏 */
    //     Promise.allSettled(promiseList).then(() =>
    //       this.applyList.push(...tempList)
    //     )
    //   }
    // })

    lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: empty
    })
  },
  methods: {
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
        loadingType: 'spinner'
      })
      this.$axios
        .post('/admin/noPass', {
          id: this.curDayList[this.curIndex].id
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.curDayList.splice(this.curIndex, 1)
            this.$forceUpdate()
            Toast.clear()
          } else {
            Toast.fail(res.data.msg)
          }
        })
        .catch(() => {
          Toast.fail('请求异常')
        })
    },
    toExamine() {
      this.$router.push('/admin/examine')
    }
  }
}
</script>

<style lang='less' scoped>
.admin-content {
  margin-bottom: 20vh;
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
</style>
