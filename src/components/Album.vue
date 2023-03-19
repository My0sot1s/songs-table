<template>
  <!-- 首页方形唱片 -->
  <div @click="toListen">
    <div class="image">
      <van-image
        radius="10px"
        show-loading
        width="25vw"
        height="25vw"
        fit="fill"
        :src="cover"
      >
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
        <template v-slot:error>
          <van-image
            radius="10px"
            show-loading
            width="25vw"
            height="25vw"
            fit="fill"
            src="https://y.qq.com/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000"
            ><template #loading>
              <van-loading type="spinner" size="20" /> </template
          ></van-image>
        </template>
      </van-image>
    </div>
    <div class="detail" :class="{ shorter: !showTime }">
      <van-notice-bar color="black" :text="songName" />
      <!-- <van-notice-bar class="singer" :text="singer || '佚名'" /> -->
      <van-notice-bar class="time" color="gray" v-if="showTime">
        <slot name="time" />
      </van-notice-bar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cover: String,
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
      if (!this.listenUrl) return
      window.location.href = this.listenUrl
    }
  }
}
</script>

<style lang="less" scoped>
.image {
  width: 25vw;
  height: 25vw;
  margin-right: 3vw;
  border-radius: 10px;
  // border: 1px solid rgb(221, 221, 221);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.detail {
  width: 25vw;
  height: 9vw;
  margin-top: 2vw;
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
    width: 25vw;
    font-size: 3vw;
    color: #ccc;
  }
  .time {
    font-size: 3vw;
  }
}

.shorter {
  height: 6vw;
}
</style>
