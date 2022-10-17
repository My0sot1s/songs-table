<template>
  <div id="cell">
    <div id="background"></div>
    <van-image
      round
      error-icon="https://y.qq.com/music/photo_new/T002R300x300M0000030lak94GN5Ad_0.jpg"
      width="11vw"
      height="11vw"
      :src="music.cover"
    />
    <div id="detail">
      <van-notice-bar color="black" :text="music.name" />
      <van-notice-bar id="singer" :text="singer" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['music'],
  computed: {
    singer() {
      if (this.music.albumname) {
        return this.music.singer[0].name + ' - ' + this.music.albumname
      } else {
        return this.music.singer[0].name
      }
    }
  },
  mounted() {}
}
</script>

<style lang="less">
#cell {
  position: relative;
  height: 18vw;
  margin: 3vw 0;
  padding: 0 4vw;
  border-radius: 2vw;
  box-shadow: 0 0 5px #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .van-image {
    border-radius: 1vw;
    box-shadow: 0 0 4px #999;
  }
  #background {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    z-index: 0;
    transition: width 300ms, background-color 300ms;
  }
  #detail {
    width: 58vw;
    height: 11vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .van-notice-bar {
      background-color: inherit;
    }
    #singer {
      color: rgb(128, 128, 128);
    }
  }
}
</style>
