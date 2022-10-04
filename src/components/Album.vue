<template>
  <div>
    <div class="image">
      <van-image fit="fill" :src="imgUrl" />
    </div>
    <div class="song-name">{{ songName }}</div>
    <div class="singer">{{ singer }}</div>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: String,
    songName: String,
    singer: String
  }
}
</script>

<style lang='less' scoped>
.image {
  width: 30vw;
  height: 30vw;
  border-radius: 10px;
  margin-right: 3vw;
  border: 1px solid rgb(221, 221, 221);
  overflow: hidden;

  & ~ div {
    margin-top: 1vh;
  }
}

.song-name{
    font-size: 4.5vw;
    font-weight: 500;
}

.singer{
    font-size: 3.5vw;
    color: #ccc;
}
</style>
