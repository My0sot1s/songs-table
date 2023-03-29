<template>
  <div id="detail">
    <router-link to="/home">
      <div class="back">
        <van-icon name="arrow-left" />
      </div>
    </router-link>
    <div class="main">
      <van-image
        fit="cover"
        width="80vw"
        height="80vw"
        radius="3vw"
        :src="music.cover"
        @click="toListen"
      />
      <div class="song-detail">
        <div class="song-name">{{ music.songName }}</div>
        <div class="singer">{{ music.singer }}</div>
      </div>
      <div class="time-campus">
        <div class="time">{{ music.time }}</div>
        <div class="campus">{{ music.campus }}</div>
      </div>
      <div class="sender-receiver">
        <van-icon name="user-o">{{ music.senderName }}</van-icon>
        <van-icon name="guide-o">{{ music.receiverName }}</van-icon>
      </div>
      <div class="wish">
        <div class="title"><van-icon name="envelop-o" />寄语：</div>
        <div class="text">
          {{ music.blessingWords }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      music: undefined
    }
  },
  methods: {
    toListen() {
      location.href = this.music.listenUrl
    }
  },
  created() {
    this.music = JSON.parse(localStorage.getItem('orderDetail'))
  },
  mounted() {
    document.querySelector(
      '#detail'
    ).style.backgroundImage = `url(${this.music.cover})`
  }
}
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}
.van-icon::before {
  margin-right: 1vw;
}
.back {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 6vw;
  width: 8vw;
  height: 8vw;
  position: absolute;
  top: 2vw;
  left: 2vw;
  color: white;
  z-index: 1002;
  .van-icon::before {
    margin: 0;
  }
}
.main {
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(30vw);
  .van-image {
    border-radius: 3vw;
    box-shadow: 0 3vw 5vw 0 rgba(0, 0, 0, 0.1);
    margin-top: 15vw;
  }
  .song-detail {
    width: 80vw;
    padding: 6vw 2vw 2vw 2vw;
    .song-name {
      font-size: 125%;
      margin-bottom: 2vw;
    }
  }
  .time-campus {
    width: 80vw;
    height: 10vw;
    line-height: 10vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    vertical-align: center;
  }
  .sender-receiver {
    position: relative;
    flex-wrap: wrap;
    width: 80vw;
    line-height: 10vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    vertical-align: center;
    .van-icon {
      margin: 2vw 0;
    }
  }
  .wish {
    width: 80vw;
    .title {
      height: 10vw;
      line-height: 10vw;
    }
    .text {
      white-space: pre-line;
      padding: 0 2vw 10vw 2vw;
      line-height: 7vw;
      border-radius: 2vw;
    }
  }
}
</style>
