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
  methods: {
    toSelect() {
      this.$router.push('/selectmusic')
    }
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
      // 待完善，未对code做判断
      if (res.data.data) {
        res.data.data.forEach((item) => {
          this.$musicApi.NetEaseCloudDetail(item.song_id).then((detail) => {
            if (!detail.data.songs || detail.data.songs.length === 0) return
            const temp = {}
            temp.imgUrl = detail.data.songs[0].al.picUrl
            temp.songName = detail.data.songs[0].name
            temp.singer = detail.data.songs[0].ar[0].name
            for (let i = 1; i < detail.data.songs[0].ar.length; i++) {
              temp.singer += ' ' + detail.data.songs[0].ar[i].name
            }
            this.todayList.push(temp)
          })
        })
      }
    })

    this.$axios.get('/user/comingSongs').then((res) => {
      if (res.data.data) {
        res.data.data.forEach((item) => {
          this.$musicApi.NetEaseCloudDetail(item.song_id).then((detail) => {
            if (!detail.data.songs || detail.data.songs.length === 0) return
            const temp = {}
            temp.imgUrl = detail.data.songs[0].al.picUrl
            temp.songName = detail.data.songs[0].name
            temp.singer = detail.data.songs[0].ar[0].name
            for (let i = 1; i < detail.data.songs[0].ar.length; i++) {
              temp.singer += ' ' + detail.data.songs[0].ar[i].name
            }
            this.laterList.push(temp)
          })
        })
      }
    })
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
