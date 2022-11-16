<template>
  <div class="music-list">
    <div class="music-list-header">
      <div>{{ title }}</div>
      <slot></slot>
    </div>
    <div>
      <div>
        <!-- <transition-group tag="div" class="body"> -->
        <div class="music-list-body" v-if="musicList.length !== 0">
          <Album
            v-for="(item, index) in musicList"
            :key="index"
            :imgUrl="item.imgUrl"
            :songName="item.songName"
            :singer="item.singer"
            :listenUrl="item.listenUrl"
          >
            <template #time v-if="showTime">{{ item.time }}</template>
          </Album>
        </div>
        <div class="music-list-body" v-else>
          <Album
            imgUrl="https://y.qq.com/music/photo_new/T002R300x300M0000030lak94GN5Ad_0.jpg"
            songName="暂无歌曲"
            singer=" "
          />
        </div>
        <!-- </transition-group> -->
      </div>
    </div>
  </div>
</template>

<script>
import Album from './Album'

export default {
  props: {
    title: String,
    musicList: Array,
    showTime: Boolean
  },
  components: {
    Album
  },
  mounted() {
    console.log(this.musicList)
  }
}
</script>

<style lang="less" scoped>
.music-list {
  padding: 3vw;

  &-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > div {
      margin-left: 1vw;
      font-size: 2.5vh;
    }
  }

  &-body {
    display: flex;
    flex-direction: row;
    overflow: auto;
    padding-top: 2vh;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
