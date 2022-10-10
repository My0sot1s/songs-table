<template>
  <div class="music-list">
    <div class="music-list-header">
      <div>{{ title }}</div>
      <slot></slot>
    </div>
    <div>
      <div class="music-list-body">
        <!-- <transition-group tag="div" class="body"> -->
        <div v-if="musicList.length !== 0">
          <Album
            v-for="(item, index) in musicList"
            :key="index"
            :imgUrl="item.imgUrl"
            :songName="item.songName"
            :singer="item.singer"
          />
        </div>
        <div v-else>
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
    musicList: Array
  },
  components: {
    Album
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
    margin-bottom: 2vh;

    & > div {
      margin-left: 1vw;
      font-size: 2.5vh;
    }
  }

  &-body {
    display: flex;
    flex-direction: row;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>>
