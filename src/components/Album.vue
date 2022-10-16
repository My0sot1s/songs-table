<template>
  <!-- 首页方形唱片 -->
  <div>
    <div class="image">
      <van-image width="15vh" height="15vh" fit="fill" :src="imgUrl">
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
        <template #error>加载失败</template>
      </van-image>
    </div>
    <div class="song-name van-ellipsis">{{ songName }}</div>
    <div class="singer van-ellipsis">{{ singer || '佚名' }}</div>
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
  width: 15vh;
  height: 15vh;
  border-radius: 10px;
  margin-right: 3vw;
  // border: 1px solid rgb(221, 221, 221);
  box-shadow: 0 0 5px #999;
  overflow: hidden;

  & ~ div {
    margin-top: 1vh;
  }
}

.song-name {
  font-size: 2vh;
  font-weight: 500;
  width: 15vh;
}

.singer {
  font-size: 1.5vh;
  width: 10vh;
  color: #ccc;
}
</style>
