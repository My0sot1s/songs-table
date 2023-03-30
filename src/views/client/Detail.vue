<template>
  <div id="detail">
    <div class="back" @click="$router.back()">
      <van-icon name="arrow-left" />
    </div>
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
    const backgroundImage = new Image()
    backgroundImage.src = this.music.cover
    backgroundImage.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height

      const context = canvas.getContext('2d')
      context.drawImage(this, 0, 0)

      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data
      const color = getDominantColor(imageData)

      const brightness =
        (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000
      const fontColor = brightness > 125 ? '#444' : 'white'

      document.body.style.color = fontColor
      console.log(document.body.style.color)
    }

    function getDominantColor(imageData) {
      const colorCounts = {}
      let maxCount = 0
      let dominantColor = [0, 0, 0]

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]

        const colorKey = `${r},${g},${b}`
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1

        if (colorCounts[colorKey] > maxCount) {
          maxCount = colorCounts[colorKey]
          dominantColor = [r, g, b]
        }
      }

      return dominantColor
    }
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
  position: fixed;
  top: 2vw;
  left: 2vw;
  z-index: 1002;
  .van-icon::before {
    margin: 0;
  }
}
.main {
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
      background-color: rgba(255, 255, 255, 0.2);
      white-space: pre-line;
      padding: 2vw;
      margin-bottom: 10vw;
      line-height: 7vw;
      border-radius: 2vw;
    }
  }
}
</style>
