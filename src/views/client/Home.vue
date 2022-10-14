<template>
  <div>
    <div class="content">
      <MusicList title="今日歌单" :musicList="todayList">
        <template #default>
          <router-link to="/myApply">
            <van-icon size="3.5vh" name="user-circle-o" />
          </router-link>
        </template>
      </MusicList>
      <hr />
      <MusicList title="即将到来" :musicList="laterList"></MusicList>
      <hr />
    </div>
    <div ref="lottie" @click="toSelect()" class="lottie-btn"></div>
  </div>
</template>

<script>
import MusicList from '@/components/MusicList'
import lottie from 'lottie-web'
import music from '@/assets/music.json'

export default {
  data() {
    return {
      todayList: [],
      laterList: []
    }
  },
  components: {
    MusicList
  },
  mounted() {
    this.lottieInstance = lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: music
    })

    this.$axios.get('/user/todaySongs').then((res) => {
      if (res.data.code === 200 && res.data.data) {
        res.data.data.forEach((item) => {
          if (item.search_path === '网易云') {
            this.$musicApi.NetEaseCloudDetail(item.song_id).then((detail) => {
              if (detail.data.songs.length !== 0) {
                this.todayList.push(this.getTemp(item, detail))
              }
            })
          } else if (item.search_path === 'qq') {
            this.$musicApi.QQMusicDetail(item.song_id).then((detail) => {
              if (detail.data.data.track_info.name) {
                this.todayList.push(this.getTemp(item, detail))
              }
            })
          }
        })
      }
    })

    this.$axios.get('/user/comingSongs').then((res) => {
      if (res.data.code === 200 && res.data.data) {
        res.data.data.forEach((item) => {
          if (item.search_path === '网易云') {
            this.$musicApi.NetEaseCloudDetail(item.song_id).then((detail) => {
              if (detail.data.songs.length !== 0) {
                this.laterList.push(this.getTemp(item, detail))
              }
            })
          } else if (item.search_path === 'qq') {
            this.$musicApi.QQMusicDetail(item.song_id).then((detail) => {
              if (detail.data.data.track_info.name) {
                this.laterList.push(
                  this.getTemp(item, detail.data.data.track_info)
                )
              }
            })
          }
        })
      }
    })
  },
  destroyed() {
    if (!this.lottieInstance) return
    this.lottieInstance.destroy()
    this.lottieInstance = null
  },
  methods: {
    toSelect() {
      this.$router.push('/selectmusic')
    },
    getTemp(item, detail) {
      const temp = {}
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
    }
  }
}
</script>

<style lang="less" scoped>
.client-header {
  font-size: 2.8vh;
  padding: 2vh 6vw;
  border-bottom: 1px solid #ccc;
}

.content {
  padding: 3vw;
  // overflow: auto;
}

.lottie-btn {
  height: 20vh;
}
</style>
>
