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
      <MusicList
        title="今日歌单"
        :musicList="campus === '厦门校区' ? todayXmList : todayQzList"
      >
        <template #default>
          <div class="title-right">
            <div class="change" @click="changeCampus">
              <van-icon name="exchange" /><van-tag
                color="rgb(128, 165, 221)"
                type="primary"
                >{{ campus }}</van-tag
              >
            </div>
            <router-link to="/myApply">
              <van-icon size="6.2vw" name="user-circle-o" />
            </router-link>
          </div>
        </template>
      </MusicList>
      <MusicList
        title="即将到来"
        :musicList="campus === '厦门校区' ? laterXmList : laterQzList"
        showTime
      ></MusicList>
    </div>
    <div ref="lottieWaves" class="lottie-waves"></div>
    <div class="lottie-btn">
      <div ref="lottieBtn" class="btn" @click="toSelect()">
        <div class="pop">戳我点歌</div>
      </div>
    </div>
  </div>
</template>

<script>
import MusicList from '@/components/MusicList'
import lottie from 'lottie-web'
import music from '@/assets/music.json'
import waves from '@/assets/waves.json'
import { getLimitDay, getNotice } from '@/request/api/user'
import { getList } from '@/request/api/common'
import { Dialog } from 'vant'

export default {
  name: 'Home',
  data() {
    return {
      todayList: [],
      laterList: [],
      limitReason: '',
      campus: ''
    }
  },
  components: {
    MusicList
  },
  computed: {
    todayXmList() {
      return this.todayList
        .filter((item) => item.campus === '厦门校区')
        .sort((a, b) => (a.time > b.time ? 1 : -1))
    },
    laterXmList() {
      return this.laterList
        .filter((item) => item.campus === '厦门校区')
        .sort((a, b) => (a.time > b.time ? 1 : -1))
    },
    todayQzList() {
      return this.todayList
        .filter((item) => item.campus === '泉州校区')
        .sort((a, b) => (a.time > b.time ? 1 : -1))
    },
    laterQzList() {
      return this.laterList
        .filter((item) => item.campus === '泉州校区')
        .sort((a, b) => (a.time > b.time ? 1 : -1))
    }
  },
  async mounted() {
    if (localStorage.getItem('campus')) {
      this.campus = localStorage.getItem('campus')
    } else {
      this.campus = '厦门校区'
      localStorage.setItem('campus', '厦门校区')
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
    this.checkLimit()
    this.getNotice().then(this.checkNotice())
    // 获取歌单列表
    getList('/user/todaySongs', this.todayList)
    getList('/user/comingSongs', this.laterList)
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
    async checkLimit() {
      // 获取限制时间段和原因
      const [err, res] = await getLimitDay(this.campus)
      if (!err) {
        this.limitReason = res?.reason
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
      }
    },
    async getNotice() {
      const [err, res] = await getNotice()
      if (!err) {
        for (const key in res) {
          localStorage.setItem(key, res[key])
        }
      }
    },
    async checkNotice() {
      if (
        localStorage.getItem('campus') === '厦门校区' &&
        localStorage.getItem('XMHomeNotice')
      ) {
        Dialog({
          message: localStorage.getItem('XMHomeNotice'),
          confirmButtonColor: '#1989fa',
          closeOnPopstate: false
        })
      } else if (
        localStorage.getItem('campus') === '泉州校区' &&
        localStorage.getItem('QZHomeNotice')
      ) {
        Dialog({
          message: localStorage.getItem('QZHomeNotice'),
          confirmButtonColor: '#1989fa',
          closeOnPopstate: false
        })
      }
    },
    toSelect() {
      this.$router.push('/selectmusic')
    },
    changeCampus() {
      const home = document.querySelector('#home')
      home.classList.add('home-animated')
      home.addEventListener('animationend', function () {
        home.classList.remove('home-animated')
      })
      if (this.campus === '厦门校区') {
        setTimeout(() => {
          this.campus = '泉州校区'
          localStorage.setItem('campus', '泉州校区')
          this.checkLimit()
        }, 400)
      } else {
        setTimeout(() => {
          this.campus = '厦门校区'
          localStorage.setItem('campus', '厦门校区')
          this.checkLimit()
        }, 400)
      }
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
  transform-style: preserve-3d;
}
.home-animated {
  animation: flip linear 0.8s;
}
.client-header {
  font-size: 5vw;
  padding: 3.56vw 6vw;
  border-bottom: 1px solid #ccc;
}
.title-right {
  width: 40vw;
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;
  font-size: 4vw;
  font-family: '宋体';
  font-weight: normal !important;
  .change {
    margin-right: 4vw;
    display: flex;
    align-items: center;
    background-image: linear-gradient(90deg, rgb(176, 232, 253), #0fbcf9);
    background-clip: text;
    * {
      margin-left: 1vw;
    }
  }
  .van-icon-exchange,
  .van-icon-user-circle-o {
    background-image: linear-gradient(
      315deg,
      rgb(176, 232, 253),
      rgb(128, 165, 221)
    );
    color: transparent;
    background-clip: text;
  }
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
@keyframes flip {
  50% {
    opacity: 0;
    transform: rotateY(180deg);
  }
  51% {
    transform: rotateY(0deg);
  }
  100% {
    opacity: 1;
  }
}
</style>

<style>
.van-divider {
  margin: 0.5vh 0;
}
</style>
