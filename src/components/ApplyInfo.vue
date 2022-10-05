<template>
  <div class="apply-info">
    <div class="body">
      <div class="image">
        <van-image width="8vh" height="8vh" fit="fill" :src="imgUrl">
          <template #loading>
            <van-loading type="spinner" size="20" />
          </template>
          <template #error>加载失败</template>
        </van-image>
      </div>
      <div class="info">
        <div>
          <div class="song-name">{{ songName }}</div>
          <div>
            <span class="state"><slot name="state"></slot></span>
            <van-icon size="3vh" name="ellipsis" />
          </div>
        </div>
        <div>
          <div class="user">
            <van-icon name="user-o" />
            <span>{{ userName }}</span>
          </div>
          <div class="time">
            <van-icon name="calendar-o" /><span>{{ time }}</span>
          </div>
        </div>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: String,
    songName: String,
    userName: String,
    time: String
  }
}
</script>

<style lang='less' scoped>
.apply-info {
  width: 80vw;
  margin: 2vh auto;
  border-radius: 10px;
  box-shadow: 0 0 10px #aaa;

  .body {
    display: flex;
    padding: 2vh;

    .image {
      width: 8vh;
      height: 8vh;
      border-radius: 5px;
      box-shadow: 0 0 5px #999;
      overflow: hidden;
      margin-right: 2.5vw;
    }

    .info {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      & > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .song-name {
        font-size: 2.5vh;
      }

      .user,
      .time {
        font-size: 2vh;
        color: #555;

        span {
          margin-left: 1vw;
          margin-right: 4vw;
        }
      }

      .state {
        font-size: 1.6vh;
        color: #999;
        margin-right: 2vw;
      }
    }
  }
}
</style>
