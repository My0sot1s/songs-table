<template>
  <div class="music-list">
    <div class="music-list-header">
      <div class="title">{{ title }}</div>
      <slot></slot>
    </div>
    <div>
      <div>
        <!-- <transition-group tag="div" class="body"> -->
        <div class="music-list-body" v-if="musicList.length !== 0">
          <Album
            v-for="(item, index) in musicList"
            :key="index"
            :music="item"
            :showTime="showTime"
          >
            <template #time v-if="showTime">{{ item.time }}</template>
          </Album>
        </div>
        <div class="music-list-body" v-else>
          <Album
            :music="{
              cover:
                'https://y.qq.com/music/photo_new/T002R300x300M0000030lak94GN5Ad_0.jpg',
              songName: '暂无歌曲',
              singer: ' '
            }"
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
    position: relative;
    & > div {
      margin-left: 1vw;
      font-size: 4vw;
      font-weight: bold;
    }
    & > .title:before {
      content: '';
      display: block;
      height: 1vw;
      width: 17vw;
      background-color: blue;
      position: absolute;
      top: 6vw;
      border-radius: 6px;
      background-image: linear-gradient(90deg, rgb(128, 165, 221), #0fbcf9);
    }
  }

  &-body {
    display: flex;
    flex-direction: row;
    overflow: auto;
    padding: 5vw 2vw 0 2vw;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
