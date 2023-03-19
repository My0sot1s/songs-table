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
      <MusicList title="即将到来" :musicList="laterList" showTime></MusicList>
    </div>
    <div ref="lottieWaves" class="lottie-waves"></div>
    <div class="lottie-btn">
      <div ref="lottieBtn" class="btn" @click="toSelect()">
        <div class="pop">戳我点歌</div>
      </div>
    </div>
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
import waves from '@/assets/waves.json'
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
    this.lottieBtn = lottie.loadAnimation({
      container: this.$refs.lottieBtn,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: music
    })
    this.lottieWaves = lottie.loadAnimation({
      container: this.$refs.lottieWaves,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: waves
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
    if (this.lottieBtn) {
      this.lottieBtn.destroy()
      this.lottieBtn = null
    }

    if (this.lottieWaves) {
      this.lottieWaves.destroy()
      this.lottieWaves = null
    }
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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}
.client-header {
  font-size: 2.8vh;
  padding: 2vh 6vw;
  border-bottom: 1px solid #ccc;
}
.van-icon-user-circle-o {
  background-image: linear-gradient(
    315deg,
    rgb(176, 232, 253),
    rgb(128, 165, 221)
  );
  color: transparent;
  background-clip: text;
}
.content {
  padding: 3vw;
  height: 100vw;
  // overflow: auto;
}
.lottie-btn {
  height: 40vw;
  flex-grow: 1;
  position: relative;
  .btn {
    height: 70vw;
    width: 100vw;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .pop {
    width: 20vw;
    height: 10vw;
    font-size: 3vw;
    position: absolute;
    top: 15%;
    left: 65%;
    background-color: rgb(74, 74, 74);
    color: white;
    border-radius: 2vw;
    text-align: center;
    line-height: 10vw;
    transform-origin: 0% 100%;
    opacity: 0;
    animation: pop 5s ease-in-out 1s;
    animation-fill-mode: forwards;
  }
  .pop::before {
    content: '';
    display: block;
    position: absolute;
    top: 10vw;
    border: 1vw solid transparent;
    border-top-color: rgb(74, 74, 74);
    transform-origin: 50% 0%;
    transform: translate(-50%, 0) rotate(45deg);
  }
}
@keyframes pop {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  3% {
    opacity: 0.9;
    transform: scale(1);
  }
  97% {
    opacity: 0.9;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}
</style>

<style>
.van-divider {
  margin: 0.5vh 0;
}
</style>
