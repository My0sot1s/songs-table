<template>
  <!-- 首页方形唱片 -->
  <div @click="toListen">
    <div class="image">
      <van-image
        radius="10px"
        show-loading
        width="15vh"
        height="15vh"
        fit="fill"
        :src="imgUrl"
      >
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
    </div>
    <div class="detail" :class="{ shorter: !showTime }">
      <van-notice-bar color="black" :text="songName" />
      <van-notice-bar class="singer" :text="singer || '佚名'" />
      <van-notice-bar class="time" color="gray" v-if="showTime">
        <slot name="time" />
      </van-notice-bar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: String,
    songName: String,
    singer: String,
    listenUrl: String,
    showTime: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toListen() {
      window.location.href = this.listenUrl
    }
  }
}
</script>

<style lang="less" scoped>
.image {
  width: 15vh;
  height: 15vh;
  margin-right: 3vw;
  border-radius: 10px;
  // border: 1px solid rgb(221, 221, 221);
  box-shadow: 0 0 5px #999;
  overflow: hidden;
}

.detail {
  width: 15vh;
  height: 9vh;
  margin-top: 1vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .van-notice-bar {
    height: 0px; /* 真机和开发者工具样式不一致，在真机上加这个，取代默认高度 */
    flex: auto;
    padding: 0 !important;
    background-color: inherit;
    font-size: 2vh;
  }
  .singer {
    width: 15vh;
    font-size: 1.5vh;
    color: #ccc;
  }
  .time {
    font-size: 1.5vh;
  }
}

.shorter {
  height: 6vh;
}
</style>
