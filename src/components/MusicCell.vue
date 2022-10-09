<template>
  <div id="cell">
    <van-image
      error-icon="https://y.qq.com/music/photo_new/T002R300x300M0000030lak94GN5Ad_0.jpg"
      width="9vw"
      height="9vw"
      :src="`https://y.qq.com/music/photo_new/T002R300x300M000${music.albummid}_1.jpg?max_age=2592000`"
    />
    <div id="detail">
      <van-notice-bar color="black" :text="music.name" />
      <van-notice-bar id="singer">{{ music.singer[0].name + ' - ' + music.albumname}}</van-notice-bar>
    </div>
  </div>
</template>

<script>
export default {
  props: ['music'],
  mounted() {}
}
</script>

<style lang="less" scoped>
#cell {
  height: 16vw;
  margin: 3vw 0;
  padding: 0 4vw;
  border-radius: 1vw;
  box-shadow: 0 0 5px #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .van-image {
    border-radius: 1vw;
    background-color: skyblue;
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
      font-size: 1vw;
    }
  }
}
</style>
