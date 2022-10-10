<template>
  <div id="selectMusicList" @click.stop>
    <van-form>
      <van-search shape="round" v-model="value" placeholder="" />
    </van-form>
    <van-list
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
      type="default"
      @click="confirm"
      v-if="this.musicList.length != 0"
      >确认</van-button
    >
  </div>
</template>

<script>
import MusicCell from '@/components/MusicCell'

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
      pageNo: 1
    }
  },
  methods: {
    select(index) {
      this.index = index
      this.$refs.cells.forEach((e) => {
        e.$el.style.backgroundColor = 'inherit'
      })
      this.$refs.cells[index].$el.style.backgroundColor = 'rgb(239, 242, 247)'
    },
    confirm() {
      this.$emit('confirmMusic', this.musicList[this.index])
    },
    search(refresh = true) {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (refresh) {
          this.pageNo = 1
          this.musicList = []
        }
        if (this.value.length === 0) return
        const { data } = await this.$musicApi.QQsearchMusic({
          key: this.value,
          pageNo: this.pageNo
        })
        console.log(data.data)
        this.pageNo = ++data.data.pageNo
        this.musicList.push(...data.data.list)
      }, 200)
      // qq音乐的接口只能返回第一页的数据，后面的要客户端，真恶心x
      this.finished = true
    }
  },
  watch: {
    value: {
      handler: 'search'
    }
  }
}
</script>

<style lang="less" scoped>
#selectMusicList {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 22vw 2vw -2vw 2vw;
  padding: 8vw 7vw 0 7vw;
  border-radius: 4vw;
  box-shadow: 0 0 5px #999;
  overflow: scroll;
  z-index: 1;
  .van-search {
    padding: 0;
    margin-bottom: 6vw;
    position: -webkit-sticky;
    position: sticky;
    top: 0 vw;
  }
  .van-list {
    max-height: 100vw;
    padding: 0 1vw 0 1vw;
    border-top: 2px solid rgb(250, 251, 253);
    overflow: scroll;
  }
  .van-button {
    box-shadow: 0 0 5px #999;
    margin: 2vw 11vw 10vw 11vw;
  }
}
</style>
