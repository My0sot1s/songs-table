<template>
  <div>
    <div ref="content" class="admin-content" @scroll="handelScroll">
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

    <div class="goTop" v-show="showGoTop" @click="goTop">
      <van-icon name="back-top" />
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
  name: 'adminHome',
  components: {
    ApplyInfo,
    TabBar
  },
  data() {
    return {
      applyList: [],
      curIndex: Number,
      dateString: '',
      showCalendar: false,
      actionSheet: {
        show: false,
        actions: [{ name: '取消播送这首歌' }]
      },
      scrollTop: 0,
      showGoTop: false
    }
  },
  computed: {
    curDayList() {
      return this.applyList.filter((item) => item.time)
    }
  },
  mounted() {
    this.dateString = formatDate(new Date())

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
    //     /* 过程异步,导致顺序不固定，要配合缓存得先排序 */
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
  activated() {
    this.getApplyList()
  },
  deactivated() {
    localStorage.setItem('homeScrollTop', this.scrollTop)
  },
  destroyed() {
    localStorage.removeItem('homeScrollTop')
  },
  methods: {
    getApplyList() {
      if (this.applyList.length === 0) {
        this.$axios.get('/admin/songList').then((res) => {
          if (res.data.code === 200 && res.data.data) {
            res.data.data.forEach((item) => {
              if (item.status === 3) {
                if (item.search_path === '网易云') {
                  this.$musicApi
                    .NetEaseCloudDetail(item.song_id)
                    .then((detail) => {
                      if (detail.data.songs.length !== 0) {
                        this.applyList.push(this.getTemp(item, detail))
                      }
                    })
                } else if (item.search_path === 'qq') {
                  this.$musicApi.QQMusicDetail(item.song_id).then((detail) => {
                    if (detail.data.data.track_info.name) {
                      this.applyList.push(
                        this.getTemp(item, detail.data.data.track_info)
                      )
                    }
                  })
                }
              }
            })
          }
        })
      } else {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner'
        })
        this.$axios.get('/admin/songList').then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let promise = Promise.resolve()
            const tempList = []
            res.data.data.forEach((item) => {
              if (item.status === 3) {
                promise = promise.then(() => {
                  return new Promise((resolve, reject) => {
                    if (item.search_path === '网易云') {
                      this.$musicApi
                        .NetEaseCloudDetail(item.song_id)
                        .then((detail) => {
                          if (detail.data.songs.length === 0) {
                            reject(new Error('empty songs'))
                          }
                          tempList.push(this.getTemp(item, detail))
                          resolve()
                        })
                    } else if (item.search_path === 'qq') {
                      this.$musicApi
                        .QQMusicDetail(item.song_id)
                        .then((detail) => {
                          if (!detail.data.data.track_info.name) {
                            reject(new Error('empty songs'))
                          }
                          tempList.push(
                            this.getTemp(item, detail.data.data.track_info)
                          )
                          resolve()
                        })
                    } else {
                      resolve()
                    }
                  })
                })
              }
            })
            promise.then(() => {
              for (let i = 0; i < tempList.length; i++) {
                if (
                  JSON.stringify(this.applyList[i]) !==
                  JSON.stringify(tempList[i])
                ) {
                  this.applyList.splice(i, 1, tempList[i])
                }
              }
              if (tempList.length < this.applyList.length) {
                this.applyList.splice(tempList.length)
              }
              this.scrollTop = localStorage.getItem('homeScrollTop')
              this.$nextTick(() => {
                this.$refs.content.scrollTop = this.scrollTop || 0
              })
              Toast.clear()
              // console.log(this.scrollTop, this.$refs.content.scrollTop)
            })
          }
        })
      }
    },
    getTemp(item, detail) {
      const temp = {}
      temp.id = item.ID
      temp.time = formatDate(new Date(item.broadcast_date)).split(' ')[1]
      temp.campus = item.school_district
      if (item.search_path === '网易云') {
        temp.imgUrl = detail.data.songs[0].al.picUrl
        temp.songName = detail.data.songs[0].name
        temp.singer = detail.data.songs[0].ar[0].name
        for (let i = 1; i < detail.data.songs[0].ar.length; i++) {
          temp.singer += ' ' + detail.data.songs[0].ar[i].name
        }
      } else if (item.search_path === 'qq') {
        temp.imgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${detail.album.mid}.jpg`
        temp.songName = detail.name
        temp.singer = detail.singer[0].name
        for (let i = 1; i < detail.singer.length; i++) {
          temp.singer += ' ' + detail.singer[i].name
        }
      }

      return temp
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
      const { id, imgUrl, songName, singer, time } = this.applyList[index]
      localStorage.setItem(
        'musicInfo',
        JSON.stringify({
          showBtn: false,
          id,
          imgUrl,
          songName,
          singer,
          time
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

<style lang='less' scoped>
.admin-content {
  margin-bottom: 5vh;
  overflow: scroll;
  height: 85vh;
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
}
</style>
