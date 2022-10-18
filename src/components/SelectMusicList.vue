<template>
  <div id="selectMusicList" @click.stop>
    <van-form>
      <van-search shape="round" v-model="value" placeholder="" />
    </van-form>
    <van-empty
      v-show="this.musicList.length === 0 && !this.loading"
      image="search"
      description=""
    />
    <div
      ref="lottie"
      id="lottie"
      v-show="this.musicList.length === 0 && this.loading"
    ></div>
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
        :key="music.songid"
        :music="music"
        @click.native="select(index)"
      />
    </van-list>
    <van-button
      round
      type="default"
      @click="confirm"
      v-if="this.musicList.length != 0"
      >确认</van-button
    >
  </div>
</template>

<script>
import MusicCell from '@/components/MusicCell'
import search from '@/assets/search.json'
import lottie from 'lottie-web'

export default {
  components: {
    MusicCell
  },
  data() {
    return {
      index: 0,
      value: '',
      timer: null,
      loading: false,
      finished: false,
      musicList: [],
      pageNo: 1,
      animationData: search
    }
  },
  methods: {
    select(index) {
      this.index = index
      const cells = [...document.querySelectorAll('#background')]
      cells.forEach((e) => {
        e.style = 'width: 0; height: 0; background-color: white;'
      })
      cells[index].style =
        'width: 100vw; height: 100vw; background-color: rgb(239, 242, 247);'
    },
    confirm() {
      this.$emit('confirmMusic', this.musicList[this.index])
    },
    search(refresh = true) {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (this.value.length === 0) return
        if (refresh) {
          this.finished = false
          this.pageNo = 1
          this.musicList = []
        }
        if (this.musicList.length === 0) {
          this.loading = true
          // qq音乐接口
          const { data } = await this.$musicApi.QQsearchMusic({
            key: this.value,
            pageNo: this.pageNo
          })
          data.data.list.forEach((item) => {
            item.searchPath = 'qq'
            item.cover = `https://y.qq.com/music/photo_new/T002R300x300M000${item.albummid}_1.jpg?max_age=2592000`
          })
          // console.log(data.data.list)
          this.musicList.push(...data.data.list)
          this.loading = false
        } else {
          // 网易云接口
          const { data } = await this.$musicApi.NetEaseCloudSearch({
            keywords: this.value,
            limit: 30,
            offset: 15 * (this.pageNo - 1)
          })
          this.pageNo++
          console.log(data.result.songs)
          /* this.musicList.push(...data.result.songs) */
          function MusicObject(song) {
            this.name = song.name
            this.songmid = song.id
            this.singer = [{ name: '' }]
            this.singer[0].name = song.ar[0].name
            this.albumname = song.al.name
            this.cover = song.al.picUrl
            this.searchPath = '网易云'
          }
          data.result.songs.forEach((song) => {
            this.musicList.push(new MusicObject(song))
          })
          // console.log(this.musicList)
          this.loading = false
          this.finished = true
        }
      }, 200)
      // qq音乐的接口只能返回第一页的数据，后面的要客户端，真恶心x
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
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 22vw 2vw 0 2vw;
  padding: 8vw 7vw 0 7vw;
  border-radius: 4vw;
  overflow: scroll;
  z-index: 1;
  max-height: 70vh;
  .van-search {
    padding: 0;
    position: -webkit-sticky;
    position: sticky;
    top: 0 vw;
    margin-bottom: 3vw;
    .van-search__content {
      background-color: rgb(250, 251, 253);
    }
  }
  .van-list {
    box-sizing: border-box;
    max-height: 45vh;
    padding: 0 1vw 0 1vw;
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
