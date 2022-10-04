<template>
  <div class="content">
    <div class="header">
      <div>{{title}}</div>
      <van-icon v-if="showIcon" size="8vw" name="apps-o" />
    </div>
    <div class="body">
      <Album
        v-for="(item, index) in todayList"
        :key="index"
        :imgUrl="item.imgUrl"
        :songName="item.songName"
        :singer="item.singer"
      ></Album>
    </div>
  </div>
</template>

<script>
import Album from './Album'

export default {
  props: {
    showIcon: Boolean,
    title: String
  },
  data() {
    return {
      todayList: [
        // {
        //   imgUrl:
        //     'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
        //   songName: '浮夸',
        //   singer: '陈奕迅'
        // },
        // {
        //   imgUrl:
        //     'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
        //   songName: '雅俗共赏',
        //   singer: '许嵩'
        // },
        // {
        //   imgUrl:
        //     'http://p1.music.126.net/vSdrZFQn3uMetLL_j3AnQg==/109951163432562414.jpg',
        //   songName: '贝加尔湖畔',
        //   singer: '李健'
        // },
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅'
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          singer: '许嵩'
        },
        {
          imgUrl:
            'http://p1.music.126.net/vSdrZFQn3uMetLL_j3AnQg==/109951163432562414.jpg',
          songName: '贝加尔湖畔',
          singer: '李健'
        }
      ]
    }
  },
  components: {
    Album
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 3vh;

  & > div {
    margin-left: 1vw;
    font-size: 6vw;
  }
}

.body {
  display: flex;
  flex-direction: row;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>>
