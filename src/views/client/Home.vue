<template>
  <div class="content">
    <div>
      <MusicList title="今日歌单" :musicList="todayList">
        <template #default>
          <router-link to="/myApply">
            <van-icon size="3.5vh" name="user-circle-o" />
            <!-- <van-icon size="3.5vh" name="apps-o" /> -->
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
      todayList: [
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅'
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          singer: '许嵩'
        },
        {
          imgUrl:
            'http://p1.music.126.net/vSdrZFQn3uMetLL_j3AnQg==/109951163432562414.jpg',
          songName: '贝加尔湖畔',
          singer: '李健'
        }
      ],
      laterList: [
        {
          imgUrl:
            'http://p1.music.126.net/jzNxBp5DCER2_aKGsXeRww==/109951167435823724.jpg',
          songName: '富士山下',
          singer: '陈奕迅'
        },
        {
          imgUrl:
            'http://p1.music.126.net/uP0o1y8zqPT2P7pbYDZuzw==/109951165264460749.jpg',
          songName: '必杀技',
          singer: '古巨基'
        },
        {
          imgUrl:
            'http://p1.music.126.net/bqq6DITA5nj_yd_i6dsiTA==/109951166225429773.jpg',
          songName: '春夏秋冬',
          singer: '张国荣'
        }
      ]
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
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 3vw;
  // overflow: auto;
}

.lottie-btn {
  height: 20vh;
  margin-top: 9vh;
}
</style>
>
