<template>
  <div id="home">
    <van-notice-bar
      v-if="this.limitReason"
      color="#1989fa"
      background="#ecf9ff"
      left-icon="volume-o"
      :style="`margin: 2vw 0`"
      mode="closeable"
      :text="this.limitReason"
    >
    </van-notice-bar>
    <div class="content">
      <MusicList title="今日歌单" :musicList="todayList">
        <template #default>
          <router-link to="/myApply">
            <van-icon size="3.5vh" name="user-circle-o" />
          </router-link>
        </template>
      </MusicList>
      <!-- <div class="line1"></div> -->
      <MusicList title="即将到来" :musicList="laterList" showTime></MusicList>
      <van-divider :hairline="false" />
    </div>
    <!-- <div class="line2"></div>
    <div class="line3"></div> -->
    <div ref="lottie" @click="toSelect()" class="lottie-btn"></div>
    <van-dialog
      v-model="tourist"
      title="提示"
      confirm-button-text="知道了"
      confirm-button-color="#3c9cff"
      cancel-button-text="去登录"
      message="当前为游客身份，点歌请通过校内认证登录"
      show-cancel-button
      @cancel="toLogin"
    >
    </van-dialog>
  </div>
</template>

<script>
import MusicList from '@/components/MusicList'
import lottie from 'lottie-web'
import music from '@/assets/music.json'
import { getLimitDay } from '@/request/api/user'
import { getList } from '@/request/api/common'
import { Dialog } from 'vant'

export default {
  data() {
    return {
      todayList: [],
      laterList: [],
      limitReason: '',
      tourist: false
    }
  },
  components: {
    MusicList
  },
  async mounted() {
    // 游客首次进入弹窗
    if (sessionStorage.getItem('tourist') && !sessionStorage.getItem('poped')) {
      this.tourist = true
      sessionStorage.setItem('poped', 1)
    }
    // lottie动画
    this.lottieInstance = lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: music
    })
    // 获取限制时间段和原因
    const res = await getLimitDay()
    this.limitReason = res?.reason
    // 获取歌单列表
    getList('/user/todaySongs', this.todayList)
    getList('/user/comingSongs', this.laterList).then(() => {
      this.laterList
        .sort((a, b) => {
          return a.time.split('-')[2] - b.time.split('-')[2]
        })
        .sort((a, b) => {
          return a.time.split('-')[1] - b.time.split('-')[1]
        })
      // 如果十分钟内提示过了且限制原因没有改变则不再提示
      if (
        (this.limitReason ?? '') !== '' &&
        (new Date().getTime() - (localStorage.homeToastTime || 0) >
          1000 * 10 * 60 ||
          localStorage.limitReason !== this.limitReason)
      ) {
        Dialog({
          message: this.limitReason,
          confirmButtonColor: '#1989fa'
        }).then(() => {
          localStorage.setItem('homeToastTime', new Date().getTime())
          localStorage.setItem('limitReason', this.limitReason)
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
    toLogin() {
      window.location.href = `https://apps.hqu.edu.cn/wechat-hqu/wechatauth.html?proxyTo=authoauth&sendUrl=/connect/oauth2/authorize?appid=wxfe035b066fb1158b&redirect_uri=${encodeURIComponent(
        `${location.origin}`
      )}&encode_flag=Y&response_type=code&scope=snsapi_userinfo#wechat_redirect`
      sessionStorage.removeItem('tourist')
    }
  }
}
</script>

<style lang="less" scoped>
#home {
  background-color: rgb(250, 250, 250);
}
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
  height: 70vw;
  transform: translateY(-10vw);
}
.van-icon-user-circle-o {
  color: rgb(71, 113, 178);
}

.line1 {
  position: absolute;
  right: 0;
  background-image: linear-gradient(90deg, #0fbcf9, pink);
  width: 45vw;
  height: 0.8vw;
}
.line2 {
  background-image: linear-gradient(90deg, #0fbcf9, pink);
  width: 35vw;
  height: 0.8vw;
  position: relative;
  left: 65vw;
}
.line3 {
  background-image: linear-gradient(90deg, #0fbcf9, pink);
  width: 25vw;
  height: 0.8vw;
  position: relative;
  top: 6vw;
  left: 75vw;
}

.line1::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 50%;
  transform: rotate(45deg);
  right: 0;
  top: -0.5vw;
  width: 3vw;
  height: 3vw;
  background-color: #0fbcf9;
}
.line2::before {
  content: '';
  display: block;
  position: absolute;
  border-radius: 50%;
  transform: translate(0, -25%);
  left: 0;
  width: 3vw;
  height: 3vw;
  background-color: #0fbcf9;
}
</style>

<style>
.van-divider {
  margin: 0.5vh 0;
}
</style>
