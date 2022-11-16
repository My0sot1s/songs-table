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
      <van-divider :hairline="false" />
      <MusicList title="即将到来" :musicList="laterList" showTime></MusicList>
      <van-divider :hairline="false" />
    </div>
    <div ref="lottie" @click="toSelect()" class="lottie-btn"></div>
  </div>
</template>

<script>
import MusicList from '@/components/MusicList'
import lottie from 'lottie-web'
import music from '@/assets/music.json'
import { getList, getLimitDay } from '@/api'
import { Dialog } from 'vant'

export default {
  data() {
    return {
      todayList: [],
      laterList: [],
      limitReason: ''
    }
  },
  components: {
    MusicList
  },
  async mounted() {
    this.lottieInstance = lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: music
    })
    const res = await getLimitDay()
    this.limitReason = res.data.data?.reason
    if ((this.limitReason ?? '') !== '') {
      /* localStorage.setItem('limitDay', true) */
      Dialog({ message: this.limitReason, confirmButtonColor: '#1989fa' })
    } else {
      localStorage.setItem('limitDay', false)
    }
    getList('/user/todaySongs', this.todayList)
    getList('/user/comingSongs', this.laterList).then(() => {
      this.laterList.sort((a, b) => {
        return a.time.split('-')[2] - b.time.split('-')[2]
      })
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
    }
  },
  beforeRouteLeave: (to, from, next) => {
    /* console.log(localStorage.limitDay) */
    if (localStorage.limitDay === 'false' || to.path === '/myApply') {
      next()
    } else {
      console.log(to)
      Dialog({ message: '今天不能点歌哦' })
      next(false)
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

<style>
.van-divider {
  margin: 0.5vh 0;
}
</style>
