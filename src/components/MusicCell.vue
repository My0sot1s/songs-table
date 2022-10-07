<template>
  <div id="cell">
    <div id="img"></div>
    <div id="detail">
      <van-notice-bar
        color="black"
        :text="music.name"
      />
      <div id="singer">{{music.singer}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['music']
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
  #img {
    width: 9vw;
    height: 9vw;
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
