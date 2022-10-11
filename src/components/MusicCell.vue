<template>
  <div id="cell">
    <div id="background"></div>
    <van-image
      round
      error-icon="https://y.qq.com/music/photo_new/T002R300x300M0000030lak94GN5Ad_0.jpg"
      width="9vw"
      height="9vw"
      :src="music.cover"
    />
    <div id="detail">
      <van-notice-bar color="black" :text="music.name" />
      <van-notice-bar id="singer">{{ singer }}</van-notice-bar>
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

<style lang="less" scoped>
#cell {
  position: relative;
  height: 16vw;
  margin: 3vw 0;
  padding: 0 4vw;
  border-radius: 1vw;
  box-shadow: 0 0 5px #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .van-image {
    border-radius: 1vw;
    background-color: skyblue;
  }
  #background {
    background-color: rgb(240, 242, 243);
    border-radius: 1vw;
    position: absolute;
    left: -105%;
    width: 100%;
    height: 100%;
    z-index: 0;
    transition: transform 0.3s;
  }
  #detail {
    width: 60vw;
    height: 9vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .van-notice-bar {
      background-color: inherit;
      padding: 0;
    }
    #singer {
      color: #999;
      font-size: 3vw;
    }
  }
}
</style>
