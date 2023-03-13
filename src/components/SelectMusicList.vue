<template>
  <div id="selectMusicList" @click.stop>
    <van-form id="search">
      <van-search shape="round" v-model="value" placeholder="搜索歌曲" />
      <div class="mask"></div>
    </van-form>
    <van-empty
      v-show="this.musicList.length === 0 && !this.loading"
      image="search"
      description=""
      class="empty"
    />
    <div
      ref="lottie"
      id="lottie"
      v-show="this.musicList.length === 0 && this.loading"
    ></div>
    <transition name="van-fade">
      <van-list
        v-show="this.musicList.length !== 0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="search(false)"
      >
        <MusicCell
          ref="cells"
          v-for="(music, index) in musicList"
          :key="music.songmid"
          :music="music"
          @click.native="select(index)"
        />
      </van-list>
    </transition>
  </div>
</template>

<script>
import MusicCell from '@/components/MusicCell'
import search from '@/assets/search.json'
import lottie from 'lottie-web'
import { searchQQMuic, searchCloudMuic } from '@/musicApi1'

export default {
  components: {
    MusicCell
  },
  data() {
    return {
      index: 0,
      value: '',
      timer: null,
      selectTimer: null,
      loading: false,
      finished: false,
      musicList: [],
      pageNo: 1,
      animationData: search,
      qqDone: false,
      cloudDone: false
    }
  },
  methods: {
    async renderQQMusic(key) {
      const [err, res] = await searchQQMuic(key)
      if (!err) {
        console.log('qq', res)
        res.list.forEach((item) => {
          item.searchPath = 'qq'
          item.cover = `https://y.qq.com/music/photo_new/T002R300x300M000${item.albummid}_1.jpg?max_age=2592000`
        })
        this.musicList.push(...res.list)
      }
    },
    async renderCloudMusic(key) {
      const [err, res] = await searchCloudMuic(key)
      if (!err) {
        console.log('cloud', res)
        res.songs.forEach((item) => {
          item.searchPath = '网易云'
        })
        this.musicList.push(
          ...res.songs.map((song) => this.formatListItem(song))
        )
      }
    },
    formatListItem(song) {
      class MusicObject {
        constructor(song) {
          this.name = song.name
          this.songmid = song.id
          this.singer = [{ name: '' }]
          this.singer[0].name = song.ar[0].name
          this.albumname = song.al.name
          this.cover = song.al.picUrl
          this.searchPath = '网易云'
        }
      }
      return new MusicObject(song)
    },
    select(index) {
      if (this.index === index) {
        this.confirm()
      } else {
        clearTimeout(this.selectTimer)
        this.selectTimer = setTimeout(() => {
          this.index = index
          this.confirm()
        }, 300)
      }
      /* const cells = [...document.querySelectorAll('.background')]
      cells.forEach((e) => {
        e.style = 'width: 0; height: 0; background-color: white;'
      }) */
      /* cells[index].style =
        'width: 100vw; height: 100vw; background-color: rgb(239, 242, 247);' */
    },
    confirm() {
      this.$emit('confirmMusic', this.musicList[this.index])
    },
    search(refresh = true) {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          if (this.value === '') return
          if (refresh) {
            this.musicList = []
            this.finished = false
            this.qqDone = false
          }
          if (!this.qqDone) {
            // qq音乐的接口只能返回第一页的数据
            await this.renderQQMusic(this.value)
            this.qqDone = true
          } else {
            await this.renderCloudMusic(this.value)
            this.finished = true
          }
          this.loading = false
          this.timer = null
        }, 200)
      }
    }
  },
  watch: {
    value: {
      handler: 'search'
    }
  },
  mounted() {
    this.lottieInstance = lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: search
    })
  },
  destroyed() {
    if (!this.lottieInstance) return
    this.lottieInstance.destroy()
    this.lottieInstance = null
  }
}
</script>

<style lang="less" scoped>
#selectMusicList {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 4vw;
  overflow: scroll;
  overflow-x: hidden;
  height: 80vh;
  #search {
    position: sticky;
    top: 0;
    padding: 6vw 2vw 0vw 2vw;
    z-index: 10;
    .van-search {
      padding: 0;
      position: -webkit-sticky;
      position: sticky;
      top: 0 vw;
      margin-bottom: 1vw;
      .van-search__content {
        background-color: rgb(250, 251, 253);
      }
    }
  }
  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
  #list {
  }
  .mask {
    width: 100%;
    height: 3vw;
    background-image: linear-gradient(
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.6) 60%,
      rgba(255, 255, 255, 0) 100%
    );
    position: absolute;
    z-index: 1;
  }
  .van-list {
    box-sizing: border-box;
    padding: 0 4vw;
    overflow: scroll;
    border-top: 1px solid rgb(250, 251, 253);
    border-bottom: 1px solid rgb(250, 251, 253);
  }
  .van-button {
    margin: 5vw 5vw;
    background-color: rgb(250, 251, 253);
    box-shadow: 0 0 5px #999;
  }
}
</style>
